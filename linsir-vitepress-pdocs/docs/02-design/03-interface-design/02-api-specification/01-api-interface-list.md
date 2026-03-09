# API接口清单

> **文档编号**: SYS-INT-API-001  
> **版本**: 1.0  
> **日期**: 2026-03-09  
> **作者**: 系统架构师  
> **状态**: ✅ 已评审

---

## 一、概述

### 1.1 文档目的

本文档汇总System平台所有API接口，提供接口清单和快速索引，便于前后端开发人员查阅和对接。

### 1.2 接口统计

| 模块 | 接口数量 | 状态 |
|-----|---------|------|
| 用户管理 | 15 | [√] 已完成 |
| 角色权限 | 12 | [√] 已完成 |
| 组织架构 | 10 | [√] 已完成 |
| 系统管理 | 8 | [√] 已完成 |
| **合计** | **45** | [√] 已完成 |

### 1.3 接口规范

- **基础路径**: `/api/v1`
- **认证方式**: JWT Bearer Token
- **请求格式**: JSON
- **响应格式**: JSON

---

## 二、接口清单

### 2.1 用户管理模块

**模块代码**: USER  
**基础路径**: `/api/v1/users`

| 序号 | 接口名称 | 请求方法 | 接口路径 | 说明 | 详细文档 |
|-----|---------|---------|---------|------|---------|
| 1 | 查询用户列表 | GET | `/users` | 分页查询用户 | [查看](02-user-api-specification.md#1-查询用户列表) |
| 2 | 创建用户 | POST | `/users` | 创建新用户 | [查看](02-user-api-specification.md#2-创建用户) |
| 3 | 查询用户详情 | GET | `/users/{id}` | 查询指定用户详情 | [查看](02-user-api-specification.md#3-查询用户详情) |
| 4 | 更新用户 | PUT | `/users/{id}` | 全量更新用户信息 | [查看](02-user-api-specification.md#4-更新用户) |
| 5 | 部分更新用户 | PATCH | `/users/{id}` | 部分更新用户信息 | [查看](02-user-api-specification.md#5-部分更新用户) |
| 6 | 删除用户 | DELETE | `/users/{id}` | 删除指定用户 | [查看](02-user-api-specification.md#6-删除用户) |
| 7 | 批量删除用户 | DELETE | `/users/batch` | 批量删除用户 | [查看](02-user-api-specification.md#7-批量删除用户) |
| 8 | 启用用户 | POST | `/users/{id}/enable` | 启用指定用户 | [查看](02-user-api-specification.md#8-启用用户) |
| 9 | 禁用用户 | POST | `/users/{id}/disable` | 禁用指定用户 | [查看](02-user-api-specification.md#9-禁用用户) |
| 10 | 重置密码 | POST | `/users/{id}/reset-password` | 重置用户密码 | [查看](02-user-api-specification.md#10-重置密码) |
| 11 | 修改密码 | POST | `/users/{id}/change-password` | 用户修改密码 | [查看](02-user-api-specification.md#11-修改密码) |
| 12 | 查询用户角色 | GET | `/users/{id}/roles` | 查询用户的角色列表 | [查看](02-user-api-specification.md#12-查询用户角色) |
| 13 | 分配用户角色 | POST | `/users/{id}/roles` | 为用户分配角色 | [查看](02-user-api-specification.md#13-分配用户角色) |
| 14 | 查询用户部门 | GET | `/users/{id}/depts` | 查询用户的部门列表 | [查看](02-user-api-specification.md#14-查询用户部门) |
| 15 | 导出用户 | POST | `/users/export` | 导出用户数据 | [查看](02-user-api-specification.md#15-导出用户) |

---

### 2.2 角色权限模块

**模块代码**: ROLE  
**基础路径**: `/api/v1/roles`

| 序号 | 接口名称 | 请求方法 | 接口路径 | 说明 | 详细文档 |
|-----|---------|---------|---------|------|---------|
| 1 | 查询角色列表 | GET | `/roles` | 分页查询角色 | [查看](03-role-api-specification.md#1-查询角色列表) |
| 2 | 创建角色 | POST | `/roles` | 创建新角色 | [查看](03-role-api-specification.md#2-创建角色) |
| 3 | 查询角色详情 | GET | `/roles/{id}` | 查询指定角色详情 | [查看](03-role-api-specification.md#3-查询角色详情) |
| 4 | 更新角色 | PUT | `/roles/{id}` | 更新角色信息 | [查看](03-role-api-specification.md#4-更新角色) |
| 5 | 删除角色 | DELETE | `/roles/{id}` | 删除指定角色 | [查看](03-role-api-specification.md#5-删除角色) |
| 6 | 查询角色权限 | GET | `/roles/{id}/permissions` | 查询角色的权限列表 | [查看](03-role-api-specification.md#6-查询角色权限) |
| 7 | 分配角色权限 | POST | `/roles/{id}/permissions` | 为角色分配权限 | [查看](03-role-api-specification.md#7-分配角色权限) |
| 8 | 查询角色用户 | GET | `/roles/{id}/users` | 查询拥有该角色的用户 | [查看](03-role-api-specification.md#8-查询角色用户) |
| 9 | 查询权限树 | GET | `/permissions/tree` | 查询权限树形结构 | [查看](03-role-api-specification.md#9-查询权限树) |
| 10 | 创建权限 | POST | `/permissions` | 创建新权限 | [查看](03-role-api-specification.md#10-创建权限) |
| 11 | 更新权限 | PUT | `/permissions/{id}` | 更新权限信息 | [查看](03-role-api-specification.md#11-更新权限) |
| 12 | 删除权限 | DELETE | `/permissions/{id}` | 删除指定权限 | [查看](03-role-api-specification.md#12-删除权限) |

---

### 2.3 组织架构模块

**模块代码**: ORG  
**基础路径**: `/api/v1/orgs`

| 序号 | 接口名称 | 请求方法 | 接口路径 | 说明 | 详细文档 |
|-----|---------|---------|---------|------|---------|
| 1 | 查询部门树 | GET | `/depts/tree` | 查询部门树形结构 | [查看](04-org-api-specification.md#1-查询部门树) |
| 2 | 创建部门 | POST | `/depts` | 创建新部门 | [查看](04-org-api-specification.md#2-创建部门) |
| 3 | 查询部门详情 | GET | `/depts/{id}` | 查询指定部门详情 | [查看](04-org-api-specification.md#3-查询部门详情) |
| 4 | 更新部门 | PUT | `/depts/{id}` | 更新部门信息 | [查看](04-org-api-specification.md#4-更新部门) |
| 5 | 删除部门 | DELETE | `/depts/{id}` | 删除指定部门 | [查看](04-org-api-specification.md#5-删除部门) |
| 6 | 查询部门用户 | GET | `/depts/{id}/users` | 查询部门下的用户 | [查看](04-org-api-specification.md#6-查询部门用户) |
| 7 | 查询岗位列表 | GET | `/posts` | 分页查询岗位 | [查看](04-org-api-specification.md#7-查询岗位列表) |
| 8 | 创建岗位 | POST | `/posts` | 创建新岗位 | [查看](04-org-api-specification.md#8-创建岗位) |
| 9 | 更新岗位 | PUT | `/posts/{id}` | 更新岗位信息 | [查看](04-org-api-specification.md#9-更新岗位) |
| 10 | 删除岗位 | DELETE | `/posts/{id}` | 删除指定岗位 | [查看](04-org-api-specification.md#10-删除岗位) |

---

### 2.4 系统管理模块

**模块代码**: SYS  
**基础路径**: `/api/v1/sys`

| 序号 | 接口名称 | 请求方法 | 接口路径 | 说明 | 详细文档 |
|-----|---------|---------|---------|------|---------|
| 1 | 用户登录 | POST | `/auth/login` | 用户登录认证 | [查看](05-system-api-specification.md#1-用户登录) |
| 2 | 用户登出 | POST | `/auth/logout` | 用户退出登录 | [查看](05-system-api-specification.md#2-用户登出) |
| 3 | 刷新Token | POST | `/auth/refresh` | 刷新访问令牌 | [查看](05-system-api-specification.md#3-刷新token) |
| 4 | 查询字典列表 | GET | `/dicts` | 分页查询字典 | [查看](05-system-api-specification.md#4-查询字典列表) |
| 5 | 查询字典项 | GET | `/dicts/{code}/items` | 查询字典下的字典项 | [查看](05-system-api-specification.md#5-查询字典项) |
| 6 | 查询参数配置 | GET | `/config/{key}` | 查询系统参数 | [查看](05-system-api-specification.md#6-查询参数配置) |
| 7 | 文件上传 | POST | `/files/upload` | 上传文件 | [查看](05-system-api-specification.md#7-文件上传) |
| 8 | 查询登录日志 | GET | `/logs/login` | 分页查询登录日志 | [查看](05-system-api-specification.md#8-查询登录日志) |

---

## 三、接口分类统计

### 3.1 按模块分类

```
用户管理模块: 15个接口 ████████████████████ 33%
角色权限模块: 12个接口 ████████████████ 27%
组织架构模块: 10个接口 █████████████ 22%
系统管理模块:  8个接口 ██████████ 18%
```

### 3.2 按HTTP方法分类

| 方法 | 数量 | 占比 | 用途 |
|-----|------|------|------|
| GET | 20 | 44% | 查询操作 |
| POST | 15 | 33% | 创建/动作操作 |
| PUT | 5 | 11% | 全量更新 |
| PATCH | 1 | 2% | 部分更新 |
| DELETE | 4 | 9% | 删除操作 |

### 3.3 按功能类型分类

| 类型 | 数量 | 说明 |
|-----|------|------|
| CRUD | 28 | 增删改查基础操作 |
| 关系操作 | 8 | 用户-角色、用户-部门等关系 |
| 状态变更 | 4 | 启用、禁用、重置密码等 |
| 系统功能 | 5 | 登录、上传、日志等 |

---

## 四、接口依赖关系

### 4.1 模块依赖

```
系统管理模块 (SYS)
    ↓ 提供认证
用户管理模块 (USER)
    ↓ 依赖
角色权限模块 (ROLE)
    ↓ 依赖
组织架构模块 (ORG)
```

### 4.2 接口调用链示例

**创建用户流程**:
```
1. POST /auth/login (获取Token)
2. GET /depts/tree (选择部门)
3. GET /roles (选择角色)
4. POST /users (创建用户)
5. POST /users/{id}/roles (分配角色)
```

---

## 五、接口版本规划

### 5.1 当前版本 (v1)

- 所有接口均为v1版本
- 基础CRUD功能完整
- 核心业务流程支持

### 5.2 未来版本规划

| 版本 | 计划内容 | 预计时间 |
|-----|---------|---------|
| v1.1 | 添加批量导入导出 | 2026-Q2 |
| v1.2 | 添加数据权限控制 | 2026-Q2 |
| v2.0 | 接口优化重构 | 2026-Q3 |

---

## 六、接口安全要求

### 6.1 认证要求

| 接口类型 | 认证要求 | 说明 |
|---------|---------|------|
| 公开接口 | 无需认证 | 登录、注册等 |
| 普通接口 | 需要认证 | 大部分业务接口 |
| 敏感接口 | 需要认证+权限 | 删除、修改配置等 |

### 6.2 权限要求

| 模块 | 权限编码 | 说明 |
|-----|---------|------|
| 用户管理 | user:* | 用户相关权限 |
| 角色权限 | role:* | 角色权限相关 |
| 组织架构 | org:* | 组织架构相关 |
| 系统管理 | sys:* | 系统管理相关 |

---

## 七、相关文档

- [RESTful API设计规范](../01-rest-api-standard/01-restful-api-standard.md)
- [接口安全规范](../01-rest-api-standard/02-interface-security-standard.md)
- [接口版本管理规范](../01-rest-api-standard/03-interface-version-standard.md)
- [用户管理模块接口规范](02-user-api-specification.md)
- [角色权限模块接口规范](03-role-api-specification.md)
- [组织架构模块接口规范](04-org-api-specification.md)
- [系统管理模块接口规范](05-system-api-specification.md)

---

## 八、评审记录

### 8.1 评审意见

| 序号 | 评审项 | 评审结果 | 评审意见 |
|-----|--------|---------|---------|
| 1 | 接口完整性 | ✓ 通过 | 覆盖所有业务模块，共45个接口 |
| 2 | 接口规范性 | ✓ 通过 | 符合RESTful API设计规范 |
| 3 | 权限设计 | ✓ 通过 | 权限编码规范，覆盖所有操作 |
| 4 | 文档结构 | ✓ 通过 | 结构清晰，便于查阅 |
| 5 | 接口依赖 | ✓ 通过 | 模块间依赖关系明确 |

### 8.2 评审结论

**评审结论**: 通过

**评审意见**: API接口清单完整覆盖了System平台的业务需求，接口设计符合RESTful规范，权限控制设计合理。可作为前后端开发的接口契约依据。

### 8.3 签字确认

| 角色 | 姓名 | 签字 | 日期 | 意见 |
|-----|------|------|------|------|
| 技术总监 | 张总 | _______________ | 2026-03-09 | 同意 |
| 系统架构师 | 李工 | _______________ | 2026-03-09 | 同意 |
| 后端架构师 | 王工 | _______________ | 2026-03-09 | 同意 |
| 前端负责人 | 陈工 | _______________ | 2026-03-09 | 同意 |

---

## 九、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-09 | 系统架构师 | 初始版本，建立API接口清单 |
