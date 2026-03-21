# 通知模块开发文档

> **迭代编号**: sprint-3  
> **模块**: 通知模块  
> **状态**: ✅ 已完成

---

## 开发任务

### 功能清单

| 序号 | 功能项 | 状态 | 负责人 | 工时 |
|------|--------|------|--------|------|
| 1 | 消息通知表设计 | ✅ 已完成 | 钱七 | 4h |
| 2 | 消息通知API开发 | ✅ 已完成 | 钱七 | 8h |
| 3 | WebSocket消息推送服务 | ✅ 已完成 | 钱七 | 10h |
| 4 | 系统公告API开发 | ✅ 已完成 | 钱七 | 6h |
| 5 | 消息通知组件开发 | ✅ 已完成 | 赵六 | 8h |
| 6 | 消息中心页面开发 | ✅ 已完成 | 赵六 | 6h |
| 7 | 系统公告管理页面 | ✅ 已完成 | 赵六 | 6h |
| 8 | 邮件通知服务 | ✅ 已完成 | 钱七 | 8h |
| 9 | 邮件模板管理 | ✅ 已完成 | 钱七 | 6h |
| 10 | 通知设置页面 | ✅ 已完成 | 赵六 | 4h |

---

## 技术方案

### 数据库设计

#### 消息通知表（sys_notification）

```sql
CREATE TABLE sys_notification (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '接收用户ID',
    title VARCHAR(200) NOT NULL COMMENT '消息标题',
    content TEXT COMMENT '消息内容',
    type TINYINT DEFAULT 1 COMMENT '消息类型：1-系统通知 2-业务通知 3-告警通知',
    category VARCHAR(50) COMMENT '消息分类',
    priority TINYINT DEFAULT 1 COMMENT '优先级：1-普通 2-重要 3-紧急',
    is_read TINYINT DEFAULT 0 COMMENT '是否已读：0-未读 1-已读',
    read_time DATETIME COMMENT '阅读时间',
    sender_id BIGINT COMMENT '发送者ID',
    sender_name VARCHAR(50) COMMENT '发送者名称',
    target_type VARCHAR(50) COMMENT '目标类型',
    target_id BIGINT COMMENT '目标ID',
    extra_data JSON COMMENT '扩展数据',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息通知表';
```

#### 系统公告表（sys_announcement）

```sql
CREATE TABLE sys_announcement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '公告标题',
    content TEXT NOT NULL COMMENT '公告内容',
    type TINYINT DEFAULT 1 COMMENT '公告类型：1-通知 2-公告 3-预警',
    priority TINYINT DEFAULT 1 COMMENT '优先级：1-普通 2-重要 3-紧急',
    status TINYINT DEFAULT 1 COMMENT '状态：0-草稿 1-已发布 2-已撤回',
    publish_time DATETIME COMMENT '发布时间',
    expire_time DATETIME COMMENT '过期时间',
    publisher_id BIGINT COMMENT '发布人ID',
    publisher_name VARCHAR(50) COMMENT '发布人名称',
    read_count INT DEFAULT 0 COMMENT '阅读次数',
    target_type TINYINT DEFAULT 1 COMMENT '发布对象：1-全部 2-指定角色 3-指定部门',
    target_ids VARCHAR(500) COMMENT '目标对象ID列表',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_status (status),
    INDEX idx_publish_time (publish_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统公告表';
```

#### 邮件模板表（sys_email_template）

```sql
CREATE TABLE sys_email_template (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    template_code VARCHAR(50) NOT NULL UNIQUE COMMENT '模板编码',
    template_name VARCHAR(100) NOT NULL COMMENT '模板名称',
    subject VARCHAR(200) NOT NULL COMMENT '邮件主题',
    content TEXT NOT NULL COMMENT '邮件内容（支持HTML）',
    variables VARCHAR(500) COMMENT '变量列表，逗号分隔',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_template_code (template_code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邮件模板表';
```

#### 邮件发送记录表（sys_email_record）

```sql
CREATE TABLE sys_email_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    template_code VARCHAR(50) COMMENT '模板编码',
    recipient VARCHAR(200) NOT NULL COMMENT '收件人邮箱',
    subject VARCHAR(200) NOT NULL COMMENT '邮件主题',
    content TEXT COMMENT '邮件内容',
    send_status TINYINT DEFAULT 0 COMMENT '发送状态：0-待发送 1-发送中 2-成功 3-失败',
    error_msg TEXT COMMENT '错误信息',
    send_time DATETIME COMMENT '发送时间',
    retry_count INT DEFAULT 0 COMMENT '重试次数',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_send_status (send_status),
    INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邮件发送记录表';
```

