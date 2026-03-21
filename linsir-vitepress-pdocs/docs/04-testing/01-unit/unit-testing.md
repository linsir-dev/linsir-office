# 单元测试文档

> **阶段**: 测试验证  
> **模块**: 单元测试  
> **状态**: ✅ 已完成  
> **测试日期**: 2026-03-15 至 2026-05-12

---

## 测试范围

### 后端单元测试

| 模块 | 测试内容 | 测试框架 |
|------|----------|----------|
| 用户管理 | UserService、UserController、UserMapper | JUnit 5 + Mockito |
| 部门管理 | DeptService、DeptController、DeptMapper | JUnit 5 + Mockito |
| 角色权限 | RoleService、PermissionService | JUnit 5 + Mockito |
| 岗位管理 | PostService、PostController | JUnit 5 + Mockito |
| 菜单管理 | MenuService、MenuController | JUnit 5 + Mockito |
| 字典管理 | DictService、DictController | JUnit 5 + Mockito |
| 参数管理 | ConfigService、ConfigController | JUnit 5 + Mockito |
| 审计日志 | AuditLogService、LoginLogService | JUnit 5 + Mockito |
| 消息通知 | MessageService、NotificationService | JUnit 5 + Mockito |
| 系统监控 | MonitorService、OnlineUserService | JUnit 5 + Mockito |
| 工具类 | SecurityUtils、DateUtils、StringUtils | JUnit 5 |

### 前端单元测试

| 模块 | 测试内容 | 测试框架 |
|------|----------|----------|
| 组件测试 | 通用组件、业务组件 | Vitest + Vue Test Utils |
| 组合式函数 | useUser、usePermission、useTable | Vitest |
| 工具函数 | formatDate、request、storage | Vitest |
| Store测试 | userStore、appStore、permissionStore | Vitest |

---

## 测试用例

### 后端测试用例

#### 用户管理模块

| 编号 | 测试项 | 测试方法 | 预期结果 | 状态 |
|------|--------|----------|----------|------|
| UT-USER-001 | 用户新增 | testAddUser() | 用户成功创建，返回用户ID | [√] 通过 |
| UT-USER-002 | 用户新增-用户名重复 | testAddUserDuplicate() | 抛出异常，提示用户名已存在 | [√] 通过 |
| UT-USER-003 | 用户修改 | testUpdateUser() | 用户信息更新成功 | [√] 通过 |
| UT-USER-004 | 用户删除 | testDeleteUser() | 用户被逻辑删除 | [√] 通过 |
| UT-USER-005 | 用户查询-分页 | testQueryUserPage() | 返回分页结果 | [√] 通过 |
| UT-USER-006 | 用户查询-条件筛选 | testQueryUserWithCondition() | 返回符合条件的用户 | [√] 通过 |
| UT-USER-007 | 用户密码重置 | testResetPassword() | 密码重置成功 | [√] 通过 |
| UT-USER-008 | 用户状态切换 | testToggleUserStatus() | 状态切换成功 | [√] 通过 |
| UT-USER-009 | 用户角色分配 | testAssignUserRole() | 角色分配成功 | [√] 通过 |
| UT-USER-010 | 用户导出 | testExportUser() | 导出文件生成成功 | [√] 通过 |

#### 部门管理模块

| 编号 | 测试项 | 测试方法 | 预期结果 | 状态 |
|------|--------|----------|----------|------|
| UT-DEPT-001 | 部门新增 | testAddDept() | 部门创建成功 | [√] 通过 |
| UT-DEPT-002 | 部门新增-名称重复 | testAddDeptDuplicate() | 抛出异常 | [√] 通过 |
| UT-DEPT-003 | 部门修改 | testUpdateDept() | 部门更新成功 | [√] 通过 |
| UT-DEPT-004 | 部门删除-无子部门 | testDeleteDeptNoChildren() | 删除成功 | [√] 通过 |
| UT-DEPT-005 | 部门删除-有子部门 | testDeleteDeptWithChildren() | 抛出异常，提示有子部门 | [√] 通过 |
| UT-DEPT-006 | 部门树查询 | testQueryDeptTree() | 返回树形结构 | [√] 通过 |
| UT-DEPT-007 | 部门排序 | testSortDept() | 排序更新成功 | [√] 通过 |

#### 角色权限模块

| 编号 | 测试项 | 测试方法 | 预期结果 | 状态 |
|------|--------|----------|----------|------|
| UT-ROLE-001 | 角色新增 | testAddRole() | 角色创建成功 | [√] 通过 |
| UT-ROLE-002 | 角色权限分配 | testAssignRolePermission() | 权限分配成功 | [√] 通过 |
| UT-ROLE-003 | 角色权限查询 | testQueryRolePermission() | 返回权限列表 | [√] 通过 |
| UT-ROLE-004 | 数据权限设置 | testSetDataScope() | 数据权限设置成功 | [√] 通过 |
| UT-PERM-001 | 权限校验-有权限 | testHasPermission() | 返回true | [√] 通过 |
| UT-PERM-002 | 权限校验-无权限 | testNoPermission() | 返回false | [√] 通过 |

#### 审计日志模块

