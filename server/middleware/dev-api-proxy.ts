/**
 * Dev only: same-origin /auth, /cases, /audit, /hubs → local APIs.
 * Skip HTML for /cases and /audit so those URLs are Nuxt pages, not APIs.
 * /auth/login and /auth/logout MUST stay proxied (full browser navigation).
 */
export default defineEventHandler((event) => {
  if (!import.meta.dev) {
    return;
  }

  const url = getRequestURL(event);
  const path = url.pathname;
  const accept = getHeader(event, "accept") ?? "";
  const isHtml = accept.includes("text/html");

  if (
    isHtml &&
    (path === "/cases" ||
      path.startsWith("/cases/") ||
      path === "/audit" ||
      path.startsWith("/audit/"))
  ) {
    return;
  }
  const origins: Record<string, string> = {
    "/auth": "http://localhost:5250",
    "/cases": "http://localhost:5135",
    "/hubs": "http://localhost:5290",
    "/audit": "http://localhost:5320",
  };

  for (const [prefix, origin] of Object.entries(origins)) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      return proxyRequest(event, `${origin}${path}${url.search}`);
    }
  }
});
