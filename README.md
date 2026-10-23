# Website Playgrounds

A collection of small webpages. All sites are orchestrated from a single root `docker-compose.yml`.

## The Collection

| Project            | Description                                                | Preview URL                    |
| ------------------ | ---------------------------------------------------------- | ------------------------------ |
| Birthday 🎂        | A personalized Birthday site.                              | https://birthday.thierry.beer  |
| Easter 🐰          | Easter website wishing you a happy easter.                 | https://easter.thierry.beer    |
| Flower 🌸          | A flower for your loved ones.                              | https://flower.thierry.beer    |
| Sunflower 🌻       | A little sunshine for someone who could use it.            | https://sunflower.thierry.beer |

All four sites are served by a single nginx image (`playgrounds`) that bakes in
every site directory. The image is built by GitHub Actions on every merge to
`main` and published to GitHub Container Registry; the server never builds
anything, it just pulls the image and runs it.

## Getting Started

### Prerequisites

- Docker with Compose v2.
- An existing Traefik reverse proxy with:
  - an external Docker network named `traefik-network`,
  - a TLS entrypoint named `websecure`,
  - an ACME certificate resolver named `letsencrypt`.
- DNS records for `birthday.thierry.beer`, `easter.thierry.beer`,
  `flower.thierry.beer`, and `sunflower.thierry.beer` pointing at the server.

### Publishing

Merging to `main` triggers the `Build and publish image` workflow, which builds
`linux/amd64` and pushes it to `ghcr.io/jegenthierry/playgrounds`, tagged
`latest` and `sha-<full-commit-sha>`.

The package is private by default. Either make it public (package settings →
change visibility) or log in once on the server:

```bash
echo "$CR_PAT" | docker login ghcr.io -u JegenThierry --password-stdin
```

with a classic PAT carrying the `read:packages` scope.

### Deploying

On the server, in the repository directory:

```bash
docker compose pull && docker compose up -d
```

### Updating

After a merge to `main`, rerun `docker compose pull && docker compose up -d`.
`pull` is required: `latest` is a moving tag, and `up -d` alone never checks the
registry for a new digest.

### Rolling back

Edit the image tag in `docker-compose.yml` to a `sha-<full-commit-sha>` value
from the package's tag list, then:

```bash
docker compose pull && docker compose up -d
```

### Viewing logs

```bash
docker compose logs -f
```

### Reverse Proxy

Traefik is used as a reverse Proxy see the setup under: [Server Config](https://github.com/JegenThierry/server-config)