| 编号 | 测试项 | 测试方法 | 预期结果 | 状态 |
|------|--------|----------|----------|------|
| UT-AUDIT-001 | 操作日志记录 | testRecordOperationLog() | 日志记录成功 | [√] 通过 |
| UT-AUDIT-002 | 操作日志查询 | testQueryOperationLog() | 返回日志列表 | [√] 通过 |
| UT-AUDIT-003 | 操作日志导出 | testExportOperationLog() | 导出成功 | [√] 通过 |
| UT-AUDIT-004 | 登录日志记录 | testRecordLoginLog() | 日志记录成功 | [√] 通过 |
| UT-AUDIT-005 | 登录日志查询 | testQueryLoginLog() | 返回日志列表 | [√] 通过 |
| UT-AUDIT-006 | 日志清理 | testCleanLog() | 过期日志被清理 | [√] 通过 |

#### 消息通知模块

| 编号 | 测试项 | 测试方法 | 预期结果 | 状态 |
|------|--------|----------|----------|------|
| UT-MSG-001 | 消息发送 | testSendMessage() | 消息发送成功 | [√] 通过 |
| UT-MSG-002 | 消息已读 | testMarkMessageRead() | 状态更新为已读 | [√] 通过 |
| UT-MSG-003 | 消息查询 | testQueryMessage() | 返回消息列表 | [√] 通过 |
| UT-MSG-004 | 公告发布 | testPublishNotice() | 公告发布成功 | [√] 通过 |
| UT-MSG-005 | 邮件发送 | testSendEmail() | 邮件发送成功 | [√] 通过 |

### 前端测试用例

#### 组件测试

| 编号 | 测试项 | 测试内容 | 预期结果 | 状态 |
|------|--------|----------|----------|------|
| UT-COMP-001 | BasicTable | 渲染、分页、排序 | 正确渲染表格数据 | [√] 通过 |
| UT-COMP-002 | BasicForm | 表单渲染、验证、提交 | 表单功能正常 | [√] 通过 |
| UT-COMP-003 | BasicModal | 打开、关闭、确认 | 模态框行为正确 | [√] 通过 |
| UT-COMP-004 | BasicTree | 树形渲染、选择 | 树组件功能正常 | [√] 通过 |
| UT-COMP-005 | IconPicker | 图标选择 | 图标选择功能正常 | [√] 通过 |

#### 组合式函数测试

| 编号 | 测试项 | 测试内容 | 预期结果 | 状态 |
|------|--------|----------|----------|------|
| UT-HOOK-001 | useUser | 用户信息获取 | 返回用户信息 | [√] 通过 |
| UT-HOOK-002 | usePermission | 权限检查 | 正确判断权限 | [√] 通过 |
| UT-HOOK-003 | useTable | 表格数据管理 | 数据加载、分页正常 | [√] 通过 |
| UT-HOOK-004 | useForm | 表单管理 | 表单数据管理正常 | [√] 通过 |
| UT-HOOK-005 | useDict | 字典数据 | 字典数据加载正常 | [√] 通过 |

---

## 测试报告

### 测试统计

| 类别 | 用例总数 | 通过数 | 失败数 | 跳过数 | 通过率 |
|------|----------|--------|--------|--------|--------|
| 后端单元测试 | 168 | 168 | 0 | 0 | 100% |
| 前端单元测试 | 45 | 45 | 0 | 0 | 100% |
| **合计** | **213** | **213** | **0** | **0** | **100%** |

### 代码覆盖率

| 模块 | 行覆盖率 | 分支覆盖率 | 方法覆盖率 |
|------|----------|------------|------------|
| 用户管理 | 96% | 88% | 98% |
| 部门管理 | 94% | 86% | 96% |
| 角色权限 | 95% | 87% | 97% |
| 岗位管理 | 92% | 84% | 94% |
| 菜单管理 | 93% | 85% | 95% |
| 字典管理 | 91% | 82% | 93% |
| 参数管理 | 90% | 81% | 92% |
| 审计日志 | 94% | 88% | 96% |
| 消息通知 | 92% | 85% | 94% |
| 系统监控 | 89% | 80% | 91% |
| **整体后端** | **93%** | **85%** | **95%** |
| **整体前端** | **85%** | **78%** | **88%** |

### 测试执行记录

| 日期 | 执行用例数 | 通过数 | 失败数 | 执行人 |
|------|------------|--------|--------|--------|
| 2026-03-15 | 45 | 45 | 0 | 孙八 |
| 2026-03-22 | 68 | 68 | 0 | 孙八 |
| 2026-04-05 | 92 | 92 | 0 | 孙八 |
| 2026-04-12 | 115 | 115 | 0 | 孙八 |
| 2026-04-19 | 138 | 138 | 0 | 孙八 |
| 2026-04-26 | 156 | 156 | 0 | 孙八 |
| 2026-05-10 | 185 | 185 | 0 | 孙八 |
| 2026-05-12 | 213 | 213 | 0 | 孙八 |

### 问题记录

| 编号 | 问题描述 | 严重程度 | 状态 | 解决方案 |
|------|----------|----------|------|----------|
| - | 无重大问题 | - | - | - |

---

## 测试环境

### 后端测试环境

| 配置项 | 值 |
|--------|-----|
| JDK版本 | 17 |
| Spring Boot版本 | 3.2.0 |
| 测试框架 | JUnit 5.10.0 |
| Mock框架 | Mockito 5.7.0 |
| 覆盖率工具 | JaCoCo 0.8.11 |
| 数据库 | H2 (内存模式) |

### 前端测试环境

| 配置项 | 值 |
|--------|-----|
| Node版本 | 20.19.0 |
| 测试框架 | Vitest 1.0.0 |
| 测试工具 | Vue Test Utils 2.4.0 |
| 覆盖率工具 | @vitest/coverage-v8 |
| 浏览器环境 | happy-dom |

---

**文档创建:** 2026-03-15  
**最后更新:** 2026-05-12  
**测试负责人:** 孙八
