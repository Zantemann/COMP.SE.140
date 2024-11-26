FROM openresty/openresty:alpine

RUN apk add --no-cache bash

WORKDIR /nginx

COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY htpasswd /etc/nginx/.htpasswd
COPY index.html /usr/share/nginx/html/index.html

ENTRYPOINT ["/usr/local/bin/shared-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
