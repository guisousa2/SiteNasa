## Visão geral

Este repositório contém um **backend em Python (FastAPI)** que faz proxy para a API APOD da NASA e um **frontend** (cliente web) que consome esse backend.

## Pré-requisitos

- **Python**: 3.10+ instalado e disponível no `PATH`
- **Node.js + npm**: apenas para o frontend (por exemplo, apps React/Vite/Next)

## Ambiente virtual do backend (Windows / PowerShell)

Execute os comandos abaixo **a partir da raiz do projeto** (`nasa glen 2`):

```powershell
# (opcional, apenas se ainda não existir)
python -m venv backend\.venv

# ativar o ambiente virtual
.\backend\.venv\Scripts\Activate.ps1

# instalar dependências do backend
pip install -r backend\requirements.txt
```

Certifique-se também de criar o arquivo `backend/.env` com sua chave da NASA:

```text
NASA_API_KEY=sua_chave_aqui
```

## Iniciando o backend

Com o ambiente virtual **já ativado** (`.\backend\.venv\Scripts\Activate.ps1`), rode:

```powershell
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

O backend ficará disponível em `http://127.0.0.1:8000`.

## Iniciando o frontend

Assumindo que o código do frontend esteja na pasta `frontend/` e use **npm**:

```powershell
cd frontend

# instalar dependências (apenas na primeira vez)
npm install

# iniciar em modo de desenvolvimento
npm run dev
```

O comando acima geralmente expõe o frontend em uma porta como `http://127.0.0.1:5173` (ou similar), que consumirá o backend rodando em `http://127.0.0.1:8000`.

