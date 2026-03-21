# 权限管理模块开发文档

> **迭代编号**: sprint-2  
> **模块**: 权限管理模块  
> **状态**: ✅ 已完成

---

## 开发任务

- [√] 权限资源管理页面
- [√] 权限资源管理API
- [√] 权限树组件
- [√] 权限分配功能
- [√] 权限自动扫描同步
- [√] 权限批量操作

---

## 技术方案

### 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                      权限管理模块                            │
├─────────────────────────────────────────────────────────────┤
│  前端层                                                       │
│  ├── PermissionList.vue        权限列表页面                  │
│  ├── PermissionForm.vue        权限表单页面                  │
│  ├── PermissionTree.vue        权限树组件                    │
│  └── PermissionBatch.vue       权限批量操作                  │
├─────────────────────────────────────────────────────────────┤
│  API层                                                        │
│  ├── PermissionController      权限管理接口                  │
│  ├── PermissionTreeService     权限树服务                    │
│  └── PermissionScanService     权限扫描服务                  │
├─────────────────────────────────────────────────────────────┤
│  数据层                                                       │
│  ├── sys_permission            权限资源表                    │
│  └── sys_role_permission       角色权限关联表                │
└─────────────────────────────────────────────────────────────┘
```

### 数据库设计

#### 权限资源表 (sys_permission)

| 字段名 | 类型 | 长度 | 必填 | 说明 |
|--------|------|------|------|------|
| id | bigint | 20 | 是 | 主键ID |
| parent_id | bigint | 20 | 否 | 父权限ID |
| permission_code | varchar | 100 | 是 | 权限编码 |
| permission_name | varchar | 100 | 是 | 权限名称 |
| permission_type | tinyint | 1 | 是 | 类型：1-菜单 2-按钮 3-API |
| path | varchar | 200 | 否 | 路由路径/API路径 |
| component | varchar | 200 | 否 | 前端组件 |
| icon | varchar | 50 | 否 | 图标 |
| sort_order | int | 11 | 是 | 排序 |
| status | tinyint | 1 | 是 | 状态：0-禁用 1-启用 |
| description | varchar | 500 | 否 | 描述 |
| create_time | datetime | - | 是 | 创建时间 |
| update_time | datetime | - | 是 | 更新时间 |
| create_by | bigint | 20 | 否 | 创建人 |
| update_by | bigint | 20 | 否 | 更新人 |
| deleted | tinyint | 1 | 是 | 删除标记 |

#### 角色权限关联表 (sys_role_permission)

| 字段名 | 类型 | 长度 | 必填 | 说明 |
|--------|------|------|------|------|
| id | bigint | 20 | 是 | 主键ID |
| role_id | bigint | 20 | 是 | 角色ID |
| permission_id | bigint | 20 | 是 | 权限ID |
| create_time | datetime | - | 是 | 创建时间 |

### 权限树结构

```
system:permission                   # 系统权限根节点
├── system:user                     # 用户管理
│   ├── system:user:view            # 查看用户
│   ├── system:user:create          # 创建用户
│   ├── system:user:update          # 更新用户
│   └── system:user:delete          # 删除用户
├── system:role                     # 角色管理
│   ├── system:role:view
│   ├── system:role:create
│   ├── system:role:update
│   └── system:role:delete
└── system:permission               # 权限管理
    ├── system:permission:view
    ├── system:permission:create
    ├── system:permission:update
    └── system:permission:delete
```

### 权限自动扫描机制

```java
@Component
public class PermissionScanService {
    
    @PostConstruct
    public void scanPermissions() {
        // 扫描所有Controller
        Map<String, Object> controllers = applicationContext.getBeansWithAnnotation(RestController.class);
        
        for (Object controller : controllers.values()) {
            Class<?> clazz = controller.getClass();
            RequestMapping baseMapping = clazz.getAnnotation(RequestMapping.class);
            String basePath = baseMapping != null ? baseMapping.value()[0] : "";
            
            // 扫描所有方法
            for (Method method : clazz.getDeclaredMethods()) {
                RequiresPermission annotation = method.getAnnotation(RequiresPermission.class);
                if (annotation != null) {
                    String permissionCode = annotation.value();
                    String permissionName = annotation.name();
                    // 保存或更新权限
                    saveOrUpdatePermission(permissionCode, permissionName, basePath);
                }
            }
        }
    }
}
```

---

## 接口定义

### 权限管理接口

#### 1. 获取权限列表

```yaml
接口: GET /api/v1/sys/permission/list
描述: 分页查询权限列表
参数:
  - pageNum: 页码 (默认1)
  - pageSize: 每页条数 (默认10)
  - permissionName: 权限名称 (模糊查询)
  - permissionType: 权限类型
  - status: 状态
