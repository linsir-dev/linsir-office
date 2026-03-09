# 部署组件设计流程标准

> **文档编号**: SYS-STD-ARCH-DEPLOY-001  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: ✅ 已完成

---

## 1. 流程概述

### 1.1 目的

本文档定义System平台部署组件设计的标准化流程，包括容器化组件设计和运维组件设计，实现应用的标准化部署、自动化运维和可观测性。

### 1.2 适用范围

- Docker镜像设计
- Kubernetes编排配置
- CI/CD流水线设计
- 监控、日志、告警组件设计

### 1.3 流程目标

1. 建立统一的容器化部署规范
2. 实现自动化CI/CD流水线
3. 构建完整的可观测性体系
4. 确保系统高可用和自动化运维

---

## 2. 流程步骤

### 步骤1: 镜像管理设计

**目标**: 规划镜像仓库、命名规范和版本策略

**输入**:
- 项目架构设计
- 部署环境规划
- 团队开发流程

**活动**:

1. **镜像仓库规划**
   - 选择Harbor作为私有镜像仓库
   - 规划项目隔离（frontend/backend/database/middleware）
   - 配置访问权限控制

2. **镜像命名规范**
   - 格式：`{registry}/{project}/{service}:{version}-{env}`
   - 示例：`harbor.linsir.com/linsir/backend:v1.0.0-prod`

3. **镜像版本策略**
   - 开发版本：`v1.0.0-SNAPSHOT-{build}`
   - 测试版本：`v1.0.0-RC{number}`
   - 生产版本：`v1.0.0`
   - 最新版本：`latest`

**输出**:
- 镜像仓库规划文档
- 镜像命名规范
- 版本管理策略

**验收标准**:
- [√] 镜像仓库规划合理
- [√] 命名规范清晰
- [√] 版本策略支持多环境

---

### 步骤2: Dockerfile设计

**目标**: 设计前后端应用的Dockerfile

**输入**:
- 应用技术栈（Maven/Node.js）
- 安全要求
- 性能优化需求

**活动**:

1. **后端服务Dockerfile**
   - 多阶段构建（builder + runtime）
   - 基础镜像：eclipse-temurin:17-jdk-alpine / eclipse-temurin:17-jre-alpine
   - Maven构建：`./mvnw clean package -DskipTests`
   - 安全优化：非root用户、最小镜像
   - JVM优化：G1垃圾收集器、内存百分比配置
   - 健康检查：Spring Boot Actuator集成

2. **前端应用Dockerfile**
   - 多阶段构建（builder + nginx）
   - 基础镜像：node:20-alpine / nginx:alpine
   - Nginx配置：Gzip压缩、静态资源缓存、前端路由支持
   - API代理配置

**输出**:
- 后端Dockerfile
- 前端Dockerfile
- Nginx配置文件

**验收标准**:
- [√] 多阶段构建优化镜像大小
- [√] 安全最佳实践（非root用户）
- [√] 健康检查配置完整

---

### 步骤3: Kubernetes配置设计

**目标**: 设计K8s编排配置

**输入**:
- 部署环境规划（prod/test/dev）
- 资源需求评估
- 高可用要求

**活动**:

1. **Namespace规划**
   - linsir-prod：生产环境
   - linsir-test：测试环境
   - linsir-dev：开发环境

2. **Deployment配置**
   - 副本数：生产环境最少3个
   - 资源限制：requests/limits配置
   - 滚动更新策略
   - Pod反亲和性配置

3. **Service配置**
   - ClusterIP类型
   - 端口映射配置

4. **Ingress配置**
   - SSL/TLS配置
   - 路由规则
   - 域名配置

5. **HPA自动扩缩容**
   - CPU利用率阈值：70%
   - 内存利用率阈值：80%
   - 自定义指标（如QPS）
   - 扩缩容行为配置

6. **健康检查配置**
   - Liveness Probe
   - Readiness Probe
   - Startup Probe

**输出**:
- Namespace YAML
- Deployment YAML
- Service YAML
- Ingress YAML
- HPA YAML

**验收标准**:
- [√] 资源配置合理
- [√] 高可用配置完整
- [√] 健康检查覆盖全面

---

### 步骤4: CI/CD流水线设计

**目标**: 设计持续集成和持续部署流水线

**输入**:
- 代码仓库（Git）
- 构建工具（Maven/npm）
- 部署平台（K8s）

**活动**:

1. **Jenkins Pipeline**
   - Checkout：代码检出
   - Build：Maven/npm构建
   - Test：单元测试、代码质量检查
   - Build Image：Docker镜像构建和推送
   - Deploy：K8s部署（测试/生产环境）

2. **GitLab CI配置**
   - 并行构建优化
   - 缓存配置
   - 制品管理

3. **自动化测试集成**
   - 单元测试
   - 代码质量检查（SonarQube）
   - 安全扫描

4. **部署策略**
   - 测试环境：自动部署
   - 生产环境：手动审批部署

**输出**:
- Jenkinsfile
- .gitlab-ci.yml
- 流水线文档

**验收标准**:
- [√] 流水线覆盖完整生命周期
- [√] 自动化测试集成
- [√] 多环境部署支持

---

### 步骤5: 监控组件设计

**目标**: 设计系统监控方案

**输入**:
- 监控需求分析
- 基础设施清单
- 业务指标定义

**活动**:

