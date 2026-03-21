# 部署配置文档

> **阶段**: 部署上线  
> **模块**: 部署配置  
> **状态**: ✅ 已完成  
> **更新日期**: 2026-05-12

---

## 1. 应用配置

### 1.1 Spring Boot配置

#### 应用基础配置 (application.yml)

```yaml
# 应用基础配置
server:
  port: 8080
  servlet:
    context-path: /
  tomcat:
    max-threads: 200
    min-spare-threads: 10
    accept-count: 100
    max-connections: 10000

# Spring配置
spring:
  application:
    name: linsir-system
  profiles:
    active: @profileActive@
  
  # 数据源配置
  datasource:
    type: com.zaxxer.hikari.HikariDataSource
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://${MYSQL_HOST:localhost}:${MYSQL_PORT:3306}/${MYSQL_DB:linsir_system}?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
    username: ${MYSQL_USER:root}
    password: ${MYSQL_PASSWORD:}
    hikari:
      pool-name: HikariPool
      minimum-idle: 10
      maximum-pool-size: 50
      idle-timeout: 600000
      max-lifetime: 1800000
      connection-timeout: 30000
      connection-test-query: SELECT 1

  # Redis配置
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
    database: 0
    timeout: 10s
    lettuce:
      pool:
        max-active: 50
        max-idle: 20
        min-idle: 5
        max-wait: 5000ms

  # Servlet配置
  servlet:
    multipart:
      max-file-size: 100MB
      max-request-size: 500MB

# MyBatis Plus配置
mybatis-plus:
  mapper-locations: classpath*:mapper/**/*Mapper.xml
  type-aliases-package: com.linsir.system.domain
  configuration:
    map-underscore-to-camel-case: true
    cache-enabled: true
    lazy-loading-enabled: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: auto
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0

# 日志配置
logging:
  level:
    com.linsir: info
    org.springframework: warn
  file:
    name: /var/log/linsir-system/app.log
    max-size: 100MB
    max-history: 30
```

#### 生产环境配置 (application-prod.yml)

```yaml
# 生产环境配置
server:
  port: 8080

spring:
  # 生产环境数据源
  datasource:
    url: jdbc:mysql://${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DB}?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
    username: ${MYSQL_USER}
    password: ${MYSQL_PASSWORD}
    hikari:
      minimum-idle: 20
      maximum-pool-size: 100

  # 生产环境Redis
  redis:
    host: ${REDIS_HOST}
    port: ${REDIS_PORT}
    password: ${REDIS_PASSWORD}
    lettuce:
      pool:
        max-active: 100
        max-idle: 50

# 日志配置
logging:
  level:
    com.linsir: warn
    org.springframework: error
  file:
    name: /var/log/linsir-system/app.log
```

### 1.2 前端配置

#### 环境变量配置 (.env.production)

```bash
# 生产环境配置
NODE_ENV=production

# API基础URL
VITE_API_BASE_URL=/api

# 上传URL
VITE_UPLOAD_URL=/api/common/upload

# 静态资源URL
VITE_STATIC_URL=/static

# 应用标题
VITE_APP_TITLE=Linsir System

# 应用版本
VITE_APP_VERSION=1.2.0

# 是否开启压缩
VITE_BUILD_COMPRESS=gzip

# 是否开启CDN
VITE_USE_CDN=false

# 是否开启Mock
VITE_USE_MOCK=false
```

#### Nginx配置文件

```nginx
# /etc/nginx/conf.d/system.conf
server {
    listen 80;
    server_name system.linsir.com;
    
    # 强制HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name system.linsir.com;
    
    # SSL证书配置
    ssl_certificate /etc/nginx/ssl/system.linsir.com.crt;
    ssl_certificate_key /etc/nginx/ssl/system.linsir.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # 前端静态资源
    location / {
        root /usr/share/nginx/html/system;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # 缓存配置
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API代理
    location /api/ {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓冲区配置
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }
    
    # 错误页面
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
    
    # 日志配置
    access_log /var/log/nginx/system-access.log;
    error_log /var/log/nginx/system-error.log;
}

# 后端负载均衡
upstream backend_servers {
    least_conn;
    server 192.168.1.10:8080 weight=5 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 weight=5 max_fails=3 fail_timeout=30s;
    server 192.168.1.12:8080 weight=5 max_fails=3 fail_timeout=30s;
    
    keepalive 100;
}
```

