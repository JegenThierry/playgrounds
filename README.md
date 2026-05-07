# Website Playgrounds

A collection of small webpages. This repository contains several small pagaes each ready to launch with a `docker-compose`  file.

## The Collection

| Project | Description |
| ----------- | ----------- |
| Christmas 🎄 | A small collection of gifts for family. |
| Flower 🌸 | A flower for your loved ones. |
| Valentine's Day ❤️ | A romantic way to confess your love. |
| Birthday 🎂 | A personalized Birthday site. |
| Easter 🐰 | Easter website wishing you a happy easter. |
| Date ✉ | Invite someone on a date. No guarantees for your success. |
| Stress Shredder 🌟 | Put your worries into the void. No API ; No Cookies ; No tracking |
| F*** You 🖕 |  Sometimes people just deserve it! |


## Getting Started

Every project in this repository is equipped with a `docker-compose.yaml` file for quick deployment.

### Running a Playground
You may need to remove the `networks` section in the `docker-compose.yaml` file and add a `ports` section if you are not using a docker network setup

```yaml
services:
  valentines-site:
    container_name: valentines_site
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "1236:80"
    volumes:
      - ./:/usr/share/nginx/html
    restart: unless-stopped
```

Navigate to the specific project folder:

```bash
cd christmas
```
Launch the container:

```bash
docker-compose up -d
```
View the site by opening your browser to `http://localhost:[PORT]`

Check the specific docker-compose.yml file in each folder to verify the assigned port.
