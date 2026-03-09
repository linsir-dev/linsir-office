# 运维组件设计

> **文档编号**: SYS-DES-ARCH-DEPLOY-002  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: ✅ 已完成

---

## 1. 概述

### 1.1 设计目标

本文档定义System平台的运维组件设计，包括监控、日志、告警三大核心能力，实现系统的可观测性和自动化运维。

### 1.2 设计原则

1. **全面监控**：覆盖基础设施、应用、业务三个层面
2. **集中日志**：统一日志收集、存储、分析
3. **智能告警**：精准告警，避免告警风暴
4. **可视化**：直观展示系统状态和趋势

### 1.3 运维架构

```
┌─────────────────────────────────────────────────────────────┐
│                      运维平台                                │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   监控组件    │   日志组件    │   告警组件    │   可视化组件    │
├──────────────┼──────────────┼──────────────┼────────────────┤
│  Prometheus  │   Fluentd    │ Alertmanager │    Grafana     │
│  Node Exporter│   Filebeat   │   Webhook    │   Kibana       │
│  JMX Exporter│   Logstash   │   钉钉/企业微信 │                │
│  MySQL Exporter│  Elasticsearch│              │                │
│  Redis Exporter│              │              │                │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

---

## 2. 监控组件

### 2.1 Prometheus监控

#### 2.1.1 Prometheus部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
        - name: prometheus
          image: prom/prometheus:v2.48.0
          ports:
            - containerPort: 9090
          volumeMounts:
            - name: config
              mountPath: /etc/prometheus
            - name: storage
              mountPath: /prometheus
          args:
            - '--config.file=/etc/prometheus/prometheus.yml'
            - '--storage.tsdb.path=/prometheus'
            - '--storage.tsdb.retention.time=30d'
            - '--web.console.libraries=/usr/share/prometheus/console_libraries'
            - '--web.console.templates=/usr/share/prometheus/consoles'
            - '--web.enable-lifecycle'
      volumes:
        - name: config
          configMap:
            name: prometheus-config
        - name: storage
          persistentVolumeClaim:
            claimName: prometheus-pvc
```

#### 2.1.2 Prometheus配置

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: linsir-prod
    replica: '{{.ExternalURL}}'

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