---

## 2. 数据库配置

### 2.1 MySQL主从配置

#### 主库配置 (my.cnf)

```ini
[mysqld]
# 服务器ID
server-id = 1

# 开启二进制日志
log-bin = mysql-bin
binlog-format = ROW
expire_logs_days = 7
max_binlog_size = 500M

# 同步数据库
binlog-do-db = linsir_system

# GTID配置
gtid_mode = ON
enforce_gtid_consistency = ON

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

#### 从库配置 (my.cnf)

```ini
[mysqld]
# 服务器ID
server-id = 2

# 开启中继日志
relay-log = mysql-relay-bin

# 只读模式
read_only = 1

# GTID配置
gtid_mode = ON
enforce_gtid_consistency = ON

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

#### 主从同步配置

```sql
-- 主库创建同步用户
CREATE USER 'repl'@'%' IDENTIFIED BY 'repl_password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;

-- 查看主库状态
SHOW MASTER STATUS;

-- 从库配置同步
CHANGE MASTER TO
  MASTER_HOST='master_host',
  MASTER_USER='repl',
  MASTER_PASSWORD='repl_password',
  MASTER_AUTO_POSITION=1;

-- 启动同步
START SLAVE;

-- 查看同步状态
SHOW SLAVE STATUS\G
```

### 2.2 Redis集群配置

#### Redis节点配置

```bash
# /etc/redis/redis-6379.conf
port 6379
cluster-enabled yes
cluster-config-file nodes-6379.conf
cluster-node-timeout 5000
appendonly yes
appendfsync everysec
maxmemory 2gb
maxmemory-policy allkeys-lru
```

#### 集群创建

```bash
# 创建集群
redis-cli --cluster create \
  192.168.1.20:6379 \
  192.168.1.21:6379 \
  192.168.1.22:6379 \
  192.168.1.23:6379 \
  192.168.1.24:6379 \
  192.168.1.25:6379 \
  --cluster-replicas 1

# 查看集群状态
redis-cli cluster info
redis-cli cluster nodes
```

---

## 3. 安全配置

### 3.1 防火墙规则

```bash
#!/bin/bash
# firewall-rules.sh

# 清空现有规则
iptables -F
iptables -X

# 默认策略
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 允许本地回环
iptables -A INPUT -i lo -j ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许SSH (限制IP段)
iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT

# 允许HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 允许应用端口 (仅内网)
iptables -A INPUT -p tcp --dport 8080 -s 192.168.0.0/16 -j ACCEPT

# 允许MySQL (仅内网)
iptables -A INPUT -p tcp --dport 3306 -s 192.168.0.0/16 -j ACCEPT

# 允许Redis (仅内网)
iptables -A INPUT -p tcp --dport 6379 -s 192.168.0.0/16 -j ACCEPT

# 防止DDoS
iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT

# 保存规则
service iptables save
```

### 3.2 SSL证书配置

```bash
#!/bin/bash
# ssl-setup.sh

# 使用Let's Encrypt申请证书
certbot certonly --standalone -d system.linsir.com

# 证书自动续期
echo "0 0 1 * * certbot renew --quiet" | crontab -

# 证书路径
# /etc/letsencrypt/live/system.linsir.com/fullchain.pem
# /etc/letsencrypt/live/system.linsir.com/privkey.pem
```

### 3.3 应用安全配置

```yaml
# 安全配置
security:
  # JWT配置
  jwt:
    secret: ${JWT_SECRET:your-secret-key}
    expiration: 86400000  # 24小时
    refresh-expiration: 604800000  # 7天
  
  # 密码策略
  password:
    min-length: 8
    max-length: 20
    require-uppercase: true
    require-lowercase: true
    require-digit: true
    require-special: true
  
  # 登录安全
  login:
    max-fail-attempts: 5
    lock-duration: 1800  # 30分钟
    captcha-enabled: true
  
  # CORS配置
  cors:
    allowed-origins: https://system.linsir.com
    allowed-methods: GET,POST,PUT,DELETE,OPTIONS
    allowed-headers: "*"
    allow-credentials: true
    max-age: 3600
  
  # XSS防护
  xss:
    enabled: true
    exclude-urls: /api/common/upload
```

