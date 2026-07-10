# Website Playgrounds

A collection of small webpages. All sites are orchestrated from a single root `docker-compose.yml`.

## The Collection

| Project            | Default Port | Description                                                |
| ------------------ | ------------ | ---------------------------------------------------------- |
| Christmas 🎄       | 1230         | A small collection of gifts for family.                    |
| Birthday 🎂        | 1231         | A personalized Birthday site.                              |
| Easter 🐰          | 1232         | Easter website wishing you a happy easter.                 |
| Valentine's Day ❤️ | 1233         | A romantic way to confess your love.                       |
| Flower 🌸          | 1234         | A flower for your loved ones.                              |
| Stress Shredder 🌟 | 1235         | Put your worries into the void. No API, no cookies.        |
| F\*\*\* You 🖕     | 1236         | Sometimes people just deserve it!                          |
| Date ✉            | 1237         | Invite someone on a date - sends an email on "Yes".        |
| Sunflower 🌻       | 1238         | A little sunshine for someone who could use it.            |
| Prettiest 💌       | 1239         | A starry love letter for the prettiest girl in the world.  |
| Memory Test 📞     | 1240         | A "phone memory test" — emails you the number she typed.   |
| Adore Justine 💞   | 1242         | A flip-through card of reasons you adore Justine.          |
| Liz's Rewards 🎁   | 1243         | Coupon booklet rewarding Liz for acing her exam.           |
| Love💞             | 1241         | A love letter to the person you love.                      |

## Getting Started

### 1. Configure environment

```bash
cp .env.example .env
```

The `date-api` and `memory-test-api` services require `RESEND_API_KEY` and `TO_EMAIL` — compose refuses to start without them. Every other site runs without any configuration. Ports can be overridden in `.env` if a default collides with something local.

### 2. Run

Start everything:

```bash
docker compose up -d
```

Or just one site:

```bash
docker compose up -d christmas
```

The static sites bind-mount their directory into nginx, so edits to `index.html` / `.css` / `.js` are visible on browser reload — no rebuild needed. Visit `http://localhost:<port>`.

### 3. Stop

```bash
docker compose down
```

## The `date` and `memory-test` services

`date-ui` (nginx) reverse-proxies `/api/*` to `date-api` (Node/Express + Resend) via `date/nginx.conf`. The UI container waits for the API healthcheck before starting. Only the UI is published on a host port; the API is reachable only over the internal docker network.

`memory-test` follows the same pattern: `memory-test-ui` ↔ `memory-test-api` via `memory-test/nginx.conf`, sharing the same `RESEND_API_KEY` / `TO_EMAIL` / `FROM_EMAIL` credentials.

## Reverse-proxy integration

Compose creates a docker network named `nginx-network`. A separate reverse-proxy stack (Traefik, Caddy, nginx-proxy, …) declaring the same network as `external: true` can route hostnames to these containers without going through the published host ports.

## Development

For iterating on either API outside Docker:

```bash
cd date/api          # or: cd memory-test/api
npm install
npm run dev          # node --watch
```
