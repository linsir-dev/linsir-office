# 高可用架构设计

> **文档编号**: SYS-DES-ARCH-HA-001  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: 🔄 进行中

---

## 1. 概述

### 1.1 目的

本文档定义System平台的高可用架构设计，包括负载均衡、故障转移、数据备份与恢复等方案，确保系统在面对各种故障时仍能提供稳定服务。

### 1.2 设计目标

| 指标 | 目标值 | 说明 |
|-----|-------|------|
| 系统可用性 | 99.9% | 年度停机时间 < 8.76小时 |
| RTO | < 30分钟 | 恢复时间目标 |
| RPO | < 5分钟 | 恢复点目标 |
| 故障切换时间 | < 10秒 | 自动故障切换 |

### 1.3 设计原则

1. **冗余设计**：关键组件多实例部署
2. **故障隔离**：故障不影响整体系统
3. **自动恢复**：故障自动检测与恢复
4. **数据保护**：多副本数据保护
5. **监控告警**：实时监控与及时告警

---

## 2. 高可用架构总览

```
┌─────────────────────────────────────────────────────────────┐
│                    高可用架构总览                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    负载均衡层                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   Nginx 1   │ │   Nginx 2   │ │   Nginx 3   │   │   │
│  │  │  (Master)   │ │  (Backup)   │ │  (Backup)   │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │                    Keepalived                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    应用服务层                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   Gateway   │ │   Gateway   │ │   Gateway   │   │   │
│  │  │     x3      │ │   (HPA)     │ │             │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   System    │ │   System    │ │   System    │   │   │
│  │  │   Service   │ │   Service   │ │   Service   │   │   │
│  │  │     x3      │ │   (HPA)     │ │             │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    数据存储层                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │  MySQL      │ │  MySQL      │ │  MySQL      │   │   │
│  │  │  Master     │ │  Slave 1    │ │  Slave 2    │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   Redis     │ │   Redis     │ │   Redis     │   │   │
│  │  │  Master     │ │  Slave 1    │ │  Slave 2    │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 负载均衡方案

### 3.1 负载均衡架构

#### 3.1.1 四层负载均衡（LVS/Keepalived）

```
┌─────────────────────────────────────────────────────────────┐
│                    LVS + Keepalived架构                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Virtual IP (VIP): 192.168.1.100         │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│           ┌──────────────┼──────────────┐                   │
│           ▼              ▼              ▼                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  LVS Master │  │  LVS Backup │  │  LVS Backup │         │
│  │  (MASTER)   │  │  (BACKUP)   │  │  (BACKUP)   │         │
│  │  Priority   │  │  Priority   │  │  Priority   │         │
│  │    100      │  │     90      │  │     80      │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                │
│         └────────────────┼────────────────┘                │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Real Server Pool                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   Nginx 1   │ │   Nginx 2   │ │   Nginx 3   │   │   │
│  │  │  192.168.   │ │  192.168.   │ │  192.168.   │   │   │
│  │  │   1.101     │ │   1.102     │ │   1.103     │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 3.1.2 七层负载均衡（Nginx）

```nginx
# nginx.conf - 负载均衡配置
upstream gateway_cluster {
    least_conn;  # 最少连接算法
    
    server 10.0.1.10:8080 weight=5 max_fails=3 fail_timeout=30s;
    server 10.0.1.11:8080 weight=5 max_fails=3 fail_timeout=30s;
    server 10.0.1.12:8080 weight=5 max_fails=3 fail_timeout=30s;
    
    keepalive 32;  # 长连接数
}

upstream system_cluster {
    least_conn;
    
    server 10.0.1.20:8080 weight=5 max_fails=3 fail_timeout=30s;
    server 10.0.1.21:8080 weight=5 max_fails=3 fail_timeout=30s;
    server 10.0.1.22:8080 weight=5 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name api.linsir.com;
    
    location / {
        proxy_pass http://gateway_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # 健康检查
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }
}
```

#### 3.1.3 Keepalived配置

```bash
# /etc/keepalived/keepalived.conf - Master节点

global_defs {
    router_id LVS_MASTER
    script_user root
    enable_script_security
}

vrrp_script check_nginx {
    script "/etc/keepalived/check_nginx.sh"
    interval 2
    weight -20
    fall 3
    rise 2
}

vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 100
    advert_int 1
    
    authentication {
        auth_type PASS
        auth_pass 1234
    }
    
    virtual_ipaddress {
        192.168.1.100/24
    }
    
    track_script {
        check_nginx
    }
    
    notify_master "/etc/keepalived/notify.sh master"
    notify_backup "/etc/keepalived/notify.sh backup"
    notify_fault "/etc/keepalived/notify.sh fault"
}
```

