import icons from "./icons.json";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/icons") {
      const q = (url.searchParams.get("i") || "").trim();
      if (!q) return new Response("Missing ?i", { status: 400 });
      if (q.includes(",")) {
        return new Response("Only one icon per request (e.g., ?i=sap)", { status: 400 });
      }
      const svg = icons[q];
      if (!svg) return new Response(`Unknown icon: ${q}`, { status: 404 });

      return new Response(svg, {
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const res = await env.ASSETS.fetch(request).catch(() => null);
    if (res && res.ok) {
      const ct = res.headers.get("Content-Type") || "";
      if (ct.includes("svg")) {
        const h = new Headers(res.headers);
        h.set("Content-Type", "image/svg+xml; charset=utf-8");
        h.set("X-Content-Type-Options", "nosniff");
        h.set("Content-Disposition", "inline");
        return new Response(res.body, { status: 200, headers: h });
      }
      return res;
    }

    return new Response("Not found", { status: 404 });
  },
};
