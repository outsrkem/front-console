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

server {
    listen       443 ssl http2;
    server_name  uias-devops.local.com;

    ssl_certificate      cert/server.pem;
    ssl_certificate_key  cert/server-key.pem;

    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    root   /opt/uias;
    index index.html index.htm;

    location / {
        root   /opt/uias/basic-index;
        try_files $uri $uri/ /index.html;
    }
    location /uias-devops {
        root   /opt/uias;
        try_files $uri $uri/ /uias-devops/index.html;
    }
    location /uias {
        proxy_set_header Host $host;
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Request-Id $req_id;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Client-Real-ip $remote_addr;
        proxy_pass http://127.0.0.1:8080;
    }
}
```