### WebSocket推送方案

#### 架构设计

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │◄───►│   Nginx     │◄───►│  WebSocket  │
│  (Browser)  │     │  (Sticky    │     │   Server    │
└─────────────┘     │   Session)  │     └──────┬──────┘
                    └─────────────┘            │
                                               ▼
                                        ┌─────────────┐
                                        │  RabbitMQ   │
                                        │    Queue    │
                                        └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  Business   │
                                        │   Service   │
                                        └─────────────┘
```

#### 消息推送流程

1. **连接建立**: 客户端登录后建立WebSocket连接
2. **心跳检测**: 每30秒发送一次心跳包，检测连接状态
3. **消息推送**: 业务服务发送消息到RabbitMQ
4. **消息分发**: WebSocket服务消费消息，推送到目标客户端
5. **离线处理**: 用户离线时消息持久化，上线后推送

#### 消息格式

```json
{
  "type": "notification",
  "data": {
    "id": 12345,
    "title": "系统通知",
    "content": "您有一条新的待办任务",
    "category": "todo",
    "priority": 2,
    "createdTime": "2026-05-06T10:30:00",
    "targetType": "task",
    "targetId": 10086
  },
  "timestamp": 1714972200000
}
```

### 邮件通知方案

#### 发送流程

1. **模板渲染**: 根据模板编码获取模板，渲染变量
2. **队列投递**: 将邮件任务投递到RabbitMQ队列
3. **异步发送**: 邮件服务消费队列，调用SMTP发送
4. **状态更新**: 更新发送记录状态，失败时重试
5. **失败处理**: 重试3次后仍失败，记录失败原因

#### 重试机制

- **重试次数**: 最多3次
- **重试间隔**: 1分钟、5分钟、15分钟
- **失败通知**: 连续失败时通知管理员

---

## 接口定义

### 消息通知接口

#### 获取消息列表

```yaml
POST /api/system/notification/list

Request:
  body:
    pageNum: 1
    pageSize: 20
    isRead: null        # 已读状态筛选
    type: null          # 消息类型筛选
    category: ""        # 分类筛选

Response:
  code: 200
  data:
    list:
      - id: 1
        title: "系统通知"
        content: "您有一条新的待办任务"
        type: 1
        typeName: "系统通知"
        isRead: 0
        priority: 2
        createdTime: "2026-05-06 10:30:00"
    total: 50
    unreadCount: 10     # 未读消息数
```

#### 标记已读

```yaml
PUT /api/system/notification/read/{id}

Response:
  code: 200
  message: "标记成功"
```

#### 标记全部已读

```yaml
PUT /api/system/notification/read-all

Response:
  code: 200
  message: "全部标记已读成功"
```

#### 删除消息

```yaml
DELETE /api/system/notification/{id}

Response:
  code: 200
  message: "删除成功"
```

#### 获取未读消息数

```yaml
GET /api/system/notification/unread-count

Response:
  code: 200
  data:
    total: 10
    byType:
      - type: 1
        typeName: "系统通知"
        count: 5
      - type: 2
        typeName: "业务通知"
        count: 3
```

### 系统公告接口

#### 获取公告列表（管理端）

```yaml
POST /api/system/announcement/list

Request:
  body:
    pageNum: 1
    pageSize: 20
    status: null        # 状态筛选
    type: null          # 类型筛选

Response:
  code: 200
  data:
    list:
      - id: 1
        title: "系统维护通知"
        type: 1
        typeName: "通知"
        status: 1
        statusName: "已发布"
        priority: 2
        publishTime: "2026-05-06 10:00:00"
        readCount: 156
        publisherName: "管理员"
    total: 20
```

#### 发布公告

```yaml
POST /api/system/announcement

Request:
  body:
    title: "系统维护通知"
    content: "<p>系统将于今晚进行维护...</p>"
    type: 1
    priority: 2
    targetType: 1       # 1-全部 2-指定角色 3-指定部门
    targetIds: []       # 目标对象ID列表
    publishTime: "2026-05-06 10:00:00"
    expireTime: "2026-05-07 10:00:00"

Response:
  code: 200
  message: "发布成功"
```

#### 获取用户公告列表

```yaml
GET /api/system/announcement/user-list

Response:
  code: 200
  data:
    list:
      - id: 1
        title: "系统维护通知"
        type: 1
        priority: 2
        isRead: 0
        publishTime: "2026-05-06 10:00:00"
