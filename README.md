# basic-index

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Nginx

```
server {
    listen       80;
    server_name  uias-devops.local.com;

    location / {
        return 301 https://$host$request_uri;
    }
}

limit_req_zone $binary_remote_addr zone=one:10m rate=100r/m;
limit_conn_zone $binary_remote_addr zone=addr:10m;
limit_conn_log_level warn;
limit_conn_status 503;
server {
    listen       20287 ssl http2;
    #http2 on;
    server_name  uias-devops.local.com;

    ssl_certificate      cert/ybelesch.outsrkem.top;
    ssl_certificate_key  cert/ybelesch.outsrkem.top;

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
        set $subdir $2;
        try_files /$subdir/$uri $uri/ =404;
        expires 30d;
        add_header Cache-Control "no-cache";
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

        proxy_pass http://127.0.0.1:21243;
    }
}
```
