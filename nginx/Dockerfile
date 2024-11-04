FROM nginx:latest

WORKDIR /nginx

RUN apt-get update && apt-get install -y tini

COPY nginx.conf /etc/nginx/nginx.conf
COPY htpasswd /etc/nginx/.htpasswd
COPY index.html /usr/share/nginx/html/index.html

ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/shared-entrypoint.sh", "nginx", "-g", "daemon off;"]