1. **Prometheus部署**
   - 高可用架构
   - 数据保留策略（30天）
   - 抓取配置

2. **Exporter部署**
   - Node Exporter：主机监控
   - MySQL Exporter：数据库监控
   - Redis Exporter：缓存监控
   - JMX Exporter：JVM监控

3. **业务指标监控**
   - 自定义Metrics（Micrometer）
   - 用户注册计数器
   - 订单处理计时器
   - 在线用户Gauge

4. **健康检查指标**
   - 数据库连接检查
   - Redis连接检查
   - 依赖服务检查

**输出**:
- Prometheus配置
- Exporter部署YAML
- 业务指标代码
- 健康检查实现

**验收标准**:
- [√] 基础设施监控覆盖
- [√] 业务指标可观测
- [√] 健康检查完善

---

### 步骤6: 日志组件设计

**目标**: 设计日志收集和分析方案

**输入**:
- 日志量评估
- 日志保留要求
- 分析需求

**活动**:

1. **ELK Stack架构**
   - Fluentd：日志采集
   - Elasticsearch：日志存储
   - Kibana：日志可视化

2. **日志采集配置**
   - DaemonSet部署Fluentd
   - 容器日志收集
   - 多行日志处理

3. **日志存储策略**
   - 索引生命周期管理
   - 30天保留策略
   - 冷热数据分离

4. **日志分析能力**
   - 全文检索
   - 字段过滤
   - 聚合分析

**输出**:
- Fluentd配置
- Elasticsearch部署YAML
- Kibana部署YAML
- 索引模板配置

**验收标准**:
- [√] 日志采集无丢失
- [√] 存储策略合理
- [√] 检索性能满足需求

---

### 步骤7: 告警组件设计

**目标**: 设计告警通知方案

**输入**:
- 告警场景分析
- 通知渠道需求
- 告警收敛要求

**活动**:

1. **Alertmanager配置**
   - 告警路由配置
   - 分组策略
   - 抑制规则

2. **告警规则定义**
   - 服务宕机告警
   - 资源使用率告警（CPU/内存/磁盘）
   - 业务指标告警
   - 错误率告警

3. **通知渠道集成**
   - 邮件通知
   - 钉钉Webhook
   - 企业微信

4. **告警收敛**
   - 重复告警抑制
   - 告警升级策略
   - 静默规则

**输出**:
- Alertmanager配置
- Prometheus告警规则
- Webhook服务代码
- 告警操作手册

**验收标准**:
- [√] 告警覆盖关键场景
- [√] 通知渠道可用
- [√] 告警收敛有效

---

### 步骤8: 可视化组件设计

**目标**: 设计监控可视化方案

**输入**:
- 监控数据源
- Dashboard需求
- 用户角色

**活动**:

1. **Grafana部署**
   - 数据源配置（Prometheus/Elasticsearch）
   - 用户权限管理
   - 插件安装

2. **Dashboard设计**
   - 系统概览Dashboard
   - 应用性能Dashboard
   - 业务监控Dashboard
   - 日志分析Dashboard

**输出**:
- Grafana部署YAML
- Dashboard JSON配置
- 数据源配置

**验收标准**:
- [√] Dashboard覆盖关键指标
- [√] 可视化清晰直观
- [√] 权限控制合理

---

### 步骤9: 部署组件评审

**目标**: 评审部署组件设计结果

**输入**:
- 容器化组件设计文档
- 运维组件设计文档
- 配置文件和代码

**活动**:

1. **容器化组件评审**
   - 镜像管理评审
   - Dockerfile评审
   - K8s配置评审
   - CI/CD流水线评审

2. **运维组件评审**
   - 监控组件评审
   - 日志组件评审
   - 告警组件评审
   - 可视化组件评审

3. **问题处理**
   - 记录评审意见
   - 制定修改计划
   - 完成文档修订

**输出**:
- 部署组件评审记录
- 修订后的设计文档

**验收标准**:
- [√] 评审意见完整记录
- [√] 所有问题已解决
- [√] 文档正式批准

---

## 3. 关键模板

### 3.1 Dockerfile模板（后端）

```dockerfile
# 多阶段构建
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline -B
COPY src src
RUN ./mvnw clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache curl
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
RUN chown -R appuser:appgroup /app
USER appuser
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0"
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### 3.2 Deployment模板

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-name
  namespace: namespace
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: app-name
  template:
    metadata:
      labels:
        app: app-name
    spec:
      containers:
        - name: app
          image: registry/project/service:version
          ports:
            - containerPort: 8080
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "2Gi"
              cpu: "1000m"
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
```

### 3.3 告警规则模板

```yaml
groups:
  - name: app-alerts
    rules:
      - alert: ServiceDown
        expr: up{job=~"app-.*"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "服务 {{ $labels.job }} 宕机"
          description: "服务 {{ $labels.job }} 已宕机超过1分钟"
```

---

## 4. 输出文件

| 序号 | 文件名称 | 文件编号 | 说明 |
|-----|---------|---------|------|
| 1 | 容器化组件设计 | SYS-DES-ARCH-DEPLOY-001 | Docker、K8s、CI/CD |
| 2 | 运维组件设计 | SYS-DES-ARCH-DEPLOY-002 | 监控、日志、告警 |
| 3 | 部署组件评审记录 | SYS-DES-ARCH-DEPLOY-REV-001 | 评审结果和签字 |

---

## 5. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义部署组件设计流程标准 |
