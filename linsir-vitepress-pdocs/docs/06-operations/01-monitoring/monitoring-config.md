# 监控配置文档

> **阶段**: 运维维护  
> **模块**: 监控告警  
> **状态**: ✅ 已完成  
> **更新日期**: 2026-05-12

---

## 1. 监控体系架构

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        监控体系架构                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   指标采集    │  │   日志采集    │  │   链路追踪    │
│  Prometheus  │  │    ELK       │  │   Jaeger     │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
              ┌──────────▼──────────┐
              │      数据存储        │
              │  Prometheus TSDB     │
              │  Elasticsearch       │
              │  ClickHouse          │
              └──────────┬──────────┘
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐
│   Grafana    │  │   告警管理    │  │   通知渠道    │
│   可视化     │  │  Alertmanager│  │  钉钉/邮件/短信│
└──────────────┘  └──────────────┘  └──────────────┘
```

### 1.2 监控层次

| 层次 | 监控对象 | 监控工具 | 采集频率 |
|------|----------|----------|----------|
| 基础设施 | CPU/内存/磁盘/网络 | Node Exporter | 15s |
| 中间件 | MySQL/Redis/Nginx | 各Exporter | 15s |
| 应用服务 | JVM/HTTP/业务指标 | Micrometer | 15s |
| 业务监控 | 用户行为/业务流程 | 自定义埋点 | 实时 |

---

## 2. Prometheus配置

### 2.1 主配置文件

```yaml
# /usr/local/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'linsir-system'
    replica: '{{.ExternalURL}}'

# 告警管理
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']
      timeout: 10s
      api_version: v2