```bash
# /etc/keepalived/check_nginx.sh - 健康检查脚本
#!/bin/bash
if ! pgrep -x "nginx" > /dev/null; then
    systemctl start nginx
    sleep 2
    if ! pgrep -x "nginx" > /dev/null; then
        exit 1
    fi
fi
exit 0
```

### 3.2 负载均衡算法

| 算法 | 适用场景 | 说明 |
|-----|---------|------|
| 轮询 (Round Robin) | 服务器性能相同 | 按顺序分配请求 |
| 最少连接 (Least Connections) | 长连接应用 | 分配给当前连接最少的服务器 |
| IP哈希 (IP Hash) | 会话保持 | 同一IP分配到同一服务器 |
| 加权轮询 (Weighted Round Robin) | 服务器性能不同 | 按权重分配 |

---

## 4. 故障转移方案

### 4.1 应用层故障转移

#### 4.1.1 Kubernetes自愈机制

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: linsir-system
  namespace: linsir-prod
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: linsir-system
  template:
    metadata:
      labels:
        app: linsir-system
    spec:
      containers:
        - name: system
          image: harbor.linsir.com/linsir/system-service:1.0.0-prod
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 60
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3
          startupProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5
            failureThreshold: 30
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - linsir-system
                topologyKey: kubernetes.io/hostname
```

#### 4.1.2 服务网格故障转移（Istio）

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: linsir-system-dr
  namespace: linsir-prod
spec:
  host: linsir-system
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        maxRequestsPerConnection: 10
    loadBalancer:
      simple: LEAST_CONN
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
```

### 4.2 数据库故障转移

#### 4.2.1 MySQL主从切换

```yaml
# MySQL Operator配置
apiVersion: mysql.oracle.com/v2
kind: InnoDBCluster
metadata:
  name: linsir-mysql
  namespace: linsir-prod
spec:
  secretName: mysql-secret
  tlsUseSelfSigned: true
  instances: 3
  router:
    instances: 2
  podSpec:
    resources:
      requests:
        memory: "2Gi"
        cpu: "1000m"
      limits:
        memory: "4Gi"
        cpu: "2000m"
```

#### 4.2.2 Redis哨兵模式

```yaml
apiVersion: redis.redis.opstreelabs.in/v1beta1
kind: RedisCluster
metadata:
  name: linsir-redis
  namespace: linsir-prod
spec:
  clusterSize: 3
  kubernetesConfig:
    image: redis:7.0
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 1000m
        memory: 2Gi
  redisExporter:
    enabled: true
    image: oliver006/redis_exporter:latest
  storage:
    type: persistent-claim
    size: 10Gi
    class: standard
```

### 4.3 故障检测与恢复

#### 4.3.1 健康检查配置

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {
    
    @Autowired
    private DataSource dataSource;
    
    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(1)) {
                return Health.up()
                    .withDetail("database", "MySQL is accessible")
                    .build();
            }
        } catch (SQLException e) {
            return Health.down()
                .withDetail("database", "MySQL is not accessible")
                .withException(e)
                .build();
        }
        return Health.down().build();
    }
}
```

#### 4.3.2 熔断器配置（Resilience4j）

```yaml
resilience4j:
  circuitbreaker:
    instances:
      systemService:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 5s
        failureRateThreshold: 50
        eventConsumerBufferSize: 10
  retry:
    instances:
      systemService:
        maxRetryAttempts: 3
        waitDuration: 1s
        exponentialBackoffMultiplier: 2