响应:
  code: 200
  data:
    list: 权限列表
    total: 总条数
```

#### 2. 获取权限树

```yaml
接口: GET /api/v1/sys/permission/tree
描述: 获取权限树结构
参数:
  - includeDisabled: 是否包含禁用节点 (默认false)
响应:
  code: 200
  data: 树形结构数据
```

#### 3. 创建权限

```yaml
接口: POST /api/v1/sys/permission
描述: 创建权限资源
请求体:
  parentId: 父权限ID
  permissionCode: 权限编码
  permissionName: 权限名称
  permissionType: 权限类型
  path: 路径
  component: 组件
  icon: 图标
  sortOrder: 排序
  description: 描述
响应:
  code: 200
  data: 创建的权限信息
```

#### 4. 更新权限

```yaml
接口: PUT /api/v1/sys/permission/{id}
描述: 更新权限资源
请求体: 同创建
响应:
  code: 200
  data: 更新后的权限信息
```

#### 5. 删除权限

```yaml
接口: DELETE /api/v1/sys/permission/{id}
描述: 删除权限资源
参数:
  - id: 权限ID
响应:
  code: 200
  message: 删除成功
```

#### 6. 批量操作权限

```yaml
接口: POST /api/v1/sys/permission/batch
描述: 批量操作权限
请求体:
  operation: 操作类型 (enable/disable/delete)
  ids: 权限ID列表
响应:
  code: 200
  message: 操作成功
```

#### 7. 同步权限

```yaml
接口: POST /api/v1/sys/permission/sync
描述: 手动触发权限同步
响应:
  code: 200
  data:
    added: 新增数量
    updated: 更新数量
    deleted: 删除数量
```

---

## 测试用例

### 功能测试用例

| 用例编号 | 用例名称 | 前置条件 | 测试步骤 | 预期结果 | 状态 |
|---------|---------|---------|---------|---------|------|
| TC-PERM-001 | 创建权限 | 已登录管理员 | 1. 进入权限管理<br>2. 点击新增<br>3. 填写信息<br>4. 保存 | 权限创建成功 | [√] 通过 |
| TC-PERM-002 | 编辑权限 | 存在权限数据 | 1. 选择权限<br>2. 点击编辑<br>3. 修改信息<br>4. 保存 | 权限更新成功 | [√] 通过 |
| TC-PERM-003 | 删除权限 | 存在权限数据 | 1. 选择权限<br>2. 点击删除<br>3. 确认删除 | 权限删除成功 | [√] 通过 |
| TC-PERM-004 | 查看权限树 | 已登录 | 1. 进入权限管理<br>2. 查看树形结构 | 树形结构正确显示 | [√] 通过 |
| TC-PERM-005 | 权限搜索 | 存在多条权限 | 1. 输入关键字<br>2. 点击搜索 | 搜索结果正确 | [√] 通过 |
| TC-PERM-006 | 批量启用 | 选中多条禁用权限 | 1. 选择多条权限<br>2. 点击批量启用 | 权限状态变为启用 | [√] 通过 |
| TC-PERM-007 | 批量禁用 | 选中多条启用权限 | 1. 选择多条权限<br>2. 点击批量禁用 | 权限状态变为禁用 | [√] 通过 |
| TC-PERM-008 | 权限同步 | 已登录管理员 | 1. 点击同步按钮<br>2. 等待同步完成 | 同步结果正确显示 | [√] 通过 |

### 性能测试用例

| 用例编号 | 用例名称 | 测试场景 | 预期结果 | 状态 |
|---------|---------|---------|---------|------|
| PERF-PERM-001 | 权限树加载 | 1000+权限节点 | 加载时间<500ms | [√] 通过 |
| PERF-PERM-002 | 权限列表查询 | 10000+权限数据 | 查询时间<200ms | [√] 通过 |
| PERF-PERM-003 | 权限同步 | 扫描100个Controller | 同步时间<5s | [√] 通过 |

---

## 开发记录

| 日期 | 工作内容 | 完成状态 | 负责人 |
|------|---------|---------|--------|
| 2026-04-13 | 权限资源表设计 | [√] 已完成 | 钱七 |
| 2026-04-13 | 权限列表页面开发 | [√] 已完成 | 赵六 |
| 2026-04-14 | 权限树查询API开发 | [√] 已完成 | 钱七 |
| 2026-04-14 | 权限表单页面开发 | [√] 已完成 | 赵六 |
| 2026-04-15 | 权限自动扫描功能 | [√] 已完成 | 钱七 |
| 2026-04-15 | 权限树组件开发 | [√] 已完成 | 赵六 |
| 2026-04-16 | 权限批量操作功能 | [√] 已完成 | 赵六 |
| 2026-04-16 | 权限单元测试 | [√] 已完成 | 孙八 |
| 2026-04-17 | 权限集成测试 | [√] 已完成 | 孙八 |
| 2026-04-17 | 权限接口文档编写 | [√] 已完成 | 钱七 |
| 2026-04-17 | 权限前端组件文档 | [√] 已完成 | 赵六 |

---

## 代码片段

### 权限校验注解

```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresPermission {
    String value();  // 权限编码
    String name() default "";  // 权限名称
    Logical logical() default Logical.AND;  // 逻辑关系
}

