# Website Playgrounds

A collection of small webpages. All sites are orchestrated from a single root `docker-compose.yml`.

## The Collection

| Project            | Local Port   | Description                                                | Preview URL                    |
| ------------------ | ------------ | ---------------------------------------------------------- | ------------------------------ |
| Birthday 🎂        | 1231         | A personalized Birthday site.                              | https://birthday.thierry.beer  |
| Easter 🐰          | 1232         | Easter website wishing you a happy easter.                 | https://easter.thierry.beer    |
| Flower 🌸          | 1234         | A flower for your loved ones.                              | https://flower.thierry.beer    |
| Sunflower 🌻       | 1238         | A little sunshine for someone who could use it.            | https://sunflower.thierry.beer |

## Getting Started

### 1. Configure environment (Optional)

```bash
cp .env.example .env
```
Every site runs without any configuration. Ports can be overriden in `.env` if a default collides with something local.

### 2. Run

Start everything:

```bash
docker compose up -d
```

Or just one site:

```bash
docker compose up -d birthday 
```

### 3. Stop

```bash
docker compose down
```

Or just one site:

```bash
docker compose down birthday

### Reverse Proxy

Traefik is used as a reverse Proxy see the setup under: [Server Config](https://github.com/JegenThierry/server-config)