```

### 邮件服务接口

#### 发送邮件

```yaml
POST /api/system/email/send

Request:
  body:
    templateCode: "USER_REGISTER"   # 模板编码
    recipient: "user@example.com"   # 收件人
    variables:                      # 模板变量
      username: "张三"
      verifyCode: "123456"

Response:
  code: 200
  data:
    recordId: 10001
    status: "processing"
```

#### 获取邮件模板列表

```yaml
POST /api/system/email-template/list

Response:
  code: 200
  data:
    list:
      - id: 1
        templateCode: "USER_REGISTER"
        templateName: "用户注册验证"
        subject: "欢迎注册 - 验证码"
        status: 1
```

---

## 测试用例

### 功能测试

| 用例编号 | 用例名称 | 前置条件 | 测试步骤 | 预期结果 | 状态 |
|----------|----------|----------|----------|----------|------|
| NOTIF-001 | 接收系统通知 | WebSocket连接正常 | 1. 后台发送系统通知<br>2. 查看客户端是否收到 | 实时收到通知，显示红点 | ✅ 通过 |
| NOTIF-002 | 消息已读标记 | 存在未读消息 | 1. 点击消息标记已读<br>2. 查看未读数变化 | 未读数减少，红点消失 | ✅ 通过 |
| NOTIF-003 | 消息全部已读 | 存在多条未读消息 | 1. 点击全部已读按钮 | 所有消息标记已读 | ✅ 通过 |
| NOTIF-004 | 发布公告 | 管理员已登录 | 1. 创建公告<br>2. 选择发布对象<br>3. 发布 | 目标用户收到公告通知 | ✅ 通过 |
| NOTIF-005 | 邮件发送 | 邮件服务配置正确 | 1. 调用邮件发送接口<br>2. 查看发送记录 | 邮件发送成功，记录状态正确 | ✅ 通过 |
| NOTIF-006 | WebSocket重连 | 网络中断后恢复 | 1. 断开网络<br>2. 恢复网络<br>3. 查看重连 | 自动重连，恢复消息接收 | ✅ 通过 |

### 性能测试

| 用例编号 | 测试场景 | 并发数 | 预期结果 | 实际结果 | 状态 |
|----------|----------|--------|----------|----------|------|
| PERF-001 | 消息推送 | 1000用户 | 推送延迟<1s | 0.8s | ✅ 通过 |
| PERF-002 | 批量邮件发送 | 100封/分钟 | 发送成功率>99% | 99.5% | ✅ 通过 |
| PERF-003 | WebSocket连接 | 5000并发 | 连接稳定 | 稳定 | ✅ 通过 |

---

## 开发记录

| 日期 | 工作内容 | 完成状态 | 备注 |
|------|---------|---------|------|
| 2026-05-06 | 消息通知表设计 | ✅ 完成 | 包含消息类型、优先级字段 |
| 2026-05-06 | 消息通知API开发 | ✅ 完成 | CRUD接口完成 |
| 2026-05-06 | WebSocket推送服务 | ✅ 完成 | 集成RabbitMQ |
| 2026-05-07 | 消息通知组件开发 | ✅ 完成 | 包含红点提示 |
| 2026-05-07 | 消息中心页面开发 | ✅ 完成 | 支持筛选和分页 |
| 2026-05-07 | 系统公告API开发 | ✅ 完成 | 发布、撤回功能 |
| 2026-05-08 | 系统公告管理页面 | ✅ 完成 | 富文本编辑器集成 |
| 2026-05-08 | 邮件服务开发 | ✅ 完成 | SMTP配置支持 |
| 2026-05-08 | 邮件模板管理 | ✅ 完成 | 变量替换功能 |
| 2026-05-09 | 通知设置页面 | ✅ 完成 | 消息接收设置 |
| 2026-05-09 | 消息通知功能测试 | ✅ 完成 | 功能测试通过 |
| 2026-05-09 | 邮件服务测试 | ✅ 完成 | 发送成功率达标 |

---

## 性能指标

| 指标 | 目标值 | 实际值 | 状态 |
|------|--------|--------|------|
| 消息推送延迟 | < 1s | 0.8s | ✅ 达标 |
| WebSocket并发连接 | > 5000 | 5500 | ✅ 达标 |
| 邮件发送成功率 | > 99% | 99.5% | ✅ 达标 |
| 消息列表查询响应 | < 500ms | 200ms | ✅ 达标 |

---

**文档创建:** 2026-05-06  
**最后更新:** 2026-05-09  
**负责人:** 钱七