public enum Logical {
    AND, OR
}
```

### 权限校验拦截器

```java
@Component
public class PermissionInterceptor implements HandlerInterceptor {
    
    @Autowired
    private PermissionService permissionService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            RequiresPermission annotation = handlerMethod.getMethodAnnotation(RequiresPermission.class);
            
            if (annotation != null) {
                String permissionCode = annotation.value();
                Long userId = SecurityUtils.getCurrentUserId();
                
                // 校验权限
                if (!permissionService.hasPermission(userId, permissionCode)) {
                    throw new AccessDeniedException("无权限访问");
                }
            }
        }
        return true;
    }
}
```

### 前端权限树组件

```vue
<template>
  <el-tree
    ref="permissionTree"
    :data="treeData"
    :props="defaultProps"
    node-key="id"
    show-checkbox
    :default-expand-all="false"
    :expand-on-click-node="false"
    @check-change="handleCheckChange"
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <el-icon><component :is="data.icon || 'Folder'" /></el-icon>
        <span>{{ data.permissionName }}</span>
        <el-tag size="small" :type="getTypeTag(data.permissionType)">
          {{ getTypeText(data.permissionType) }}
        </el-tag>
      </span>
    </template>
  </el-tree>
</template>

<script setup>
const props = defineProps({
  value: Array
});

const emit = defineEmits(['update:value']);

const treeData = ref([]);
const permissionTree = ref(null);

// 加载权限树
const loadTree = async () => {
  const res = await getPermissionTree();
  treeData.value = res.data;
};

// 获取选中的权限
const getCheckedKeys = () => {
  return permissionTree.value.getCheckedKeys();
};

// 设置选中的权限
const setCheckedKeys = (keys) => {
  permissionTree.value.setCheckedKeys(keys);
};

defineExpose({
  getCheckedKeys,
  setCheckedKeys
});
</script>
```

---

## 问题记录

| 问题编号 | 问题描述 | 解决方案 | 状态 |
|---------|---------|---------|------|
| ISSUE-001 | 权限树大数据量加载慢 | 采用虚拟滚动+懒加载 | [√] 已解决 |
| ISSUE-002 | 权限编码重复导致冲突 | 增加唯一索引，前端实时校验 | [√] 已解决 |
| ISSUE-003 | 权限同步时事务超时 | 分批处理，异步同步 | [√] 已解决 |

---

**文档创建:** 2026-04-13  
**最后更新:** 2026-04-17  
**负责人:** 钱七、赵六