# 规则文件
rule_files:
  - /usr/local/prometheus/rules/*.yml

# 采集配置
scrape_configs:
  # Prometheus自身监控
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: /metrics

  # 应用服务监控
  - job_name: 'system-backend'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets:
          - '192.168.1.10:8080'
          - '192.168.1.11:8080'
          - '192.168.1.12:8080'
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance

  # 前端Nginx监控
  - job_name: 'nginx'
    static_configs:
      - targets: ['192.168.1.10:9113']

  # MySQL监控
  - job_name: 'mysql'
    static_configs:
      - targets: ['192.168.1.20:9104']

  # Redis监控
  - job_name: 'redis'
    static_configs:
      - targets: ['192.168.1.20:9121']

  # 服务器资源监控
  - job_name: 'node'
    static_configs:
      - targets:
          - '192.168.1.10:9100'
          - '192.168.1.11:9100'
          - '192.168.1.12:9100'
          - '192.168.1.20:9100'
```

### 2.2 告警规则配置

```yaml
# /usr/local/prometheus/rules/system-alerts.yml
groups:
  - name: system-critical-alerts
    rules:
      # 服务宕机告警
      - alert: ServiceDown
        expr: up{job=~"system-backend|nginx|mysql|redis"} == 0
        for: 1m
        labels:
          severity: critical
          team: ops
        annotations:
          summary: "服务宕机: {{ $labels.job }}"
          description: "{{ $labels.instance }} 的服务 {{ $labels.job }} 已宕机超过1分钟"
          runbook_url: "https://wiki.linsir.com/runbooks/service-down"

      # 高错误率告警
      - alert: HighErrorRate
        expr: |
          (
            sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) by (instance)
            /
            sum(rate(http_server_requests_seconds_count[5m])) by (instance)
          ) > 0.05
        for: 2m
        labels:
          severity: critical
          team: dev
        annotations:
          summary: "高错误率: {{ $labels.instance }}"
          description: "错误率超过5%，当前值: {{ $value | humanizePercentage }}"

      # 响应时间过长告警
      - alert: HighResponseTime
        expr: |
          histogram_quantile(0.95, 
            sum(rate(http_server_requests_seconds_bucket[5m])) by (le, instance)
          ) > 0.5
        for: 5m
        labels:
          severity: warning
          team: dev
        annotations:
          summary: "响应时间过长: {{ $labels.instance }}"
          description: "P95响应时间超过500ms，当前值: {{ $value | humanizeDuration }}"

      # 高CPU使用率告警
      - alert: HighCPUUsage
        expr: |
          100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
          team: ops
        annotations:
          summary: "CPU使用率过高: {{ $labels.instance }}"
          description: "CPU使用率超过80%，当前值: {{ $value | humanize }}%"

      # 高内存使用率告警
      - alert: HighMemoryUsage
        expr: |
          (
            node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes
          ) / node_memory_MemTotal_bytes * 100 > 85
        for: 5m
        labels:
          severity: warning
          team: ops
        annotations:
          summary: "内存使用率过高: {{ $labels.instance }}"
          description: "内存使用率超过85%，当前值: {{ $value | humanize }}%"

      # 磁盘空间不足告警
      - alert: DiskSpaceLow
        expr: |
          (
            node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"} /
            node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"}
          ) * 100 < 10
        for: 5m
        labels:
          severity: critical
          team: ops
        annotations:
          summary: "磁盘空间不足: {{ $labels.instance }}"
          description: "磁盘可用空间低于10%，当前值: {{ $value | humanize }}%"

      # MySQL连接数告警
      - alert: MySQLHighConnections
        expr: |
          mysql_global_status_threads_connected / mysql_global_variables_max_connections * 100 > 80
        for: 5m
        labels:
          severity: warning
          team: dba
        annotations:
          summary: "MySQL连接数过高"
          description: "MySQL连接数使用率超过80%，当前值: {{ $value | humanize }}%"

      # Redis内存告警
      - alert: RedisHighMemory
        expr: |
          redis_memory_used_bytes / redis_memory_max_bytes * 100 > 90
        for: 5m
        labels:
          severity: warning
          team: ops
        annotations:
          summary: "Redis内存使用率过高"
          description: "Redis内存使用率超过90%，当前值: {{ $value | humanize }}%"

  - name: system-business-alerts
    rules:
      # 登录失败率告警
      - alert: HighLoginFailureRate
        expr: |
          (
            sum(rate(login_total{status="failure"}[5m]))
            /
            sum(rate(login_total[5m]))
          ) > 0.1
        for: 5m
        labels:
          severity: warning
          team: security
        annotations:
          summary: "登录失败率过高"
          description: "登录失败率超过10%，可能存在暴力破解攻击"

      # 业务异常告警
      - alert: BusinessException
        expr: |
          sum(rate(business_exception_total[5m])) > 10
        for: 2m
        labels:
          severity: warning
          team: dev
        annotations:
          summary: "业务异常增多"
          description: "业务异常数量超过阈值，请检查业务逻辑"
```

---

## 3. Alertmanager配置

### 3.1 主配置文件

```yaml
# /usr/local/alertmanager/alertmanager.yml
global:
  smtp_smarthost: 'smtp.linsir.com:587'
  smtp_from: 'alert@linsir.com'
  smtp_auth_username: 'alert@linsir.com'
  smtp_auth_password: 'your_smtp_password'
  smtp_require_tls: true

# 路由配置
route:
  receiver: 'default'
  group_by: ['alertname', 'severity', 'team']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    # 关键告警路由
    - match:
        severity: critical
      receiver: 'critical-alerts'
      group_wait: 10s
      repeat_interval: 1h
      continue: true

    # 开发团队告警
    - match:
        team: dev
      receiver: 'dev-team'
      group_wait: 30s

    # 运维团队告警
    - match:
        team: ops
      receiver: 'ops-team'
      group_wait: 30s

    # DBA团队告警
    - match:
        team: dba
      receiver: 'dba-team'
      group_wait: 30s

# 抑制规则
inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']

# 接收器配置
receivers:
  - name: 'default'
    email_configs:
      - to: 'ops@linsir.com'
        send_resolved: true

  - name: 'critical-alerts'
    email_configs:
      - to: 'ops@linsir.com,cto@linsir.com'
        send_resolved: true
    webhook_configs:
      - url: 'https://oapi.dingtalk.com/robot/send?access_token=your_token'
        send_resolved: true

  - name: 'dev-team'
    email_configs:
      - to: 'dev@linsir.com'
        send_resolved: true
    dingtalk_configs:
      - webhook_url: 'https://oapi.dingtalk.com/robot/send?access_token=dev_token'
        title: '开发团队告警'

  - name: 'ops-team'
    email_configs:
      - to: 'ops@linsir.com'
        send_resolved: true
    dingtalk_configs:
      - webhook_url: 'https://oapi.dingtalk.com/robot/send?access_token=ops_token'
        title: '运维团队告警'

  - name: 'dba-team'
    email_configs:
      - to: 'dba@linsir.com'
        send_resolved: true
```

---

## 4. Grafana监控大盘

### 4.1 系统概览大盘

```json
{
  "dashboard": {
    "title": "System Overview",
    "tags": ["linsir", "overview"],
    "timezone": "Asia/Shanghai",
    "panels": [
      {
        "title": "系统健康状态",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=~\"system-backend|nginx|mysql|redis\"}",
            "legendFormat": "{{job}}"
          }
        ]
      },
      {
        "title": "QPS",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_server_requests_seconds_count[1m]))",
            "legendFormat": "总QPS"
          }
        ]
      },
      {
        "title": "响应时间P95",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le))",
            "legendFormat": "P95"
          }
        ]
      },
      {
        "title": "错误率",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_server_requests_seconds_count{status=~\"5..\"}[5m])) / sum(rate(http_server_requests_seconds_count[5m]))",
            "legendFormat": "错误率"
          }
        ]
      }
    ]
  }
}
```

### 4.2 JVM监控大盘

```json
{
  "dashboard": {
    "title": "JVM Metrics",
    "tags": ["linsir", "jvm"],
    "panels": [
      {
        "title": "堆内存使用",
        "type": "graph",
        "targets": [
          {
            "expr": "jvm_memory_used_bytes{area=\"heap\"}",
            "legendFormat": "{{instance}} - 已使用"
          },
          {
            "expr": "jvm_memory_max_bytes{area=\"heap\"}",
            "legendFormat": "{{instance}} - 最大值"
          }
        ]
      },
      {
        "title": "GC次数",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(jvm_gc_pause_seconds_count[5m])",
            "legendFormat": "{{instance}} - {{action}}"
          }
        ]
      },
      {
        "title": "线程数",
        "type": "graph",
        "targets": [
          {
            "expr": "jvm_threads_live_threads",
            "legendFormat": "{{instance}} - 活跃线程"
          }
        ]
      }
    ]
  }
}
```

### 4.3 业务监控大盘

```json
{
  "dashboard": {
    "title": "Business Metrics",
    "tags": ["linsir", "business"],
    "panels": [
      {
        "title": "用户登录统计",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(login_total[5m])) by (status)",
            "legendFormat": "{{status}}"
          }
        ]
      },
      {
        "title": "API调用TOP10",
        "type": "table",
        "targets": [
          {
            "expr": "topk(10, sum(rate(http_server_requests_seconds_count[1h])) by (uri))",
            "format": "table"
          }
        ]
      },
      {
        "title": "活跃用户",
        "type": "stat",
        "targets": [
          {
            "expr": "count(count by (username) (login_total))",
            "legendFormat": "今日活跃用户"
          }
        ]
      }
    ]
  }
}
```

---

## 5. 应用埋点配置

### 5.1 Spring Boot配置

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus,metrics
      base-path: /actuator
  endpoint:
    health:
      show-details: always
      probes:
        enabled: true
    prometheus:
      enabled: true
  metrics:
    export:
      prometheus:
        enabled: true
    tags:
      application: ${spring.application.name}
    distribution:
      slo:
        http: 50ms,100ms,200ms,500ms,1s,2s
```

### 5.2 自定义业务指标

```java
@Component
public class BusinessMetrics {
    
    private final MeterRegistry meterRegistry;
    private final Counter loginSuccessCounter;
    private final Counter loginFailureCounter;
    private final Timer businessProcessTimer;
    
    public BusinessMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        
        this.loginSuccessCounter = Counter.builder("login_total")
            .tag("status", "success")
            .description("登录成功次数")
            .register(meterRegistry);
            
        this.loginFailureCounter = Counter.builder("login_total")
            .tag("status", "failure")
            .description("登录失败次数")
            .register(meterRegistry);
            
        this.businessProcessTimer = Timer.builder("business_process_duration")
            .description("业务流程执行时间")
            .register(meterRegistry);
    }
    
    public void recordLoginSuccess() {
        loginSuccessCounter.increment();
    }
    
    public void recordLoginFailure() {
        loginFailureCounter.increment();
    }
    
    public void recordBusinessProcess(Runnable process) {
        businessProcessTimer.record(process);
    }
}
```

---

## 6. 日志监控配置

### 6.1 Filebeat配置

```yaml
# /etc/filebeat/filebeat.yml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/linsir-system/*.log
  fields:
    app: linsir-system
    env: production
  multiline.pattern: '^\d{4}-\d{2}-\d{2}'
  multiline.negate: true
  multiline.match: after

output.elasticsearch:
  hosts: ["192.168.1.30:9200"]
  index: "linsir-system-%{+yyyy.MM.dd}"

processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded
  - add_cloud_metadata: ~
```

### 6.2 日志告警规则

```yaml
# 错误日志告警
- alert: HighErrorLogRate
  expr: |
    sum(rate(log_messages_total{level="error"}[5m])) > 10
  for: 2m
  labels:
    severity: warning
  annotations:
    summary: "错误日志增多"
    description: "错误日志速率超过10条/分钟"
```

---

## 7. 监控检查清单

### 7.1 部署检查

| 检查项 | 命令 | 预期结果 |
|--------|------|----------|
| Prometheus状态 | `systemctl status prometheus` | active |
| Alertmanager状态 | `systemctl status alertmanager` | active |
| Grafana状态 | `systemctl status grafana-server` | active |
| 目标采集 | `curl localhost:9090/api/v1/targets` | 所有target为UP |
| 告警规则 | `curl localhost:9090/api/v1/rules` | 规则已加载 |

### 7.2 日常巡检

| 巡检项 | 频率 | 负责人 |
|--------|------|--------|
| 检查告警是否正常工作 | 每日 | 运维 |
| 检查磁盘空间 | 每日 | 运维 |
| 检查监控大盘 | 每日 | 运维 |
| 检查日志收集 | 每日 | 运维 |
| 更新告警规则 | 按需 | 运维 |

---

**文档创建:** 2026-05-12  
**最后更新:** 2026-05-12  
**运维负责人:** 周九
