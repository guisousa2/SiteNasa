from __future__ import annotations

import os
from datetime import date
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"
APOD_MIN_DATE = date(1995, 6, 16)


app = FastAPI(title="NASA APOD Proxy", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.get("/api/apod")
async def apod(date_str: str = Query(..., alias="date", description="YYYY-MM-DD")) -> dict:
    api_key = os.getenv("NASA_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Variável de ambiente NASA_API_KEY não encontrada. Configure no arquivo backend/.env.",
        )

    try:
        requested_date = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Data inválida. Use o formato YYYY-MM-DD.")

    if requested_date < APOD_MIN_DATE:
        raise HTTPException(
            status_code=400,
            detail=f"APOD só existe a partir de {APOD_MIN_DATE.isoformat()}.",
        )
    if requested_date > date.today():
        raise HTTPException(status_code=400, detail="A data não pode ser no futuro.")

    params = {"api_key": api_key, "date": requested_date.isoformat(), "thumbs": "true"}

    try:
        async with httpx.AsyncClient(timeout=20, verify=False) as client:
            resp = await client.get(NASA_APOD_URL, params=params)
    except httpx.RequestError:
        raise HTTPException(status_code=502, detail="Falha ao conectar na API da NASA.")

    if resp.status_code != 200:
        detail = "Erro retornado pela API da NASA."
        try:
            payload = resp.json()
            if isinstance(payload, dict) and payload.get("error", {}).get("message"):
                detail = payload["error"]["message"]
        except Exception:
            pass
        raise HTTPException(status_code=resp.status_code, detail=detail)

    data = resp.json()
    if not isinstance(data, dict):
        raise HTTPException(status_code=502, detail="Resposta inesperada da API da NASA.")

    allowed_keys = {
        "date",
        "title",
        "explanation",
        "media_type",
        "url",
        "hdurl",
        "thumbnail_url",
        "copyright",
        "service_version",
    }
    return {k: v for k, v in data.items() if k in allowed_keys}