```

---

## 5. 数据备份与恢复

### 5.1 备份策略

| 数据类型 | 备份方式 | 备份频率 | 保留周期 |
|---------|---------|---------|---------|
| MySQL全量 | xtrabackup | 每日凌晨2点 | 7天 |
| MySQL增量 | binlog | 实时 | 30天 |
| Redis | RDB + AOF | 每小时 | 7天 |
| 配置文件 | Git版本控制 | 每次变更 | 永久 |

### 5.2 MySQL备份方案

#### 5.2.1 全量备份（CronJob）

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: mysql-full-backup
  namespace: linsir-prod
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: percona/percona-xtrabackup:8.0
              command:
                - /bin/sh
                - -c
                - |
                  xtrabackup --backup \
                    --host=mysql.linsir-prod.svc.cluster.local \
                    --user=backup \
                    --password=${MYSQL_BACKUP_PASSWORD} \
                    --target-dir=/backup/$(date +%Y%m%d_%H%M%S) \
                    --parallel=4 \
                    --compress
                  
                  # 上传到对象存储
                  aws s3 sync /backup/ s3://linsir-backup/mysql/ \
                    --endpoint-url=https://minio.linsir.com
              env:
                - name: MYSQL_BACKUP_PASSWORD
                  valueFrom:
                    secretKeyRef:
                      name: mysql-backup-secret
                      key: password
              volumeMounts:
                - name: backup-volume
                  mountPath: /backup
          volumes:
            - name: backup-volume
              emptyDir: {}
          restartPolicy: OnFailure
```

#### 5.2.2 增量备份

```bash
#!/bin/bash
# mysql-incr-backup.sh

BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
MYSQL_HOST="mysql.linsir-prod.svc.cluster.local"
MYSQL_USER="backup"
MYSQL_PASS="${MYSQL_BACKUP_PASSWORD}"

# 基于上次的LSN进行增量备份
xtrabackup --backup \
  --host=${MYSQL_HOST} \
  --user=${MYSQL_USER} \
  --password=${MYSQL_PASS} \
  --target-dir=${BACKUP_DIR}/incr_${DATE} \
  --incremental-basedir=${BACKUP_DIR}/last_backup \
  --parallel=4

# 更新last_backup链接
ln -sfn ${BACKUP_DIR}/incr_${DATE} ${BACKUP_DIR}/last_backup
```

### 5.3 Redis备份方案

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-backup-script
  namespace: linsir-prod
data:
  backup.sh: |
    #!/bin/bash
    BACKUP_DIR="/backup/redis"
    DATE=$(date +%Y%m%d_%H%M%S)
    
    # 执行BGSAVE
    redis-cli -h redis.linsir-prod.svc.cluster.local BGSAVE
    
    # 等待RDB文件生成
    sleep 5
    
    # 复制RDB文件
    cp /data/dump.rdb ${BACKUP_DIR}/dump_${DATE}.rdb
    
    # 压缩
    gzip ${BACKUP_DIR}/dump_${DATE}.rdb
    
    # 上传到对象存储
    aws s3 cp ${BACKUP_DIR}/dump_${DATE}.rdb.gz \
      s3://linsir-backup/redis/ \
      --endpoint-url=https://minio.linsir.com
    
    # 清理旧备份（保留7天）
    find ${BACKUP_DIR} -name "dump_*.rdb.gz" -mtime +7 -delete
```

### 5.4 数据恢复流程

#### 5.4.1 MySQL恢复

```bash
#!/bin/bash
# mysql-restore.sh

BACKUP_DIR="/backup/mysql"
RESTORE_DATE=$1  # 格式：20260308_020000

# 1. 准备备份
xtrabackup --prepare \
  --target-dir=${BACKUP_DIR}/full_${RESTORE_DATE}

# 2. 停止MySQL
kubectl scale deployment mysql --replicas=0 -n linsir-prod

