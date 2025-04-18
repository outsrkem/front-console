# Console

### Nginx 配置文件

```
# /etc/nginx/nginx.conf
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  4096;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    map $http_x_request_id $req_id {
        default $http_x_request_id;
        ''      $request_id;
    }

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" "$http_user_agent" '
                      '$request_length $request_time $upstream_addr '
                      '$upstream_response_length $upstream_response_time $upstream_status $req_id';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    # The Nginx version number is not displayed
    server_tokens off;

    # openssl dhparam 2048 -out /etc/nginx/cert/dhparam.pem
    ssl_dhparam "/etc/nginx/cert/dhparam.pem";

    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    include /etc/nginx/conf.d/*.conf;
}
```

```
# /etc/nginx/conf.d/default.conf
# Flow control
limit_req_zone $binary_remote_addr zone=one:10m rate=100r/m;
limit_conn_zone $binary_remote_addr zone=addr:10m;
limit_conn_log_level warn;
limit_conn_status 503;

server {
    listen       80;
    server_name  uias.local.com;

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen       30078 ssl;
    http2 on;
    server_name  uias.local.com;

    ssl_certificate      cert/server.pem;
    ssl_certificate_key  cert/server-key.pem;

    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    gzip on;
    gzip_buffers 32 4K;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types application/javascript text/css text/xml application/json image/x-icon;
    gzip_vary on;

    location = / {
        return 302 /console;
    }

    location / {
        limit_req zone=one burst=200 nodelay;
        limit_conn addr 20;
        root   /opt/www;
        try_files /$uri $uri/ =404;
        expires 30d;
        add_header Cache-Control "no-cache";
        add_header Strict-Transport-Security "max-age=31536000" always;
    }

    location /api {
        limit_req zone=one burst=100 nodelay;
        limit_conn addr 10;
        proxy_set_header Host $host;
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Request-Id $req_id;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Client-Real-ip $remote_addr;

        proxy_pass http://127.0.0.1:18080;
    }
}
```