---

## 4. 监控配置

### 4.1 Prometheus配置

```yaml
# /usr/local/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']

rule_files:
  - /usr/local/prometheus/rules/*.yml

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'system-application'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: 
        - '192.168.1.10:8080'
        - '192.168.1.11:8080'
        - '192.168.1.12:8080'

  - job_name: 'mysql'
    static_configs:
      - targets: ['192.168.1.20:9104']

  - job_name: 'redis'
    static_configs:
      - targets: ['192.168.1.20:9121']

  - job_name: 'node'
    static_configs:
      - targets: 
        - '192.168.1.10:9100'
        - '192.168.1.11:9100'
        - '192.168.1.12:9100'
```

### 4.2 告警规则

```yaml
# /usr/local/prometheus/rules/system-alerts.yml
groups:
  - name: system-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 5% for 5 minutes"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile response time is above 500ms"

      - alert: ServiceDown
        expr: up{job="system-application"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "Application service is not responding"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is above 85%"

      - alert: HighCPUUsage
        expr: 100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is above 80%"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) < 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Disk space low"
          description: "Less than 10% disk space remaining"
```

---

## 5. 备份配置

### 5.1 MySQL备份脚本

```bash
#!/bin/bash
# mysql-backup.sh

# 配置
DB_HOST="localhost"
DB_USER="backup"
DB_PASS="backup_password"
DB_NAME="linsir_system"
BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
mysqldump -h$DB_HOST -u$DB_USER -p$DB_PASS \
  --single-transaction \
  --routines \
  --triggers \
  $DB_NAME > $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# 压缩备份
gzip $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# 删除7天前的备份
find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -mtime +7 -delete

# 记录日志
echo "[$(date)] MySQL backup completed: ${DB_NAME}_${DATE}.sql.gz" >> /var/log/backup.log
```

### 5.2 Redis备份脚本

```bash
#!/bin/bash
# redis-backup.sh

# 配置
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASS="redis_password"
BACKUP_DIR="/backup/redis"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行BGSAVE
redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASS BGSAVE

# 等待RDB文件生成
sleep 5

# 复制RDB文件
cp /var/lib/redis/dump.rdb $BACKUP_DIR/redis_${DATE}.rdb

# 压缩备份
gzip $BACKUP_DIR/redis_${DATE}.rdb

# 删除7天前的备份
find $BACKUP_DIR -name "redis_*.rdb.gz" -mtime +7 -delete

# 记录日志
echo "[$(date)] Redis backup completed: redis_${DATE}.rdb.gz" >> /var/log/backup.log
```

### 5.3 定时任务配置

```bash
# 编辑crontab
crontab -e

# MySQL每天凌晨2点备份
0 2 * * * /opt/scripts/mysql-backup.sh

# Redis每天凌晨3点备份
0 3 * * * /opt/scripts/redis-backup.sh

# 应用日志每天凌晨4点归档
0 4 * * * /opt/scripts/log-archive.sh

# 磁盘空间每天检查
0 */6 * * * /opt/scripts/disk-check.sh
```

---

## 6. 环境变量配置

### 6.1 生产环境变量 (.env.prod)

```bash
# 数据库配置
MYSQL_HOST=192.168.1.20
MYSQL_PORT=3306
MYSQL_DB=linsir_system
MYSQL_USER=system_user
MYSQL_PASSWORD=your_secure_password

# Redis配置
REDIS_HOST=192.168.1.20
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT配置
JWT_SECRET=your_jwt_secret_key_min_32_chars

# 邮件配置
MAIL_HOST=smtp.linsir.com
MAIL_PORT=587
MAIL_USERNAME=noreply@linsir.com
MAIL_PASSWORD=your_mail_password

# 文件存储
MINIO_ENDPOINT=192.168.1.30:9000
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET_NAME=system-files

# 日志级别
LOG_LEVEL=WARN
```

---

**文档创建:** 2026-05-12  
**最后更新:** 2026-05-12  
**运维负责人:** 周九