# 3. 清空数据目录
kubectl exec -it mysql-0 -n linsir-prod -- rm -rf /var/lib/mysql/*

# 4. 恢复数据
kubectl cp ${BACKUP_DIR}/full_${RESTORE_DATE} mysql-0:/var/lib/mysql/ -n linsir-prod

# 5. 修改权限
kubectl exec -it mysql-0 -n linsir-prod -- chown -R mysql:mysql /var/lib/mysql

# 6. 启动MySQL
kubectl scale deployment mysql --replicas=1 -n linsir-prod

# 7. 应用binlog（如果需要）
mysqlbinlog --start-datetime="2026-03-08 02:00:00" \
  /var/lib/mysql/binlog.000001 | mysql -u root -p
```

#### 5.4.2 Redis恢复

```bash
#!/bin/bash
# redis-restore.sh

BACKUP_FILE=$1  # 格式：dump_20260308_020000.rdb.gz

# 1. 停止Redis
kubectl scale deployment redis --replicas=0 -n linsir-prod

# 2. 下载备份
aws s3 cp s3://linsir-backup/redis/${BACKUP_FILE} /tmp/ \
  --endpoint-url=https://minio.linsir.com

# 3. 解压
gunzip /tmp/${BACKUP_FILE}

# 4. 恢复RDB文件
kubectl cp /tmp/dump_*.rdb redis-0:/data/dump.rdb -n linsir-prod

# 5. 启动Redis
kubectl scale deployment redis --replicas=1 -n linsir-prod
```

---

## 6. 灾难恢复方案

### 6.1 灾难恢复等级

| 等级 | 场景 | RTO | RPO | 恢复方式 |
|-----|------|-----|-----|---------|
| 1级 | 单实例故障 | < 5分钟 | 0 | 自动切换 |
| 2级 | 单节点故障 | < 15分钟 | < 1分钟 | 自动切换 |
| 3级 | 机房故障 | < 30分钟 | < 5分钟 | 手动切换 |
| 4级 | 地域故障 | < 2小时 | < 1小时 | 灾备切换 |

### 6.2 同城双活架构

```
┌─────────────────────────────────────────────────────────────┐
│                    同城双活架构                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────┐ ┌─────────────────────────┐   │
│  │       机房A (主)        │ │       机房B (备)        │   │
│  │                         │ │                         │   │
│  │  ┌─────────────────┐   │ │  ┌─────────────────┐   │   │
│  │  │   负载均衡集群   │   │ │  │   负载均衡集群   │   │   │
│  │  └────────┬────────┘   │ │  └────────┬────────┘   │   │
│  │           │            │ │           │            │   │
│  │  ┌────────┴────────┐   │ │  ┌────────┴────────┐   │   │
│  │  │   应用服务集群   │   │ │  │   应用服务集群   │   │   │
│  │  └────────┬────────┘   │ │  └────────┬────────┘   │   │
│  │           │            │ │           │            │   │
│  │  ┌────────┴────────┐   │ │  ┌────────┴────────┐   │   │
│  │  │   数据存储集群   │◀──┼─┼──▶│   数据存储集群   │   │   │
│  │  │  (MySQL主从)    │   │ │  │  (MySQL从主)    │   │   │
│  │  │  (Redis主从)    │   │ │  │  (Redis从主)    │   │   │
│  │  └─────────────────┘   │ │  └─────────────────┘   │   │
│  │                         │ │                         │   │
│  └─────────────────────────┘ └─────────────────────────┘   │
│                                                             │
│                    专线同步（< 5ms）                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 灾备切换流程

```
┌─────────────────────────────────────────────────────────────┐
│                    灾备切换流程                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 故障检测                                                │
│     ├── 监控系统告警                                        │
│     ├── 人工确认故障                                        │
│     └── 启动灾备切换                                        │
│                          │                                  │
│                          ▼                                  │
│  2. 流量切换                                                │
│     ├── DNS切换到灾备机房                                   │
│     ├── 负载均衡VIP切换                                     │
│     └── 验证流量接入                                        │
│                          │                                  │
│                          ▼                                  │
│  3. 数据切换                                                │
│     ├── MySQL主从切换                                       │
│     ├── Redis主从切换                                       │
│     └── 验证数据一致性                                      │
│                          │                                  │
│                          ▼                                  │
│  4. 服务验证                                                │
│     ├── 核心功能验证                                        │
│     ├── 性能测试                                            │
│     └── 监控检查                                            │
│                          │                                  │
│                          ▼                                  │
│  5. 恢复生产                                                │
│     ├── 通知相关人员                                        │
│     ├── 更新文档                                            │
│     └── 持续监控                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. 监控与告警

### 7.1 监控指标

| 层级 | 指标 | 告警阈值 |
|-----|------|---------|
| 基础设施 | CPU使用率 | > 80% |
| 基础设施 | 内存使用率 | > 85% |
| 基础设施 | 磁盘使用率 | > 90% |
| 应用服务 | 响应时间 | > 500ms |
| 应用服务 | 错误率 | > 1% |
| 应用服务 | QPS | 根据容量 |
| 数据库 | 连接数 | > 80% |
| 数据库 | 慢查询 | > 10/分钟 |

### 7.2 告警规则

```yaml
groups:
  - name: high-availability-alerts
    rules:
      - alert: ServiceDown
        expr: up{job="linsir-services"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.instance }} is down"
          description: "Service has been down for more than 1 minute"
          
      - alert: HighErrorRate
        expr: |
          (
            sum(rate(http_requests_total{status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total[5m]))
          ) > 0.01
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 1% for 2 minutes"
          
      - alert: DatabaseReplicationLag
        expr: mysql_slave_lag_seconds > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "MySQL replication lag is high"
          description: "Replication lag is {{ $value }} seconds"
```

---

## 8. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义高可用架构设计 |
