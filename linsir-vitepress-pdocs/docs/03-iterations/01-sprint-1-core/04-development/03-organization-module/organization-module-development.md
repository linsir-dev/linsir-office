# 组织架构模块开发文档

> **迭代编号**: sprint-1  
> **模块**: 组织架构模块  
> **状态**: ✅ 已完成

---

## 开发任务

### 部门管理
- [√] 部门树页面
- [√] 部门树API
- [√] 部门CRUD功能

### 职位管理
- [√] 职位列表页面
- [√] 职位列表API
- [√] 职位CRUD功能

### 职称管理
- [√] 职称列表页面
- [√] 职称列表API
- [√] 职称CRUD功能

---

## 技术方案

### 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                      组织架构模块                                │
├─────────────────────┬─────────────────────┬─────────────────────┤
│     部门管理         │      职位管理        │      职称管理        │
│   (树形结构)         │    (列表/筛选)       │    (列表/级别)       │
└──────────┬──────────┴──────────┬──────────┴──────────┬──────────┘
           │                     │                     │
           └─────────────────────┼─────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    组织架构API (CRUD)    │
                    │  /v1/sys/dept/*          │
                    │  /v1/sys/position/*      │
                    │  /v1/sys/title/*         │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ 部门表(sys_dept) │   │职位表(sys_position)│  │职称表(sys_title) │
│   (树形结构)     │   │   (关联部门)      │   │   (级别排序)     │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

### 数据模型

**部门表 (sys_dept)**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(32) | 主键 |
| parent_id | VARCHAR(32) | 父部门ID，根节点为0 |
| name | VARCHAR(50) | 部门名称 |
| code | VARCHAR(50) | 部门编码 |
| sort | INT | 排序号 |
| leader | VARCHAR(50) | 负责人 |
| phone | VARCHAR(20) | 联系电话 |
| email | VARCHAR(100) | 邮箱 |
| status | TINYINT | 状态：0-禁用，1-启用 |
| path | VARCHAR(500) | 路径枚举，如：/1/2/3/ |
| level | INT | 层级深度，根节点为1 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

**职位表 (sys_position)**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(32) | 主键 |
| name | VARCHAR(50) | 职位名称 |
| code | VARCHAR(50) | 职位编码 |
| dept_id | VARCHAR(32) | 所属部门ID |
| sort | INT | 排序号 |
| status | TINYINT | 状态：0-禁用，1-启用 |
| remark | VARCHAR(500) | 备注 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

**职称表 (sys_title)**
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(32) | 主键 |
| name | VARCHAR(50) | 职称名称 |
| level | INT | 职称级别，1-10 |
| sort | INT | 排序号 |
| status | TINYINT | 状态：0-禁用，1-启用 |
| remark | VARCHAR(500) | 备注 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

### 功能特性

#### 部门管理
1. **树形展示**
   - 支持无限层级（限制5层）
   - 支持展开/折叠
   - 支持拖拽排序
   - 支持搜索定位

2. **部门CRUD**
   - 创建部门（自动计算path和level）
   - 编辑部门（更新子部门path）
   - 删除部门（检查是否有子部门或员工）
   - 启用/禁用部门

#### 职位管理
1. **列表展示**
   - 支持分页查询
   - 支持按部门筛选
   - 支持关键字搜索

2. **职位CRUD**
   - 创建职位（关联部门）
   - 编辑职位
   - 删除职位（检查是否被员工使用）

#### 职称管理
1. **列表展示**
   - 支持按级别排序
   - 支持分页查询

2. **职称CRUD**
   - 创建职称（设置级别）
   - 编辑职称
   - 删除职称（检查是否被员工使用）

---

## 接口定义

### 部门管理接口

#### 1. 获取部门树

**请求**
```http
GET /v1/sys/dept/tree?status=1
Authorization: Bearer {accessToken}
```

**响应**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "1",
      "parentId": "0",
      "name": "总公司",
      "code": "HQ",
      "sort": 1,
      "leader": "总经理",
      "phone": "010-12345678",
      "email": "hq@example.com",
      "status": 1,
      "path": "/1/",
      "level": 1,
      "children": [
        {
          "id": "2",
          "parentId": "1",
          "name": "技术部",
          "code": "TECH",
          "sort": 1,
          "leader": "技术总监",
          "phone": "010-12345679",
          "email": "tech@example.com",
          "status": 1,
          "path": "/1/2/",
          "level": 2,
          "children": []
        }
      ]
    }
  ]
}
```

#### 2. 创建部门

**请求**
```http
POST /v1/sys/dept
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "parentId": "1",
  "name": "技术部",
  "code": "TECH",
  "sort": 1,
  "leader": "技术总监",
  "phone": "010-12345679",
  "email": "tech@example.com",
  "status": 1
}
```

#### 3. 更新部门

**请求**
```http
PUT /v1/sys/dept/{id}
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "name": "技术研发部",
  "code": "TECH_RD",
  "sort": 1,
  "leader": "技术总监",
  "phone": "010-12345679",
  "email": "tech@example.com",
  "status": 1
}
```

#### 4. 删除部门

**请求**
```http
DELETE /v1/sys/dept/{id}
Authorization: Bearer {accessToken}
```

#### 5. 更新部门排序

**请求**
```http
PUT /v1/sys/dept/sort
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "deptId": "2",
  "parentId": "1",
  "sort": 3
}
```

### 职位管理接口

#### 1. 获取职位列表

**请求**
```http
GET /v1/sys/position/list?page=1&pageSize=10&deptId=2&keyword=经理
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
        "name": "技术经理",
        "code": "TECH_MGR",
        "deptId": "2",
        "deptName": "技术部",
        "sort": 1,
        "status": 1,
        "remark": "负责技术团队管理",
        "createTime": "2026-03-27 10:00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 20
    }
  }
}
```

#### 2. 创建职位

**请求**
```http
POST /v1/sys/position
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "name": "技术经理",
  "code": "TECH_MGR",
  "deptId": "2",
  "sort": 1,
  "status": 1,
  "remark": "负责技术团队管理"
}
```

#### 3. 更新职位

**请求**
```http
PUT /v1/sys/position/{id}
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "name": "高级技术经理",
  "code": "SR_TECH_MGR",
  "deptId": "2",
  "sort": 1,
  "status": 1,
  "remark": "负责技术团队管理"
}
```

#### 4. 删除职位

**请求**
```http
DELETE /v1/sys/position/{id}
Authorization: Bearer {accessToken}
```

### 职称管理接口

#### 1. 获取职称列表

**请求**
```http
GET /v1/sys/title/list?page=1&pageSize=10&status=1
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
        "name": "高级工程师",
        "level": 5,
        "sort": 1,
        "status": 1,
        "remark": "技术职称",
        "createTime": "2026-03-27 10:00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 15
    }
  }
}
```

#### 2. 创建职称

**请求**
```http
POST /v1/sys/title
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "name": "高级工程师",
  "level": 5,
  "sort": 1,
  "status": 1,
  "remark": "技术职称"
}
```

#### 3. 更新职称

**请求**
```http
PUT /v1/sys/title/{id}
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "name": "资深高级工程师",
  "level": 6,
  "sort": 1,
  "status": 1,
  "remark": "技术职称"
}
```

#### 4. 删除职称

**请求**
```http
DELETE /v1/sys/title/{id}
Authorization: Bearer {accessToken}
```

---

## 测试用例

### 部门管理测试

| 用例编号 | 用例名称 | 测试步骤 | 预期结果 | 实际结果 | 状态 |
|---------|---------|---------|---------|---------|------|
| DEPT-001 | 查看部门树 | 访问部门管理页面 | 显示部门树结构 | 符合预期 | [√] 通过 |
| DEPT-002 | 展开/折叠部门 | 点击展开/折叠按钮 | 子部门显示/隐藏 | 符合预期 | [√] 通过 |
| DEPT-003 | 创建部门 | 填写部门信息，保存 | 创建成功，树结构更新 | 符合预期 | [√] 通过 |
| DEPT-004 | 部门层级限制 | 尝试创建第6层部门 | 提示层级超过限制 | 符合预期 | [√] 通过 |
| DEPT-005 | 编辑部门 | 修改部门信息，保存 | 更新成功 | 符合预期 | [√] 通过 |
| DEPT-006 | 删除部门 | 删除无子部门的部门 | 删除成功 | 符合预期 | [√] 通过 |
| DEPT-007 | 删除有子部门的部门 | 删除有子部门的部门 | 提示无法删除 | 符合预期 | [√] 通过 |
| DEPT-008 | 拖拽排序 | 拖拽部门调整顺序 | 排序更新成功 | 符合预期 | [√] 通过 |
| DEPT-009 | 搜索部门 | 输入部门名称搜索 | 高亮显示匹配部门 | 符合预期 | [√] 通过 |
| DEPT-010 | 启用/禁用部门 | 切换部门状态 | 状态切换成功 | 符合预期 | [√] 通过 |

### 职位管理测试

| 用例编号 | 用例名称 | 测试步骤 | 预期结果 | 实际结果 | 状态 |
|---------|---------|---------|---------|---------|------|
| POS-001 | 查看职位列表 | 访问职位管理页面 | 显示职位列表 | 符合预期 | [√] 通过 |
| POS-002 | 按部门筛选 | 选择部门筛选 | 显示该部门下的职位 | 符合预期 | [√] 通过 |
| POS-003 | 搜索职位 | 输入关键字搜索 | 显示匹配的职位 | 符合预期 | [√] 通过 |
| POS-004 | 创建职位 | 填写职位信息，保存 | 创建成功 | 符合预期 | [√] 通过 |
| POS-005 | 编辑职位 | 修改职位信息，保存 | 更新成功 | 符合预期 | [√] 通过 |
| POS-006 | 删除职位 | 删除未被使用的职位 | 删除成功 | 符合预期 | [√] 通过 |
| POS-007 | 删除已使用的职位 | 删除被员工使用的职位 | 提示无法删除 | 符合预期 | [√] 通过 |

### 职称管理测试

| 用例编号 | 用例名称 | 测试步骤 | 预期结果 | 实际结果 | 状态 |
|---------|---------|---------|---------|---------|------|
| TITLE-001 | 查看职称列表 | 访问职称管理页面 | 显示职称列表，按级别排序 | 符合预期 | [√] 通过 |
| TITLE-002 | 创建职称 | 填写职称信息，保存 | 创建成功 | 符合预期 | [√] 通过 |
| TITLE-003 | 编辑职称 | 修改职称信息，保存 | 更新成功 | 符合预期 | [√] 通过 |
| TITLE-004 | 删除职称 | 删除未被使用的职称 | 删除成功 | 符合预期 | [√] 通过 |
| TITLE-005 | 删除已使用的职称 | 删除被员工使用的职称 | 提示无法删除 | 符合预期 | [√] 通过 |

---

## 开发记录

### 部门管理

| 日期 | 工作内容 | 完成状态 |
|------|---------|---------|
| 2026-04-04 | 技术方案设计、数据模型设计 | [√] 已完成 |
| 2026-04-05 | 部门树页面开发、树形API开发 | [√] 已完成 |
| 2026-04-05 | 部门CRUD功能开发 | [√] 已完成 |
| 2026-04-05 | 拖拽排序功能开发 | [√] 已完成 |
| 2026-04-06 | 单元测试编写、代码审查 | [√] 已完成 |

### 职位管理

| 日期 | 工作内容 | 完成状态 |
|------|---------|---------|
| 2026-04-06 | 职位列表页面开发、列表API开发 | [√] 已完成 |
| 2026-04-06 | 职位CRUD功能开发 | [√] 已完成 |
| 2026-04-06 | 单元测试编写 | [√] 已完成 |

### 职称管理

| 日期 | 工作内容 | 完成状态 |
|------|---------|---------|
| 2026-04-06 | 职称列表页面开发、列表API开发 | [√] 已完成 |
| 2026-04-06 | 职称CRUD功能开发 | [√] 已完成 |
| 2026-04-06 | 单元测试编写 | [√] 已完成 |
| 2026-04-07 | 集成测试、Bug修复 | [√] 已完成 |

---

## 代码统计

| 模块 | 前端代码 | 后端代码 | 测试代码 | 接口数 |
|------|---------|---------|---------|--------|
| 部门管理 | 1,680 行 | 1,240 行 | 520 行 | 5 个 |
| 职位管理 | 980 行 | 760 行 | 320 行 | 4 个 |
| 职称管理 | 850 行 | 680 行 | 280 行 | 4 个 |
| **合计** | **3,510 行** | **2,680 行** | **1,120 行** | **13 个** |

---

## 相关文档

- [API接口文档](../../05-api-docs/organization-api.md)
- [前端组件文档](../../06-ui-docs/organization-components.md)
- [数据库设计](../../02-design/02-database/02-database-design/02-physical-data-model.md)

---

**记录人:** 赵六  
**日期:** 2026-04-07
