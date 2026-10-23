FROM nginx:stable-alpine

# Static sites, one directory each. No build step: every site is plain
# HTML/CSS/JS with its assets committed alongside it.
COPY birthday/ /srv/birthday/
COPY easter/ /srv/easter/
COPY flower/ /srv/flower/
COPY sunflower/ /srv/sunflower/

# Replace the stock config so nginx's default catch-all server is gone.
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
