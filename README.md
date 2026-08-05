# Website Playgrounds

A collection of small webpages. All sites are orchestrated from a single root `docker-compose.yml`.

## The Collection

| Project            | Default Port | Description                                                | Preview URL                    |
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
```


## Reverse-proxy integration

The websites are also available over a nginx-network. You may not need this depending on your setup.
