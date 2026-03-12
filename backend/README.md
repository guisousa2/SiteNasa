# Backend (Python) - NASA APOD

Este backend expõe um endpoint simples que recebe uma data e consulta a API APOD da NASA usando a variável `NASA_API_KEY` do seu arquivo `.env`.

## Setup

1) Crie `backend/.env` (ou use o seu existente) com:

```
NASA_API_KEY=sua_chave_aqui
```

2) Instale dependências (usando o seu venv `backend/.venv`):

```powershell
.\backend\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

## Rodar

```powershell
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

## Uso

- Healthcheck: `GET /health`
- APOD por data: `GET /api/apod?date=YYYY-MM-DD`

