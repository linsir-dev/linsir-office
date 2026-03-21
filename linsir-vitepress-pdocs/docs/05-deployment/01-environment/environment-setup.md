# 环境搭建文档

> **阶段**: 部署上线  
> **模块**: 环境搭建  
> **状态**: ✅ 已完成  
> **更新日期**: 2026-05-12

---

## 1. 环境规划

### 1.1 环境架构

```
┌─────────────────────────────────────────────────────────────┐
│                         负载均衡层                            │
│                      Nginx / HAProxy                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
│  应用服务器1  │ │  应用服务器2  │ │  应用服务器N  │
│  (Spring Boot)│ │  (Spring Boot)│ │  (Spring Boot)│
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │
       └───────────────┼───────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                      数据存储层                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  MySQL主从    │  │    Redis     │  │   MinIO      │      │
│  │   集群       │  │   集群       │  │  (文件存储)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 环境清单

| 环境类型 | 用途 | 域名 | 访问控制 |
|----------|------|------|----------|
| 开发环境 | 开发联调 | dev-system.linsir.com | 内网访问 |
| 测试环境 | 测试验证 | test-system.linsir.com | 内网访问 |
| UAT环境 | 用户验收 | uat-system.linsir.com | VPN访问 |
| 生产环境 | 正式运行 | system.linsir.com | 公网访问 |

---

## 2. 服务器配置

### 2.1 应用服务器

| 环境 | 服务器规格 | 数量 | 操作系统 | 用途 |
|------|------------|------|----------|------|
| 开发环境 | 4核8G | 1 | CentOS 8 | 应用服务 |
| 测试环境 | 4核8G | 2 | CentOS 8 | 应用服务 |
| UAT环境 | 8核16G | 2 | CentOS 8 | 应用服务 |
| 生产环境 | 8核16G | 3 | CentOS 8 | 应用服务 |

### 2.2 数据库服务器

| 环境 | 服务器规格 | 数量 | 操作系统 | 用途 |
|------|------------|------|----------|------|
| 开发环境 | 4核8G | 1 | CentOS 8 | MySQL + Redis |
| 测试环境 | 4核8G | 1 | CentOS 8 | MySQL + Redis |
| UAT环境 | 8核16G | 2 | CentOS 8 | MySQL主从 + Redis哨兵 |
| 生产环境 | 16核32G | 4 | CentOS 8 | MySQL集群 + Redis集群 |

### 2.3 负载均衡服务器

| 环境 | 服务器规格 | 数量 | 操作系统 | 用途 |
|------|------------|------|----------|------|
| 测试环境 | 2核4G | 1 | CentOS 8 | Nginx负载均衡 |
| UAT环境 | 4核8G | 2 | CentOS 8 | Nginx + Keepalived |
| 生产环境 | 4核8G | 2 | CentOS 8 | Nginx + Keepalived |

---

## 3. 基础软件安装

### 3.1 JDK安装

```bash
# 下载JDK 17
wget https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.tar.gz

# 解压安装
tar -zxvf jdk-17_linux-x64_bin.tar.gz -C /usr/local/
mv /usr/local/jdk-17.* /usr/local/jdk-17

# 配置环境变量
cat >> /etc/profile << 'EOF'
export JAVA_HOME=/usr/local/jdk-17
export PATH=$JAVA_HOME/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib
EOF

# 生效配置
source /etc/profile

# 验证安装
java -version
```

### 3.2 MySQL安装

```bash
# 下载MySQL 8.0
wget https://dev.mysql.com/get/mysql80-community-release-el8-11.noarch.rpm

# 安装Yum源
rpm -ivh mysql80-community-release-el8-11.noarch.rpm

# 安装MySQL
yum install -y mysql-community-server

# 启动服务
systemctl start mysqld
systemctl enable mysqld

# 查看初始密码
grep 'temporary password' /var/log/mysqld.log

# 安全设置
mysql_secure_installation
```

#### MySQL配置优化

```ini
# /etc/my.cnf
[mysqld]
# 基础配置
port=3306
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

# InnoDB配置
innodb_buffer_pool_size = 4G
innodb_log_file_size = 1G
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# 连接配置
max_connections = 500
wait_timeout = 600
interactive_timeout = 600

# 查询缓存
query_cache_type = 1
query_cache_size = 256M

# 日志配置
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

### 3.3 Redis安装

```bash
# 下载Redis 7.0
wget https://download.redis.io/releases/redis-7.0.15.tar.gz

# 解压编译
tar -zxvf redis-7.0.15.tar.gz -C /usr/local/src/
cd /usr/local/src/redis-7.0.15
make && make install

# 创建配置目录
mkdir -p /etc/redis /var/log/redis /var/lib/redis

# 复制配置文件
cp redis.conf /etc/redis/redis.conf

# 创建系统服务
cat > /etc/systemd/system/redis.service << 'EOF'
[Unit]
Description=Redis In-Memory Data Store
After=network.target

[Service]
User=redis
Group=redis
ExecStart=/usr/local/bin/redis-server /etc/redis/redis.conf
ExecStop=/usr/local/bin/redis-cli shutdown
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
systemctl daemon-reload
systemctl start redis
systemctl enable redis
```

