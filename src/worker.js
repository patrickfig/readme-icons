// src/worker.js
import icons from "./icons.json";

export default {
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname !== "/icons") {
      return new Response("Not found", { status: 404 });
    }

    const q = (url.searchParams.get("i") || "").trim();
    if (!q) return new Response("Missing ?i", { status: 400 });

    // NÃO suportamos lista aqui: é 1 ícone por vez, exatamente como veio.
    if (q.includes(",")) {
      return new Response("Only one icon per request (e.g., ?i=sap)", { status: 400 });
    }

    // pega o conteúdo bruto do arquivo lido no build (ex.: sap.svg)
    const svg = icons[q];
    if (!svg) return new Response(`Unknown icon: ${q}`, { status: 404 });

    // devolve exatamente o SVG como foi lido, sem modificar nada
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
