# 审计日志模块开发文档

> **迭代编号**: sprint-3  
> **模块**: 审计日志模块  
> **状态**: ✅ 已完成

---

## 开发任务

### 功能清单

| 序号 | 功能项 | 状态 | 负责人 | 工时 |
|------|--------|------|--------|------|
| 1 | 操作日志查询页面 | ✅ 已完成 | 赵六 | 6h |
| 2 | 操作日志查询API | ✅ 已完成 | 钱七 | 8h |
| 3 | 操作日志导出功能 | ✅ 已完成 | 钱七 | 8h |
| 4 | 操作日志归档功能 | ✅ 已完成 | 钱七 | 6h |
| 5 | 登录日志管理页面 | ✅ 已完成 | 赵六 | 6h |
| 6 | 登录日志管理API | ✅ 已完成 | 钱七 | 6h |
| 7 | 日志可视化图表 | ✅ 已完成 | 赵六 | 8h |
| 8 | 日志统计报表 | ✅ 已完成 | 赵六 | 4h |

---

## 技术方案

### 数据库设计

#### 操作日志表（sys_operation_log）

```sql
CREATE TABLE sys_operation_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    module VARCHAR(50) NOT NULL COMMENT '操作模块',
    operation VARCHAR(100) NOT NULL COMMENT '操作类型',
    method VARCHAR(200) COMMENT '请求方法',
    request_url VARCHAR(500) COMMENT '请求URL',
    request_params TEXT COMMENT '请求参数',
    response_data TEXT COMMENT '响应数据',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    user_agent VARCHAR(500) COMMENT '浏览器UA',
    execution_time INT COMMENT '执行时长(ms)',
    status TINYINT DEFAULT 1 COMMENT '状态：0-失败 1-成功',
    error_msg TEXT COMMENT '错误信息',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_module (module),
    INDEX idx_created_time (created_time),
    INDEX idx_operation (operation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表'
PARTITION BY RANGE (YEAR(created_time) * 100 + MONTH(created_time)) (
    PARTITION p202401 VALUES LESS THAN (202402),
    PARTITION p202402 VALUES LESS THAN (202403),
    -- ... 更多分区
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

#### 登录日志表（sys_login_log）

```sql
CREATE TABLE sys_login_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    login_type TINYINT DEFAULT 1 COMMENT '登录类型：1-账号密码 2-手机验证码 3-第三方登录',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    login_location VARCHAR(100) COMMENT '登录地点',
    browser VARCHAR(100) COMMENT '浏览器',
    os VARCHAR(100) COMMENT '操作系统',
    login_status TINYINT DEFAULT 1 COMMENT '登录状态：0-失败 1-成功',
    fail_msg VARCHAR(500) COMMENT '失败信息',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_created_time (created_time),
    INDEX idx_login_status (login_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='登录日志表';
```

### 大数据量导出方案

采用异步任务队列方案：

1. **前端**: 点击导出后显示进度条，轮询查询导出进度
2. **后端**: 将导出任务放入RabbitMQ队列，异步处理
3. **处理**: 分批查询数据（每批5000条），写入临时文件
4. **完成**: 生成下载链接，通过WebSocket通知前端
5. **清理**: 临时文件保留24小时后自动删除

### 归档策略

- **在线数据**: 保留最近12个月的操作日志
- **归档数据**: 超过12个月的数据迁移到归档表
- **归档表**: 按年分表，如 `sys_operation_log_2024`
- **清理策略**: 归档数据保留3年后可物理删除

---

## 接口定义

### 操作日志查询

```yaml
POST /api/system/operation-log/list

Request:
  body:
    pageNum: 1
    pageSize: 20
    userId: null        # 用户ID筛选
    module: ""          # 模块筛选
    operation: ""       # 操作类型筛选
    status: null        # 状态筛选
    startTime: ""       # 开始时间
    endTime: ""         # 结束时间
    keyword: ""         # 关键字搜索

Response:
  code: 200
  data:
    list:
      - id: 1
        username: "admin"
        module: "用户管理"
        operation: "新增用户"
        ipAddress: "192.168.1.1"
        executionTime: 125
        status: 1
        createdTime: "2026-04-27 10:30:00"
    total: 1000
    pageNum: 1
    pageSize: 20
```

### 操作日志导出

```yaml
POST /api/system/operation-log/export

Request:
  body:
    userId: null
    module: ""
    operation: ""
    startTime: ""
    endTime: ""
    exportType: "excel"  # excel/csv

Response:
  code: 200
  data:
    taskId: "export_20240427103000_001"
    status: "processing"  # processing/completed/failed
    progress: 35          # 进度百分比
    downloadUrl: ""       # 完成后返回下载链接
```

### 登录日志查询

```yaml
POST /api/system/login-log/list

Request:
  body:
    pageNum: 1
    pageSize: 20
    username: ""          # 用户名筛选
    loginType: null       # 登录类型筛选
    loginStatus: null     # 登录状态筛选
    startTime: ""
    endTime: ""

Response:
  code: 200
  data:
    list:
      - id: 1
        username: "admin"
        loginType: 1
        loginTypeName: "账号密码"
        ipAddress: "192.168.1.1"
        loginLocation: "北京市"
        browser: "Chrome 120"
        os: "Windows 10"
        loginStatus: 1
        createdTime: "2026-04-27 10:30:00"
    total: 500
```

### 日志统计

```yaml
GET /api/system/operation-log/statistics

Response:
  code: 200
  data:
    todayCount: 1250              # 今日操作数
    weekTrend: [120, 135, ...]    # 近7天趋势
    moduleDistribution:           # 模块分布
      - name: "用户管理"
        value: 350
      - name: "角色管理"
        value: 280
    topUsers:                     # 活跃用户TOP10
      - username: "admin"
        count: 156
```

---

## 测试用例

### 功能测试

| 用例编号 | 用例名称 | 前置条件 | 测试步骤 | 预期结果 | 状态 |
|----------|----------|----------|----------|----------|------|
| AUDIT-001 | 操作日志查询 | 存在操作日志数据 | 1. 进入操作日志页面<br>2. 点击查询 | 显示日志列表 | ✅ 通过 |
| AUDIT-002 | 多条件筛选 | 存在多种类型日志 | 1. 选择模块筛选<br>2. 选择时间范围<br>3. 点击查询 | 显示符合条件的日志 | ✅ 通过 |
| AUDIT-003 | 日志导出 | 存在大量日志数据 | 1. 点击导出按钮<br>2. 等待导出完成<br>3. 下载文件 | 导出文件内容正确 | ✅ 通过 |
| AUDIT-004 | 大数据量导出 | 日志数据超过10万条 | 1. 选择大范围时间<br>2. 点击导出 | 异步导出，显示进度 | ✅ 通过 |
| AUDIT-005 | 登录日志查询 | 存在登录记录 | 1. 进入登录日志页面<br>2. 点击查询 | 显示登录记录 | ✅ 通过 |
| AUDIT-006 | 日志统计展示 | 存在历史日志数据 | 1. 查看统计图表 | 图表数据正确显示 | ✅ 通过 |

### 性能测试

| 用例编号 | 测试场景 | 测试数据量 | 预期响应时间 | 实际结果 | 状态 |
|----------|----------|------------|--------------|----------|------|
| PERF-001 | 日志查询 | 100万条 | < 1s | 0.8s | ✅ 通过 |
| PERF-002 | 日志查询 | 500万条 | < 2s | 1.5s | ✅ 通过 |
| PERF-003 | 导出1万条 | 1万条 | < 10s | 8s | ✅ 通过 |
| PERF-004 | 导出10万条 | 10万条 | < 60s | 45s | ✅ 通过 |

---

## 开发记录

| 日期 | 工作内容 | 完成状态 | 备注 |
|------|---------|---------|------|
| 2026-04-27 | 操作日志表结构优化（分区表设计） | ✅ 完成 | 采用按月分区方案 |
| 2026-04-27 | 操作日志查询API开发 | ✅ 完成 | 支持多维度筛选 |
| 2026-04-28 | 操作日志查询页面开发 | ✅ 完成 | 包含筛选和分页 |
| 2026-04-28 | 日志可视化图表组件 | ✅ 完成 | 使用ECharts |
| 2026-04-29 | 大数据量导出功能 | ✅ 完成 | 异步任务队列方案 |
| 2026-04-29 | 日志导出页面 | ✅ 完成 | 支持进度显示 |
| 2026-04-30 | 登录日志管理API | ✅ 完成 | 登录记录查询 |
| 2026-04-30 | 登录日志管理页面 | ✅ 完成 | 登录记录展示 |
| 2026-04-30 | 操作日志归档功能 | ✅ 完成 | 自动归档策略 |
| 2026-05-06 | 审计日志功能测试 | ✅ 完成 | 功能测试通过 |
| 2026-05-07 | 审计日志性能测试 | ✅ 完成 | 性能指标达标 |
| 2026-05-08 | 审计日志技术文档 | ✅ 完成 | 文档编写完成 |

---

## 性能指标

| 指标 | 优化前 | 优化后 | 提升幅度 |
|------|--------|--------|----------|
| 日志查询（100万数据） | 3.2s | 0.8s | 75% |
| 日志查询（500万数据） | 8.5s | 1.5s | 82% |
| 导出1万条 | 25s | 8s | 68% |
| 导出10万条 | 180s | 45s | 75% |
| 数据库磁盘占用 | 100% | 65% | 35% |

---

**文档创建:** 2026-04-27  
**最后更新:** 2026-05-08  
**负责人:** 钱七
