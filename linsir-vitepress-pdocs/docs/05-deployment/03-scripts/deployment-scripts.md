# 部署脚本文档

> **阶段**: 部署上线  
> **模块**: 部署脚本  
> **状态**: ✅ 已完成  
> **更新日期**: 2026-05-12

---

## 1. 部署流程概述

### 1.1 部署架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        部署流程                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
        │   代码构建    │ │   镜像打包   │ │   服务部署   │
        │  (Build)     │ │  (Package)  │ │ (Deploy)   │
        └───────┬──────┘ └──────┬──────┘ └──────┬──────┘
                │               │               │
                └───────────────┼───────────────┘
                                │
                    ┌───────────▼───────────┐
                    │      健康检查          │
                    │    (Health Check)     │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │      流量切换          │
                    │   (Traffic Switch)    │
                    └───────────────────────┘
```

### 1.2 部署策略

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| 滚动部署 | 逐个替换实例，无停机 | 常规更新 |
| 蓝绿部署 | 两套环境切换 | 重大版本发布 |
| 金丝雀发布 | 灰度放量 | 风险较高的变更 |

---

## 2. 构建脚本

### 2.1 后端构建脚本

```bash
#!/bin/bash
# backend-build.sh
# 后端应用构建脚本

set -e

# 配置
APP_NAME="linsir-system"
APP_VERSION="1.2.0"
BUILD_DIR="./target"
JAR_NAME="${APP_NAME}-${APP_VERSION}.jar"

echo "=========================================="
echo "开始构建后端应用: ${APP_NAME}"
echo "版本: ${APP_VERSION}"
echo "=========================================="

# 清理旧构建
echo "[1/5] 清理旧构建..."
mvn clean

# 代码编译
echo "[2/5] 编译代码..."
mvn compile -DskipTests

# 运行测试
echo "[3/5] 运行单元测试..."
mvn test

# 打包应用
echo "[4/5] 打包应用..."
mvn package -DskipTests -Pprod

# 验证构建结果
echo "[5/5] 验证构建结果..."
if [ -f "${BUILD_DIR}/${JAR_NAME}" ]; then
    echo "✅ 构建成功: ${BUILD_DIR}/${JAR_NAME}"
    ls -lh ${BUILD_DIR}/${JAR_NAME}
else
    echo "❌ 构建失败，未找到JAR文件"
    exit 1
fi

# 计算MD5
md5sum ${BUILD_DIR}/${JAR_NAME} > ${BUILD_DIR}/${JAR_NAME}.md5
echo "✅ MD5校验文件已生成"

echo "=========================================="
echo "构建完成"
echo "=========================================="
```

### 2.2 前端构建脚本

```bash
#!/bin/bash
# frontend-build.sh
# 前端应用构建脚本

set -e

# 配置
APP_NAME="linsir-system-web"
APP_VERSION="1.2.0"
BUILD_DIR="./dist"

echo "=========================================="
echo "开始构建前端应用: ${APP_NAME}"
echo "版本: ${APP_VERSION}"
echo "=========================================="

# 安装依赖
echo "[1/5] 安装依赖..."
pnpm install

# 代码检查
echo "[2/5] 代码检查..."
pnpm run lint

# 类型检查
echo "[3/5] 类型检查..."
pnpm run typecheck

# 构建生产包
echo "[4/5] 构建生产包..."
pnpm run build:prod

# 验证构建结果
echo "[5/5] 验证构建结果..."
if [ -d "${BUILD_DIR}" ] && [ -f "${BUILD_DIR}/index.html" ]; then
    echo "✅ 构建成功"
    echo "构建输出目录: ${BUILD_DIR}"
    du -sh ${BUILD_DIR}
else
    echo "❌ 构建失败"
    exit 1
fi

# 压缩构建产物
echo "[6/6] 压缩构建产物..."
cd ${BUILD_DIR}
zip -r ../${APP_NAME}-${APP_VERSION}.zip .
cd ..
echo "✅ 压缩包已生成: ${APP_NAME}-${APP_VERSION}.zip"

