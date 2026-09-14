/**
 * Dev only: same-origin /auth, /cases, /hubs → local APIs.
 * Skip when the browser is loading a page (Accept: text/html) so /cases
 * is the Nuxt route, not Origination.
 */
export default defineEventHandler((event) => {
  if (!import.meta.dev) {
    return;
  }

  const accept = getHeader(event, "accept") ?? "";
  if (accept.includes("text/html")) {
    return;
  }

  const url = getRequestURL(event);
  const path = url.pathname;

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
