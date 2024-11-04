FROM nginx:latest

WORKDIR /nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY htpasswd /etc/nginx/.htpasswd
COPY index.html /usr/share/nginx/html/index.html

ENTRYPOINT ["/usr/local/bin/shared-entrypoint.sh", "nginx", "-g", "daemon off;"]