#### Redis配置优化

```bash
# /etc/redis/redis.conf
# 基础配置
port 6379
bind 0.0.0.0
requirepass your_password

# 内存配置
maxmemory 2gb
maxmemory-policy allkeys-lru

# 持久化配置
save 900 1
save 300 10
save 60 10000
rdbcompression yes

# AOF配置
appendonly yes
appendfsync everysec

# 日志配置
logfile /var/log/redis/redis.log
loglevel notice
```

### 3.4 Nginx安装

```bash
# 安装Nginx
yum install -y nginx

# 启动服务
systemctl start nginx
systemctl enable nginx

# 防火墙配置
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

### 3.5 Node.js安装

```bash
# 安装Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# 安装pnpm
npm install -g pnpm

# 验证安装
node -v
npm -v
pnpm -v
```

---

## 4. 网络配置

### 4.1 端口规划

| 服务 | 端口 | 协议 | 说明 |
|------|------|------|------|
| Nginx HTTP | 80 | TCP | Web服务 |
| Nginx HTTPS | 443 | TCP | Web服务SSL |
| Spring Boot | 8080 | TCP | 应用服务 |
| MySQL | 3306 | TCP | 数据库 |
| Redis | 6379 | TCP | 缓存 |
| MinIO API | 9000 | TCP | 对象存储API |
| MinIO Console | 9001 | TCP | 对象存储控制台 |

### 4.2 防火墙配置

```bash
# 开放应用端口
firewall-cmd --permanent --add-port=8080/tcp
firewall-cmd --permanent --add-port=3306/tcp
firewall-cmd --permanent --add-port=6379/tcp
firewall-cmd --permanent --add-port=9000/tcp
firewall-cmd --permanent --add-port=9001/tcp

# 重载防火墙
firewall-cmd --reload

# 查看开放端口
firewall-cmd --list-all
```

### 4.3 SELinux配置

```bash
# 临时关闭
setenforce 0

# 永久关闭
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
```

---

## 5. 监控环境搭建

### 5.1 Prometheus安装

```bash
# 下载Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.48.0/prometheus-2.48.0.linux-amd64.tar.gz

# 解压安装
tar -zxvf prometheus-2.48.0.linux-amd64.tar.gz -C /usr/local/
mv /usr/local/prometheus-2.48.0.linux-amd64 /usr/local/prometheus

# 创建系统服务
cat > /etc/systemd/system/prometheus.service << 'EOF'
[Unit]
Description=Prometheus Monitoring System
After=network.target

[Service]
User=root
ExecStart=/usr/local/prometheus/prometheus \
  --config.file=/usr/local/prometheus/prometheus.yml \
  --storage.tsdb.path=/usr/local/prometheus/data
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
systemctl daemon-reload
systemctl start prometheus
systemctl enable prometheus
```

### 5.2 Grafana安装

```bash
# 添加Yum源
cat > /etc/yum.repos.d/grafana.repo << 'EOF'
[grafana]
name=grafana
baseurl=https://packages.grafana.com/oss/rpm
repo_gpgcheck=1
enabled=1
gpgcheck=1
gpgkey=https://packages.grafana.com/gpg.key
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
EOF

# 安装Grafana
yum install -y grafana

# 启动服务
systemctl start grafana-server
systemctl enable grafana-server
```

---

## 6. 环境检查清单

### 6.1 开发环境检查

| 检查项 | 命令 | 预期结果 |
|--------|------|----------|
| JDK版本 | `java -version` | openjdk 17 |
| MySQL状态 | `systemctl status mysqld` | active (running) |
| Redis状态 | `systemctl status redis` | active (running) |
| Nginx状态 | `systemctl status nginx` | active (running) |
| Node版本 | `node -v` | v20.x.x |
| 端口监听 | `netstat -tlnp` | 3306, 6379, 80, 8080 |

### 6.2 生产环境检查

| 检查项 | 命令 | 预期结果 |
|--------|------|----------|
| 负载均衡 | `curl -I http://localhost` | HTTP/1.1 200 OK |
| MySQL主从 | `mysql -e "SHOW SLAVE STATUS\G"` | Slave_IO_Running: Yes |
| Redis集群 | `redis-cli cluster info` | cluster_state:ok |
| 磁盘空间 | `df -h` | 使用率 < 80% |
| 内存使用 | `free -h` | 可用内存 > 20% |
| 系统负载 | `uptime` | load average < 4 |

---

## 7. 常见问题

### 7.1 MySQL连接问题

```bash
# 问题：无法远程连接MySQL
# 解决：授权远程访问
mysql -u root -p
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'password' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### 7.2 Redis连接问题

```bash
# 问题：Redis拒绝连接
# 解决：检查bind配置和防火墙
redis-cli ping
# 应返回 PONG
```

### 7.3 端口冲突问题

```bash
# 查看端口占用
netstat -tlnp | grep 8080

# 结束占用进程
kill -9 <PID>
```

---

**文档创建:** 2026-05-12  
**最后更新:** 2026-05-12  
**运维负责人:** 周九