echo "=========================================="
echo "构建完成"
echo "=========================================="
```

### 2.3 完整构建脚本

```bash
#!/bin/bash
# full-build.sh
# 完整构建脚本（前后端）

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
BUILD_TIME=$(date +%Y%m%d_%H%M%S)
BUILD_VERSION="1.2.0"

echo "=========================================="
echo "Linsir System 完整构建"
echo "版本: ${BUILD_VERSION}"
echo "构建时间: ${BUILD_TIME}"
echo "=========================================="

# 创建构建目录
mkdir -p ${PROJECT_ROOT}/build/${BUILD_TIME}
BUILD_OUTPUT="${PROJECT_ROOT}/build/${BUILD_TIME}"

# 构建后端
echo ""
echo ">>> 构建后端服务..."
cd ${PROJECT_ROOT}/linsir-system-backend
bash ${SCRIPT_DIR}/backend-build.sh
if [ $? -eq 0 ]; then
    cp target/*.jar ${BUILD_OUTPUT}/
    cp target/*.md5 ${BUILD_OUTPUT}/
    echo "✅ 后端构建完成"
else
    echo "❌ 后端构建失败"
    exit 1
fi

# 构建前端
echo ""
echo ">>> 构建前端应用..."
cd ${PROJECT_ROOT}/linsir-system-web
bash ${SCRIPT_DIR}/frontend-build.sh
if [ $? -eq 0 ]; then
    cp *.zip ${BUILD_OUTPUT}/
    echo "✅ 前端构建完成"
else
    echo "❌ 前端构建失败"
    exit 1
fi

# 生成构建报告
echo ""
echo ">>> 生成构建报告..."
cat > ${BUILD_OUTPUT}/build-info.txt << EOF
构建信息
========
应用名称: Linsir System
版本: ${BUILD_VERSION}
构建时间: ${BUILD_TIME}
Git分支: $(git rev-parse --abbrev-ref HEAD)
Git提交: $(git rev-parse --short HEAD)
构建人: $(whoami)
构建机器: $(hostname)

构建产物
========
$(ls -lh ${BUILD_OUTPUT})
EOF

echo ""
echo "=========================================="
echo "完整构建完成"
echo "构建目录: ${BUILD_OUTPUT}"
echo "=========================================="
```

---

## 3. Docker部署脚本

### 3.1 Dockerfile

#### 后端Dockerfile

```dockerfile
# Dockerfile.backend
FROM openjdk:17-jdk-slim

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建工作目录
WORKDIR /app

# 复制JAR文件
COPY target/linsir-system-1.2.0.jar app.jar

# 创建日志目录
RUN mkdir -p /var/log/linsir-system

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# 启动命令
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### 前端Dockerfile

```dockerfile
# Dockerfile.frontend
FROM nginx:alpine

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```

### 3.2 Docker Compose配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 后端服务
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.backend
    image: linsir/system-backend:1.2.0
    container_name: system-backend
    restart: always
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - MYSQL_HOST=mysql
      - MYSQL_PORT=3306
      - MYSQL_DB=linsir_system
      - MYSQL_USER=root
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    volumes:
      - /var/log/linsir-system:/var/log/linsir-system
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      - mysql
      - redis
    networks:
      - system-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # 前端服务
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.frontend
    image: linsir/system-frontend:1.2.0
    container_name: system-frontend
    restart: always
    ports:
      - "80:80"
    volumes:
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      - backend
    networks:
      - system-network

  # MySQL服务
  mysql:
    image: mysql:8.0
    container_name: system-mysql
    restart: always
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=linsir_system
    volumes:
      - mysql-data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
      - /etc/localtime:/etc/localtime:ro
    networks:
      - system-network
    command: --default-authentication-plugin=mysql_native_password

  # Redis服务
  redis:
    image: redis:7-alpine
    container_name: system-redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
      - /etc/localtime:/etc/localtime:ro
    networks:
      - system-network
    command: redis-server /usr/local/etc/redis/redis.conf

volumes:
  mysql-data:
  redis-data:

networks:
  system-network:
    driver: bridge
```

### 3.3 Docker部署脚本

```bash
#!/bin/bash
# docker-deploy.sh
# Docker部署脚本

set -e

# 配置
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"
BACKUP_DIR="/backup/docker"

echo "=========================================="
echo "Docker部署脚本"
echo "=========================================="

# 检查环境文件
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ 环境文件不存在: $ENV_FILE"
    exit 1
fi

# 加载环境变量
source $ENV_FILE

# 备份数据
echo "[1/6] 备份数据..."
mkdir -p $BACKUP_DIR
BACKUP_TIME=$(date +%Y%m%d_%H%M%S)
docker exec system-mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} linsir_system > ${BACKUP_DIR}/mysql_${BACKUP_TIME}.sql
echo "✅ 数据备份完成: ${BACKUP_DIR}/mysql_${BACKUP_TIME}.sql"

# 拉取最新镜像
echo "[2/6] 拉取最新镜像..."
docker-compose pull

# 停止旧服务
echo "[3/6] 停止旧服务..."
docker-compose down --remove-orphans

# 清理旧镜像
echo "[4/6] 清理旧镜像..."
docker image prune -f

# 启动新服务
echo "[5/6] 启动新服务..."
docker-compose up -d

# 健康检查
echo "[6/6] 健康检查..."
sleep 10

HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' system-backend)
if [ "$HEALTH_STATUS" = "healthy" ]; then
    echo "✅ 服务健康检查通过"
else
    echo "⚠️ 服务健康检查未通过，状态: $HEALTH_STATUS"
    echo "查看日志: docker logs system-backend"
fi

# 显示服务状态
echo ""
echo "=========================================="
echo "服务状态"
echo "=========================================="
docker-compose ps

echo ""
echo "=========================================="
echo "部署完成"
echo "=========================================="
```

---

## 4. 传统部署脚本

### 4.1 后端部署脚本

```bash
#!/bin/bash
# deploy-backend.sh
# 后端服务部署脚本

set -e

# 配置
APP_NAME="linsir-system"
APP_VERSION="1.2.0"
DEPLOY_DIR="/opt/linsir-system"
BACKUP_DIR="/opt/backup"
JAR_NAME="${APP_NAME}-${APP_VERSION}.jar"
SERVICE_NAME="linsir-system"

echo "=========================================="
echo "后端服务部署"
echo "应用: ${APP_NAME}"
echo "版本: ${APP_VERSION}"
echo "=========================================="

# 检查JAR文件
if [ ! -f "${JAR_NAME}" ]; then
    echo "❌ JAR文件不存在: ${JAR_NAME}"
    exit 1
fi

# 创建目录
echo "[1/6] 创建部署目录..."
mkdir -p ${DEPLOY_DIR}
mkdir -p ${BACKUP_DIR}
mkdir -p /var/log/linsir-system

# 备份旧版本
echo "[2/6] 备份旧版本..."
if [ -f "${DEPLOY_DIR}/${APP_NAME}.jar" ]; then
    BACKUP_TIME=$(date +%Y%m%d_%H%M%S)
    cp ${DEPLOY_DIR}/${APP_NAME}.jar ${BACKUP_DIR}/${APP_NAME}_${BACKUP_TIME}.jar
    echo "✅ 旧版本已备份: ${BACKUP_DIR}/${APP_NAME}_${BACKUP_TIME}.jar"
fi

# 停止服务
echo "[3/6] 停止服务..."
if systemctl is-active --quiet ${SERVICE_NAME}; then
    systemctl stop ${SERVICE_NAME}
    echo "✅ 服务已停止"
fi

# 部署新版本
echo "[4/6] 部署新版本..."
cp ${JAR_NAME} ${DEPLOY_DIR}/${APP_NAME}.jar
chown -R app:app ${DEPLOY_DIR}
chmod +x ${DEPLOY_DIR}/${APP_NAME}.jar
echo "✅ 新版本已部署"

# 启动服务
echo "[5/6] 启动服务..."
systemctl start ${SERVICE_NAME}
sleep 5

# 健康检查
echo "[6/6] 健康检查..."
for i in {1..10}; do
    if curl -s http://localhost:8080/actuator/health | grep -q '"status":"UP"'; then
        echo "✅ 服务启动成功"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ 服务启动失败，请检查日志"
        journalctl -u ${SERVICE_NAME} -n 50
        exit 1
    fi
    echo "等待服务启动... ($i/10)"
    sleep 3
done

# 显示服务状态
echo ""
echo "=========================================="
echo "服务状态"
echo "=========================================="
systemctl status ${SERVICE_NAME} --no-pager

echo ""
echo "=========================================="
echo "部署完成"
echo "=========================================="
```

### 4.2 前端部署脚本

```bash
#!/bin/bash
# deploy-frontend.sh
# 前端应用部署脚本

set -e

# 配置
APP_NAME="linsir-system-web"
APP_VERSION="1.2.0"
DEPLOY_DIR="/usr/share/nginx/html/system"
BACKUP_DIR="/opt/backup"
PACKAGE_NAME="${APP_NAME}-${APP_VERSION}.zip"

echo "=========================================="
echo "前端应用部署"
echo "应用: ${APP_NAME}"
echo "版本: ${APP_VERSION}"
echo "=========================================="

# 检查包文件
if [ ! -f "${PACKAGE_NAME}" ]; then
    echo "❌ 部署包不存在: ${PACKAGE_NAME}"
    exit 1
fi

# 备份旧版本
echo "[1/5] 备份旧版本..."
if [ -d "${DEPLOY_DIR}" ]; then
    BACKUP_TIME=$(date +%Y%m%d_%H%M%S)
    tar -czf ${BACKUP_DIR}/${APP_NAME}_${BACKUP_TIME}.tar.gz -C ${DEPLOY_DIR} .
    echo "✅ 旧版本已备份: ${BACKUP_DIR}/${APP_NAME}_${BACKUP_TIME}.tar.gz"
fi

# 清理旧文件
echo "[2/5] 清理旧文件..."
if [ -d "${DEPLOY_DIR}" ]; then
    rm -rf ${DEPLOY_DIR}
fi
mkdir -p ${DEPLOY_DIR}

# 解压新版本
echo "[3/5] 解压新版本..."
unzip -q ${PACKAGE_NAME} -d ${DEPLOY_DIR}
chown -R nginx:nginx ${DEPLOY_DIR}
chmod -R 755 ${DEPLOY_DIR}
echo "✅ 新版本已部署到: ${DEPLOY_DIR}"

# 检查Nginx配置
echo "[4/5] 检查Nginx配置..."
nginx -t
if [ $? -ne 0 ]; then
    echo "❌ Nginx配置检查失败"
    exit 1
fi

# 重载Nginx
echo "[5/5] 重载Nginx..."
systemctl reload nginx
echo "✅ Nginx已重载"

# 验证部署
echo ""
echo ">>> 验证部署..."
if curl -s http://localhost | grep -q "Linsir System"; then
    echo "✅ 前端部署成功"
else
    echo "⚠️ 前端部署验证失败，请检查Nginx日志"
fi

echo ""
echo "=========================================="
echo "部署完成"
echo "=========================================="
```

---

## 5. 系统服务配置

### 5.1 Systemd服务配置

```ini
# /etc/systemd/system/linsir-system.service
[Unit]
Description=Linsir System Backend Service
After=syslog.target network.target mysql.service redis.service

[Service]
Type=simple
User=app
Group=app
WorkingDirectory=/opt/linsir-system

# 环境变量
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="JAVA_OPTS=-Xms2g -Xmx2g -XX:+UseG1GC"
EnvironmentFile=/opt/linsir-system/.env

# 启动命令
ExecStart=/usr/local/jdk-17/bin/java $JAVA_OPTS -jar /opt/linsir-system/linsir-system.jar
ExecStop=/bin/kill -15 $MAINPID

# 重启策略
Restart=always
RestartSec=10

# 资源限制
LimitNOFILE=65535
LimitNPROC=65535

[Install]
WantedBy=multi-user.target
```

### 5.2 服务管理脚本

```bash
#!/bin/bash
# service-manager.sh
# 服务管理脚本

SERVICE_NAME="linsir-system"

usage() {
    echo "用法: $0 {start|stop|restart|status|logs}"
    exit 1
}

case "$1" in
    start)
        echo "启动 ${SERVICE_NAME} 服务..."
        systemctl start ${SERVICE_NAME}
        systemctl status ${SERVICE_NAME} --no-pager
        ;;
    stop)
        echo "停止 ${SERVICE_NAME} 服务..."
        systemctl stop ${SERVICE_NAME}
        ;;
    restart)
        echo "重启 ${SERVICE_NAME} 服务..."
        systemctl restart ${SERVICE_NAME}
        sleep 3
        systemctl status ${SERVICE_NAME} --no-pager
        ;;
    status)
        systemctl status ${SERVICE_NAME} --no-pager
        ;;
    logs)
        journalctl -u ${SERVICE_NAME} -f
        ;;
    *)
        usage
        ;;
esac
```

---

## 6. 回滚脚本

### 6.1 后端回滚脚本

```bash
#!/bin/bash
# rollback-backend.sh
# 后端服务回滚脚本

set -e

# 配置
APP_NAME="linsir-system"
DEPLOY_DIR="/opt/linsir-system"
BACKUP_DIR="/opt/backup"
SERVICE_NAME="linsir-system"

echo "=========================================="
echo "后端服务回滚"
echo "=========================================="

# 查找最近的备份
echo "[1/4] 查找可用备份..."
LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/${APP_NAME}_*.jar 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ 未找到可用备份"
    exit 1
fi

echo "找到备份: $LATEST_BACKUP"

# 停止服务
echo "[2/4] 停止服务..."
systemctl stop ${SERVICE_NAME}
echo "✅ 服务已停止"

# 恢复备份
echo "[3/4] 恢复备份..."
cp "$LATEST_BACKUP" ${DEPLOY_DIR}/${APP_NAME}.jar
echo "✅ 备份已恢复"

# 启动服务
echo "[4/4] 启动服务..."
systemctl start ${SERVICE_NAME}
sleep 5

# 验证服务
if systemctl is-active --quiet ${SERVICE_NAME}; then
    echo "✅ 服务启动成功"
else
    echo "❌ 服务启动失败"
    exit 1
fi

echo ""
echo "=========================================="
echo "回滚完成"
echo "=========================================="
```

### 6.2 前端回滚脚本

```bash
#!/bin/bash
# rollback-frontend.sh
# 前端应用回滚脚本

set -e

# 配置
APP_NAME="linsir-system-web"
DEPLOY_DIR="/usr/share/nginx/html/system"
BACKUP_DIR="/opt/backup"

echo "=========================================="
echo "前端应用回滚"
echo "=========================================="

# 查找最近的备份
echo "[1/3] 查找可用备份..."
LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/${APP_NAME}_*.tar.gz 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ 未找到可用备份"
    exit 1
fi

echo "找到备份: $LATEST_BACKUP"

# 恢复备份
echo "[2/3] 恢复备份..."
rm -rf ${DEPLOY_DIR}
mkdir -p ${DEPLOY_DIR}
tar -xzf "$LATEST_BACKUP" -C ${DEPLOY_DIR}
chown -R nginx:nginx ${DEPLOY_DIR}
echo "✅ 备份已恢复"

# 重载Nginx
echo "[3/3] 重载Nginx..."
systemctl reload nginx
echo "✅ Nginx已重载"

echo ""
echo "=========================================="
echo "回滚完成"
echo "=========================================="
```

---

## 7. 一键部署脚本

```bash
#!/bin/bash
# one-click-deploy.sh
# 一键部署脚本

set -e

# 配置
ENV=${1:-prod}
VERSION=${2:-1.2.0}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "Linsir System 一键部署"
echo "环境: ${ENV}"
echo "版本: ${VERSION}"
echo "=========================================="

# 检查参数
if [ "$ENV" != "prod" ] && [ "$ENV" != "uat" ]; then
    echo "❌ 环境参数错误，仅支持 prod 或 uat"
    exit 1
fi

# 确认部署
read -p "确认部署到 ${ENV} 环境? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "部署已取消"
    exit 0
fi

# 执行部署
echo ""
echo ">>> 开始部署流程..."

# 1. 构建
echo "[1/4] 执行构建..."
bash ${SCRIPT_DIR}/full-build.sh
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 2. 部署后端
echo "[2/4] 部署后端服务..."
bash ${SCRIPT_DIR}/deploy-backend.sh
if [ $? -ne 0 ]; then
    echo "❌ 后端部署失败"
    exit 1
fi

# 3. 部署前端
echo "[3/4] 部署前端应用..."
bash ${SCRIPT_DIR}/deploy-frontend.sh
if [ $? -ne 0 ]; then
    echo "❌ 前端部署失败"
    exit 1
fi

# 4. 健康检查
echo "[4/4] 执行健康检查..."
sleep 10

# 后端健康检查
BACKEND_HEALTH=$(curl -s http://localhost:8080/actuator/health | grep -o '"status":"UP"' || echo "DOWN")
if [ "$BACKEND_HEALTH" = '"status":"UP"' ]; then
    echo "✅ 后端服务健康"
else
    echo "❌ 后端服务异常"
    exit 1
fi

# 前端健康检查
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ "$FRONTEND_HEALTH" = "200" ]; then
    echo "✅ 前端服务健康"
else
    echo "❌ 前端服务异常 (HTTP $FRONTEND_HEALTH)"
    exit 1
fi

echo ""
echo "=========================================="
echo "🎉 部署成功!"
echo "环境: ${ENV}"
echo "版本: ${VERSION}"
echo "访问地址: https://system.linsir.com"
echo "=========================================="
```

---

## 8. 脚本目录结构

```
scripts/
├── build/
│   ├── backend-build.sh      # 后端构建
│   ├── frontend-build.sh     # 前端构建
│   └── full-build.sh         # 完整构建
├── deploy/
│   ├── docker-deploy.sh      # Docker部署
│   ├── deploy-backend.sh     # 后端部署
│   └── deploy-frontend.sh    # 前端部署
├── rollback/
│   ├── rollback-backend.sh   # 后端回滚
│   └── rollback-frontend.sh  # 前端回滚
├── utils/
│   ├── service-manager.sh    # 服务管理
│   └── health-check.sh       # 健康检查
└── one-click-deploy.sh       # 一键部署
```

---

## 9. 使用示例

### 9.1 构建部署

```bash
# 完整构建
./scripts/build/full-build.sh

# 部署后端
./scripts/deploy/deploy-backend.sh

# 部署前端
./scripts/deploy/deploy-frontend.sh
```

### 9.2 服务管理

```bash
# 启动服务
./scripts/utils/service-manager.sh start

# 停止服务
./scripts/utils/service-manager.sh stop

# 查看状态
./scripts/utils/service-manager.sh status

# 查看日志
./scripts/utils/service-manager.sh logs
```

### 9.3 一键部署

```bash
# 部署到生产环境
./scripts/one-click-deploy.sh prod 1.2.0

# 部署到UAT环境
./scripts/one-click-deploy.sh uat 1.2.0
```

---

**文档创建:** 2026-05-12  
**最后更新:** 2026-05-12  
**运维负责人:** 周九
