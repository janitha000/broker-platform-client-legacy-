# Broker platform UI (Nuxt)

Nuxt 4 + Vue 3 SPA. Sibling of the React app in `client/`. Local APIs: copy [`.env.example`](.env.example) to `.env`.

Dev server proxies `/auth` → Identity (`localhost:5250`), `/cases` → Origination (`localhost:5135`), `/hubs` → SignalR (`localhost:5290`).

## Setup

```bash
npm install
npm run dev
```

App: `http://localhost:3000` (on Windows, `http://127.0.0.1:3000` is often faster).

## Layout (Nuxt 4)

| Path | Role |
|---|---|
| `app/app.vue` | Root: layout + page outlet |
| `app/pages/` | File-based routes (`index.vue` → `/`) |
| `app/layouts/` | Chrome around pages |
| `app/components/` | Auto-imported Vue components |
| `app/composables/` | Reusable `useX` logic |
| `nuxt.config.ts` | SPA mode, proxies, runtime config |
