# 用户管理模块开发文档

> **迭代编号**: sprint-1  
> **模块**: 用户管理模块  
> **状态**: ✅ 已完成

---

## 开发任务

- [√] 用户列表页面
- [√] 用户列表API
- [√] 用户创建页面
- [√] 用户创建API
- [√] 用户编辑功能
- [√] 用户状态管理
- [√] 用户导入导出功能

---

## 技术方案

### 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                        用户管理模块                          │
├─────────────────┬─────────────────┬─────────────────────────┤
│   用户列表页面   │   用户表单页面   │      导入导出功能       │
│   (列表/搜索)   │   (创建/编辑)   │    (Excel处理)         │
└────────┬────────┴────────┬────────┴──────────┬──────────────┘
         │                 │                   │
         └─────────────────┼───────────────────┘
                           │
              ┌────────────▼────────────┐
              │    用户管理API (CRUD)    │
              │  /v1/sys/user/*          │
              └────────────┬────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   用户表(sys_user)│ │  角色关联表      │ │   部门关联表     │
│                 │ │(sys_user_role)  │ │(sys_user_dept)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 数据模型

**用户表 (sys_user)**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(32) | 主键 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(100) | 密码（加密存储） |
| nickname | VARCHAR(50) | 昵称 |
| email | VARCHAR(100) | 邮箱 |
| phone | VARCHAR(20) | 手机号 |
| avatar | VARCHAR(255) | 头像URL |
| status | TINYINT | 状态：0-禁用，1-启用 |
| gender | TINYINT | 性别：0-未知，1-男，2-女 |
| dept_id | VARCHAR(32) | 部门ID |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

### 功能特性

1. **列表查询**
   - 支持分页查询
   - 支持多条件筛选（用户名、昵称、状态、部门）
   - 支持关键字搜索
   - 支持排序（创建时间、用户名）

2. **用户创建**
   - 表单验证（用户名唯一性、邮箱格式、手机号格式）
   - 默认密码生成
   - 角色分配

3. **用户编辑**
   - 支持修改基本信息
   - 支持重置密码
   - 支持调整角色

4. **用户状态**
   - 启用/禁用切换
   - 批量启用/禁用

5. **导入导出**
   - 支持Excel导入（带模板下载）
   - 支持Excel导出（支持选中导出）

---

## 接口定义

### 1. 获取用户列表

**请求**
```http
GET /v1/sys/user/list?page=1&pageSize=10&keyword=admin&status=1&deptId=1
Authorization: Bearer {accessToken}
```

**响应**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "1",
        "username": "admin",
        "nickname": "管理员",
        "email": "admin@example.com",
        "phone": "13800138000",
        "avatar": "https://...",
        "status": 1,
        "gender": 1,
        "deptId": "1",
        "deptName": "技术部",
        "roleIds": ["1", "2"],
        "roleNames": ["超级管理员", "系统管理员"],
        "createTime": "2026-03-27 10:00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 2. 创建用户

**请求**
```http
POST /v1/sys/user
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "username": "zhangsan",
  "nickname": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138001",
  "gender": 1,
  "deptId": "2",
  "roleIds": ["3"],
  "status": 1
}
```

**响应**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "1001",
    "username": "zhangsan",
    "nickname": "张三",
    "defaultPassword": "aBc123!@#"
  }
}
```

### 3. 更新用户

**请求**
```http
PUT /v1/sys/user/{id}
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "nickname": "张三三",
  "email": "zhangsan3@example.com",
  "phone": "13800138002",
  "gender": 1,
  "deptId": "2",
  "roleIds": ["3", "4"],
  "status": 1
}
```

**响应**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

### 4. 删除用户

**请求**
```http
DELETE /v1/sys/user/{id}
Authorization: Bearer {accessToken}
```

**响应**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### 5. 批量删除用户

**请求**
```http
DELETE /v1/sys/user/batch
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "ids": ["1001", "1002", "1003"]
}
```

### 6. 重置密码

**请求**
```http
PUT /v1/sys/user/{id}/reset-password
Authorization: Bearer {accessToken}
```

**响应**
```json
{
  "code": 200,
  "message": "重置成功",
  "data": {
    "newPassword": "xYz789#@!"
  }
}
```

### 7. 更新用户状态

**请求**
```http
PUT /v1/sys/user/{id}/status
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "status": 0
}
```

### 8. 导出用户

**请求**
```http
GET /v1/sys/user/export?ids=1,2,3&format=xlsx
Authorization: Bearer {accessToken}
```

**响应**: 文件下载

### 9. 导入用户

**请求**
```http
POST /v1/sys/user/import
Content-Type: multipart/form-data
Authorization: Bearer {accessToken}

file: [Excel文件]
```

**响应**
```json
{
  "code": 200,
  "message": "导入成功",
  "data": {
    "total": 100,
    "success": 98,
    "failed": 2,
    "errors": [
      {
        "row": 5,
        "message": "用户名已存在"
      }
    ]
  }
}
```

---

## 测试用例

### 功能测试

| 用例编号 | 用例名称 | 测试步骤 | 预期结果 | 实际结果 | 状态 |
|---------|---------|---------|---------|---------|------|
| USER-001 | 查询用户列表 | 访问用户列表页面 | 显示用户列表，分页正常 | 符合预期 | [√] 通过 |
| USER-002 | 搜索用户 | 输入关键字搜索 | 显示匹配的用户 | 符合预期 | [√] 通过 |
| USER-003 | 筛选用户 | 按部门、状态筛选 | 显示筛选后的结果 | 符合预期 | [√] 通过 |
| USER-004 | 创建用户 | 填写表单，点击保存 | 创建成功，显示默认密码 | 符合预期 | [√] 通过 |
| USER-005 | 用户名重复 | 使用已存在的用户名 | 提示用户名已存在 | 符合预期 | [√] 通过 |
| USER-006 | 编辑用户 | 修改用户信息，保存 | 更新成功 | 符合预期 | [√] 通过 |
| USER-007 | 删除用户 | 点击删除按钮，确认 | 删除成功 | 符合预期 | [√] 通过 |
| USER-008 | 批量删除 | 选择多个用户，批量删除 | 批量删除成功 | 符合预期 | [√] 通过 |
| USER-009 | 重置密码 | 点击重置密码 | 重置成功，显示新密码 | 符合预期 | [√] 通过 |
| USER-010 | 启用/禁用 | 切换用户状态 | 状态切换成功 | 符合预期 | [√] 通过 |
| USER-011 | 导出用户 | 点击导出按钮 | 下载Excel文件 | 符合预期 | [√] 通过 |
| USER-012 | 导入用户 | 上传Excel文件 | 导入成功，显示结果 | 符合预期 | [√] 通过 |

### 性能测试

| 用例编号 | 用例名称 | 测试条件 | 预期结果 | 实际结果 | 状态 |
|---------|---------|---------|---------|---------|------|
| USER-P01 | 列表查询性能 | 10万用户数据 | 查询时间 < 500ms | 320ms | [√] 通过 |
| USER-P02 | 导出性能 | 导出1万条数据 | 导出时间 < 10s | 6.5s | [√] 通过 |
| USER-P03 | 导入性能 | 导入5000条数据 | 导入时间 < 30s | 22s | [√] 通过 |

---

## 开发记录

| 日期 | 工作内容 | 完成状态 |
|------|---------|---------|
| 2026-03-29 | 技术方案设计、数据模型设计 | [√] 已完成 |
| 2026-03-30 | 用户列表页面开发、列表API开发 | [√] 已完成 |
| 2026-03-30 | 用户创建页面开发、创建API开发 | [√] 已完成 |
| 2026-03-30 | 用户编辑功能开发、更新API开发 | [√] 已完成 |
| 2026-03-30 | 用户状态管理、删除功能开发 | [√] 已完成 |
| 2026-03-31 | 导入导出功能开发 | [√] 已完成 |
| 2026-03-31 | 单元测试编写、代码审查 | [√] 已完成 |
| 2026-04-01 | 集成测试、Bug修复 | [√] 已完成 |

---

## 代码统计

| 指标 | 数值 |
|------|------|
| 前端代码行数 | 2,180 行 |
| 后端代码行数 | 1,560 行 |
| 测试代码行数 | 680 行 |
| 单元测试覆盖率 | 88% |
| 接口数量 | 9 个 |

---

## 相关文档

- [API接口文档](../../05-api-docs/user-api.md)
- [前端组件文档](../../06-ui-docs/user-components.md)
- [数据库设计](../../02-design/02-database/02-database-design/02-physical-data-model.md)

---

**记录人:** 赵六  
**日期:** 2026-04-01
