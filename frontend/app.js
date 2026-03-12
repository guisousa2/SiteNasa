const API_BASE = "http://127.0.0.1:8000";

const form = document.getElementById("form");
const birthdate = document.getElementById("birthdate");
const result = document.getElementById("result");
const btn = document.getElementById("btn");
const apiBaseLabel = document.getElementById("apiBaseLabel");
apiBaseLabel.textContent = API_BASE;

function setBusy(isBusy) {
  btn.disabled = isBusy;
  birthdate.disabled = isBusy;
  btn.textContent = isBusy ? "Buscando..." : "Buscar";
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderError(message) {
  result.innerHTML = `
    <div class="alert danger">
      <strong>Erro:</strong> ${escapeHtml(message)}
    </div>
  `;
}

function renderLoading() {
  result.innerHTML = `
    <div class="alert">
      Carregando APOD...
    </div>
  `;
}

function renderApod(data) {
  const title = data?.title ?? "Sem título";
  const date = data?.date ?? "";
  const explanation = data?.explanation ?? "";
  const mediaType = data?.media_type ?? "";
  const url = data?.url ?? "";
  const hdurl = data?.hdurl ?? "";
  const thumb = data?.thumbnail_url ?? "";

  let mediaHtml = "";
  if (mediaType === "image" && url) {
    mediaHtml = `<img alt="${escapeHtml(title)}" src="${escapeHtml(url)}" loading="lazy" />`;
  } else if (mediaType === "video" && url) {
    mediaHtml = `
      <iframe
        src="${escapeHtml(url)}"
        title="${escapeHtml(title)}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
  } else if (thumb) {
    mediaHtml = `<img alt="${escapeHtml(title)}" src="${escapeHtml(thumb)}" loading="lazy" />`;
  } else {
    mediaHtml = `<div class="alert">Mídia indisponível para essa data.</div>`;
  }

  const links = [];
  if (url) links.push(`<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">Abrir URL</a>`);
  if (hdurl) links.push(`<a href="${escapeHtml(hdurl)}" target="_blank" rel="noreferrer">Abrir HD</a>`);

  result.innerHTML = `
    <div class="alert ok">
      <strong>Resultado:</strong> APOD de <strong>${escapeHtml(date)}</strong>
    </div>

    <div class="media">
      ${mediaHtml}
    </div>

    <div class="meta">
      <h2>${escapeHtml(title)}</h2>
      <p class="date">${escapeHtml(mediaType ? `Tipo: ${mediaType}` : "")}</p>
      <p class="explanation">${escapeHtml(explanation)}</p>
      ${links.length ? `<div class="links">${links.join("")}</div>` : ""}
    </div>
  `;
}

async function fetchApod(dateStr) {
  const url = new URL(`${API_BASE}/api/apod`);
  url.searchParams.set("date", dateStr);
  const res = await fetch(url, { method: "GET" });
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = payload?.detail || "Falha ao obter dados.";
    throw new Error(msg);
  }
  return payload;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dateStr = birthdate.value;
  if (!dateStr) return;

  setBusy(true);
  renderLoading();
  try {
    const data = await fetchApod(dateStr);
    renderApod(data);
  } catch (err) {
    renderError(err?.message || "Erro inesperado.");
  } finally {
    setBusy(false);
  }
});

