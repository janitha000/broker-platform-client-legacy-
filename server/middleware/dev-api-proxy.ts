/**
 * Dev only: same-origin /auth, /cases, /hubs → local APIs.
 * Skip HTML only for /cases so those URLs are Nuxt pages, not Origination.
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

  if (isHtml && (path === "/cases" || path.startsWith("/cases/"))) {
    return;
  }

  const origins: Record<string, string> = {
    "/auth": "http://localhost:5250",
    "/cases": "http://localhost:5135",
    "/hubs": "http://localhost:5290",
  };

  for (const [prefix, origin] of Object.entries(origins)) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      return proxyRequest(event, `${origin}${path}${url.search}`);
    }
  }
});