rule_files:
  - /etc/prometheus/rules/*.yml

scrape_configs:
  # Prometheus自身监控
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Kubernetes节点监控
  - job_name: 'kubernetes-nodes'
    kubernetes_sd_configs:
      - role: node
    relabel_configs:
      - source_labels: [__address__]
        regex: '(.*):10250'
        target_label: __address__
        replacement: '${1}:9100'

  # Kubernetes Pod监控
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__

  # 后端服务监控
  - job_name: 'linsir-backend'
    static_configs:
      - targets: ['linsir-backend-service.linsir-prod.svc.cluster.local:8080']
    metrics_path: '/actuator/prometheus'
    scrape_interval: 10s
```

### 2.2 Exporter部署

#### 2.2.1 Node Exporter

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      hostNetwork: true
      hostPID: true
      containers:
        - name: node-exporter
          image: prom/node-exporter:v1.7.0
          ports:
            - containerPort: 9100
              hostPort: 9100
          args:
            - '--path.procfs=/host/proc'
            - '--path.rootfs=/host/root'
            - '--path.sysfs=/host/sys'
            - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
          volumeMounts:
            - name: proc
              mountPath: /host/proc
              readOnly: true
            - name: root
              mountPath: /host/root
              readOnly: true
            - name: sys
              mountPath: /host/sys
              readOnly: true
      volumes:
        - name: proc
          hostPath:
            path: /proc
        - name: root
          hostPath:
            path: /
        - name: sys
          hostPath:
            path: /sys
```

#### 2.2.2 MySQL Exporter

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-exporter
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql-exporter
  template:
    metadata:
      labels:
        app: mysql-exporter
    spec:
      containers:
        - name: mysql-exporter
          image: prom/mysqld-exporter:v0.15.0
          ports:
            - containerPort: 9104
          env:
            - name: DATA_SOURCE_NAME
              valueFrom:
                secretKeyRef:
                  name: mysql-exporter-secret
                  key: datasource
          args:
            - '--collect.info_schema.innodb_metrics'
            - '--collect.info_schema.processlist'
            - '--collect.info_schema.tablestats'
            - '--collect.info_schema.userstats'
            - '--collect.perf_schema.eventswaits'
            - '--collect.perf_schema.file_events'
            - '--collect.perf_schema.indexiowaits'
            - '--collect.perf_schema.tableiowaits'
            - '--collect.perf_schema.tablelocks'
```

#### 2.2.3 Redis Exporter

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-exporter
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis-exporter
  template:
    metadata:
      labels:
        app: redis-exporter
    spec:
      containers:
        - name: redis-exporter
          image: oliver006/redis_exporter:v1.55.0
          ports:
            - containerPort: 9121
          env:
            - name: REDIS_ADDR
              value: "redis://redis-service:6379"
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: redis-exporter-secret
                  key: password
```

### 2.3 业务指标监控

#### 2.3.1 自定义Metrics

```java
@Component
public class BusinessMetrics {
    
    private final MeterRegistry meterRegistry;
    
    // 用户注册计数器
    private final Counter userRegisterCounter;
    
    // 订单处理计时器
    private final Timer orderProcessTimer;
    
    // 在线用户Gauge
    private final AtomicInteger onlineUsers;
    
    public BusinessMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        
        this.userRegisterCounter = Counter.builder("business.user.register")
                .description("用户注册数量")
                .tag("channel", "web")
                .register(meterRegistry);
        
        this.orderProcessTimer = Timer.builder("business.order.process")
                .description("订单处理时间")
                .register(meterRegistry);
        
        this.onlineUsers = meterRegistry.gauge("business.user.online", 
                new AtomicInteger(0));
    }
    
    public void incrementUserRegister() {
        userRegisterCounter.increment();
    }
    
    public void recordOrderProcessTime(long millis) {
        orderProcessTimer.record(millis, TimeUnit.MILLISECONDS);
    }
    
    public void setOnlineUsers(int count) {
        onlineUsers.set(count);
    }
}
```

#### 2.3.2 健康检查指标

```java
@Component
public class HealthMetrics {
    
    @Autowired
    private DataSource dataSource;
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    @ReadOperation
    public Health health() {
        Health.Builder builder = Health.up();
        
        // 数据库健康检查
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(3)) {
                builder.withDetail("database", "UP");
            } else {
                builder.down().withDetail("database", "DOWN");
            }
        } catch (SQLException e) {
            builder.down().withDetail("database", "DOWN: " + e.getMessage());
        }
        
        // Redis健康检查
        try {
            redisTemplate.opsForValue().get("health-check");
            builder.withDetail("redis", "UP");
        } catch (Exception e) {
            builder.down().withDetail("redis", "DOWN: " + e.getMessage());
        }
        
        return builder.build();
    }
}
```

---

## 3. 日志组件

### 3.1 ELK Stack架构

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Application │───>│   Fluentd    │───>│Elasticsearch │<───│    Kibana    │
│    Logs      │    │  /Filebeat   │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### 3.2 Fluentd配置

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: logging
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      serviceAccountName: fluentd
      containers:
        - name: fluentd
          image: fluent/fluentd-kubernetes-daemonset:v1.16-debian-elasticsearch7-1
          env:
            - name: FLUENT_ELASTICSEARCH_HOST
              value: "elasticsearch.logging.svc.cluster.local"
            - name: FLUENT_ELASTICSEARCH_PORT
              value: "9200"
            - name: FLUENT_ELASTICSEARCH_SCHEME
              value: "http"
            - name: FLUENT_ELASTICSEARCH_USER
              value: "elastic"
            - name: FLUENT_ELASTICSEARCH_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: elasticsearch-secret
                  key: password
          volumeMounts:
            - name: varlog
              mountPath: /var/log
            - name: varlibdockercontainers
              mountPath: /var/lib/docker/containers
              readOnly: true
            - name: fluentd-config
              mountPath: /fluentd/etc
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
        - name: fluentd-config
          configMap:
            name: fluentd-config
```

### 3.3 Elasticsearch配置

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
  namespace: logging
spec:
  serviceName: elasticsearch
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
        - name: elasticsearch
          image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
          ports:
            - containerPort: 9200
              name: http
            - containerPort: 9300
              name: transport
          env:
            - name: cluster.name
              value: linsir-logs
            - name: node.name
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: discovery.seed_hosts
              value: "elasticsearch-0.elasticsearch,elasticsearch-1.elasticsearch,elasticsearch-2.elasticsearch"
            - name: cluster.initial_master_nodes
              value: "elasticsearch-0,elasticsearch-1,elasticsearch-2"
            - name: ES_JAVA_OPTS
              value: "-Xms2g -Xmx2g"
            - name: xpack.security.enabled
              value: "true"
            - name: ELASTIC_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: elasticsearch-secret
                  key: password
          volumeMounts:
            - name: data
              mountPath: /usr/share/elasticsearch/data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 100Gi
```

### 3.4 Kibana配置

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kibana
  namespace: logging
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kibana
  template:
    metadata:
      labels:
        app: kibana
    spec:
      containers:
        - name: kibana
          image: docker.elastic.co/kibana/kibana:8.11.0
          ports:
            - containerPort: 5601
          env:
            - name: ELASTICSEARCH_HOSTS
              value: '["http://elasticsearch:9200"]'
            - name: ELASTICSEARCH_USERNAME
              value: "elastic"
            - name: ELASTICSEARCH_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: elasticsearch-secret
                  key: password
            - name: SERVER_BASEPATH
              value: "/kibana"
            - name: SERVER_REWRITEBASEPATH
              value: "true"
```

### 3.5 日志采集配置

```yaml
# fluentd-config
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*linsir*.log
      pos_file /var/log/fluentd-linsir.log.pos
      tag linsir.**
      <parse>
        @type json
        time_key time
        time_format %Y-%m-%dT%H:%M:%S.%NZ
        keep_time_key true
      </parse>
    </source>
    
    <filter linsir.**>
      @type kubernetes_metadata
      @id filter_kube_metadata
    </filter>
    
    <filter linsir.**>
      @type parser
      format json
      key_name log
      reserve_data true
      <parse>
        @type json
      </parse>
    </filter>
    
    <match linsir.**>
      @type elasticsearch
      @id out_es
      @log_level info
      host "#{ENV['FLUENT_ELASTICSEARCH_HOST']}"
      port "#{ENV['FLUENT_ELASTICSEARCH_PORT']}"
      user "#{ENV['FLUENT_ELASTICSEARCH_USER']}"
      password "#{ENV['FLUENT_ELASTICSEARCH_PASSWORD']}"
      index_name linsir-logs
      logstash_format true
      logstash_prefix linsir
      include_tag_key true
      type_name _doc
      <buffer>
        flush_interval 10s
        chunk_limit_size 2M
        queue_limit_length 32
        retry_max_interval 30
        retry_forever true
      </buffer>
    </match>
```

---

## 4. 告警组件

### 4.1 Alertmanager配置

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: alertmanager
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: alertmanager
  template:
    metadata:
      labels:
        app: alertmanager
    spec:
      containers:
        - name: alertmanager
          image: prom/alertmanager:v0.26.0
          ports:
            - containerPort: 9093
          volumeMounts:
            - name: config
              mountPath: /etc/alertmanager
            - name: storage
              mountPath: /alertmanager
          args:
            - '--config.file=/etc/alertmanager/alertmanager.yml'
            - '--storage.path=/alertmanager'
            - '--web.external-url=http://alertmanager.monitoring.svc.cluster.local:9093'
      volumes:
        - name: config
          configMap:
            name: alertmanager-config
        - name: storage
          emptyDir: {}
```

### 4.2 告警规则配置

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alert@example.com'
  smtp_auth_username: 'alert@example.com'
  smtp_auth_password: 'password'

templates:
  - '/etc/alertmanager/templates/*.tmpl'

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 12h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'critical'
      continue: true
    - match:
        severity: warning
      receiver: 'warning'
      continue: true

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'cluster', 'service']

receivers:
  - name: 'default'
    email_configs:
      - to: 'ops@example.com'
        headers:
          Subject: '[Alert] {{ .GroupLabels.alertname }}'
  
  - name: 'critical'
    email_configs:
      - to: 'ops@example.com'
    webhook_configs:
      - url: 'http://dingtalk-webhook:8060/dingtalk/critical/send'
        send_resolved: true
  
  - name: 'warning'
    email_configs:
      - to: 'ops@example.com'
    webhook_configs:
      - url: 'http://dingtalk-webhook:8060/dingtalk/warning/send'
        send_resolved: true
```

### 4.3 Prometheus告警规则

```yaml
# prometheus-rules.yml
groups:
  - name: linsir-alerts
    rules:
      # 服务宕机告警
      - alert: ServiceDown
        expr: up{job=~"linsir-.*"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "服务 {{ $labels.job }} 宕机"
          description: "服务 {{ $labels.job }} 在 {{ $labels.instance }} 上已经宕机超过1分钟"
      
      # 高CPU使用率告警
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "CPU使用率过高"
          description: "实例 {{ $labels.instance }} CPU使用率超过80%"
      
      # 高内存使用率告警
      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "内存使用率过高"
          description: "实例 {{ $labels.instance }} 内存使用率超过85%"
      
      # 磁盘空间不足告警
      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "磁盘空间不足"
          description: "实例 {{ $labels.instance }} 磁盘空间不足10%"
      
      # 数据库连接池告警
      - alert: DatabaseConnectionPoolHigh
        expr: hikaricp_connections_active / hikaricp_connections_max > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "数据库连接池使用率过高"
          description: "数据库连接池使用率超过80%"
      
      # 接口响应时间告警
      - alert: ApiResponseTimeHigh
        expr: histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "接口响应时间过长"
          description: "95%接口响应时间超过2秒"
      
      # 错误率告警
      - alert: HighErrorRate
        expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) / rate(http_server_requests_seconds_count[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "错误率过高"
          description: "5xx错误率超过5%"
```

### 4.4 钉钉Webhook

```python
# dingtalk-webhook.py
from flask import Flask, request, jsonify
import requests
import json
import os

app = Flask(__name__)

DINGTALK_WEBHOOKS = {
    'critical': os.getenv('DINGTALK_CRITICAL_WEBHOOK'),
    'warning': os.getenv('DINGTALK_WARNING_WEBHOOK')
}

def send_dingtalk_message(webhook_url, message):
    headers = {'Content-Type': 'application/json'}
    data = {
        'msgtype': 'markdown',
        'markdown': {
            'title': message['title'],
            'text': message['content']
        }
    }
    response = requests.post(webhook_url, headers=headers, data=json.dumps(data))
    return response.json()

@app.route('/dingtalk/<severity>/send', methods=['POST'])
def send_alert(severity):
    alert_data = request.json
    webhook_url = DINGTALK_WEBHOOKS.get(severity)
    
    if not webhook_url:
        return jsonify({'error': 'Invalid severity'}), 400
    
    for alert in alert_data.get('alerts', []):
        status = alert.get('status', 'firing')
        labels = alert.get('labels', {})
        annotations = alert.get('annotations', {})
        
        title = f"【{status.upper()}】{labels.get('alertname', 'Unknown')}"
        content = f"""## {annotations.get('summary', 'Alert')}

**状态**: {status}
**级别**: {labels.get('severity', 'unknown')}
**服务**: {labels.get('job', 'unknown')}
**实例**: {labels.get('instance', 'unknown')}

{annotations.get('description', '')}

**时间**: {alert.get('startsAt', '')}
"""
        
        message = {'title': title, 'content': content}
        send_dingtalk_message(webhook_url, message)
    
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8060)
```

---

## 5. 可视化组件

### 5.1 Grafana部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
        - name: grafana
          image: grafana/grafana:10.2.0
          ports:
            - containerPort: 3000
          env:
            - name: GF_SECURITY_ADMIN_USER
              valueFrom:
                secretKeyRef:
                  name: grafana-secret
                  key: admin-user
            - name: GF_SECURITY_ADMIN_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: grafana-secret
                  key: admin-password
            - name: GF_INSTALL_PLUGINS
              value: "grafana-clock-panel,grafana-simple-json-datasource"
          volumeMounts:
            - name: storage
              mountPath: /var/lib/grafana
            - name: dashboards
              mountPath: /etc/grafana/provisioning/dashboards
            - name: datasources
              mountPath: /etc/grafana/provisioning/datasources
      volumes:
        - name: storage
          persistentVolumeClaim:
            claimName: grafana-pvc
        - name: dashboards
          configMap:
            name: grafana-dashboards
        - name: datasources
          configMap:
            name: grafana-datasources
```

### 5.2 Grafana数据源配置

```yaml
# grafana-datasources.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: monitoring
data:
  datasources.yaml: |
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        access: proxy
        url: http://prometheus:9090
        isDefault: true
        editable: false
      
      - name: Elasticsearch
        type: elasticsearch
        access: proxy
        url: http://elasticsearch.logging.svc.cluster.local:9200
        database: "linsir-*"
        jsonData:
          timeField: "@timestamp"
          esVersion: "8.0.0"
          maxConcurrentShardRequests: 5
          logMessageField: message
          logLevelField: fields.level
```

### 5.3 Dashboard配置

```json
{
  "dashboard": {
    "id": null,
    "title": "System Platform Overview",
    "tags": ["linsir", "overview"],
    "timezone": "Asia/Shanghai",
    "panels": [
      {
        "id": 1,
        "title": "Service Status",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=~\"linsir-.*\"}",
            "legendFormat": "{{job}}"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "steps": [
                {"color": "red", "value": 0},
                {"color": "green", "value": 1}
              ]
            }
          }
        }
      },
      {
        "id": 2,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_server_requests_seconds_count[5m])",
            "legendFormat": "{{uri}}"
          }
        ]
      },
      {
        "id": 3,
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "id": 4,
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_server_requests_seconds_count{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      },
      {
        "id": 5,
        "title": "JVM Memory",
        "type": "graph",
        "targets": [
          {
            "expr": "jvm_memory_used_bytes / jvm_memory_max_bytes * 100",
            "legendFormat": "{{area}} memory usage %"
          }
        ]
      },
      {
        "id": 6,
        "title": "Database Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "hikaricp_connections_active",
            "legendFormat": "Active connections"
          },
          {
            "expr": "hikaricp_connections_idle",
            "legendFormat": "Idle connections"
          }
        ]
      }
    ]
  }
}
```

---

## 6. 运维自动化

### 6.1 自动扩缩容

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: linsir-backend-hpa
  namespace: linsir-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: linsir-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "1000"
```

### 6.2 自动恢复

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: pod-restart-checker
  namespace: monitoring
spec:
  schedule: "*/5 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: kubectl
              image: bitnami/kubectl:latest
              command:
                - /bin/sh
                - -c
                - |
                  # 检查重启次数过多的Pod
                  kubectl get pods --all-namespaces -o json | \
                  jq -r '.items[] | select(.status.containerStatuses[0].restartCount > 5) | \
                  "\(.metadata.namespace) \(.metadata.name)"' | \
                  while read ns pod; do
                    echo "Restarting $pod in $ns"
                    kubectl delete pod $pod -n $ns
                  done
          restartPolicy: OnFailure
```

---

## 7. 输出文件

| 序号 | 文件名称 | 文件编号 | 说明 |
|-----|---------|---------|------|
| 1 | 容器化组件设计 | SYS-DES-ARCH-DEPLOY-001 | Docker、K8s、CI/CD |
| 2 | 运维组件设计 | SYS-DES-ARCH-DEPLOY-002 | 本文档 |
| 3 | 部署组件评审记录 | SYS-DES-ARCH-DEPLOY-REV-001 | 评审结果 |

---

## 8. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，定义运维组件设计 |
