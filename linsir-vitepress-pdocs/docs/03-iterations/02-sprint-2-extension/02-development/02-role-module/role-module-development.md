# 角色管理模块开发文档

> **迭代编号**: sprint-2  
> **模块**: 角色管理模块  
> **状态**: ✅ 已完成

---

## 开发任务

- [√] 角色列表页面
- [√] 角色管理API
- [√] 用户角色分配
- [√] 数据权限配置
- [√] 角色权限分配
- [√] 角色权限复制

---

## 技术方案

### 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                      角色管理模块                            │
├─────────────────────────────────────────────────────────────┤
│  前端层                                                       │
│  ├── RoleList.vue              角色列表页面                  │
│  ├── RoleForm.vue              角色表单页面                  │
│  ├── RolePermission.vue        角色权限分配                  │
│  ├── RoleDataPermission.vue    数据权限配置                  │
│  └── RoleUser.vue              用户角色分配                  │
├─────────────────────────────────────────────────────────────┤
│  API层                                                        │
│  ├── RoleController            角色管理接口                  │
│  ├── RolePermissionService     角色权限服务                  │
│  ├── RoleDataPermissionService 数据权限服务                  │
│  └── RoleUserService           用户角色服务                  │
├─────────────────────────────────────────────────────────────┤
│  数据层                                                       │
│  ├── sys_role                  角色表                        │
│  ├── sys_role_permission       角色权限关联表                │
│  ├── sys_role_data_permission  角色数据权限表                │
│  └── sys_user_role             用户角色关联表                │
└─────────────────────────────────────────────────────────────┘
```

### 数据库设计

#### 角色表 (sys_role)

| 字段名 | 类型 | 长度 | 必填 | 说明 |
|--------|------|------|------|------|
| id | bigint | 20 | 是 | 主键ID |
| role_code | varchar | 50 | 是 | 角色编码 |
| role_name | varchar | 100 | 是 | 角色名称 |
| role_type | tinyint | 1 | 是 | 类型：1-系统角色 2-业务角色 |
| data_scope | tinyint | 1 | 是 | 数据范围：1-全部 2-本部门 3-本部门及下级 4-仅本人 5-自定义 |
| status | tinyint | 1 | 是 | 状态：0-禁用 1-启用 |
| description | varchar | 500 | 否 | 描述 |
| create_time | datetime | - | 是 | 创建时间 |
| update_time | datetime | - | 是 | 更新时间 |
| create_by | bigint | 20 | 否 | 创建人 |
| update_by | bigint | 20 | 否 | 更新人 |
| deleted | tinyint | 1 | 是 | 删除标记 |

#### 角色数据权限表 (sys_role_data_permission)

| 字段名 | 类型 | 长度 | 必填 | 说明 |
|--------|------|------|------|------|
| id | bigint | 20 | 是 | 主键ID |
| role_id | bigint | 20 | 是 | 角色ID |
| dept_id | bigint | 20 | 是 | 部门ID |
| create_time | datetime | - | 是 | 创建时间 |

#### 用户角色关联表 (sys_user_role)

| 字段名 | 类型 | 长度 | 必填 | 说明 |
|--------|------|------|------|------|
| id | bigint | 20 | 是 | 主键ID |
| user_id | bigint | 20 | 是 | 用户ID |
| role_id | bigint | 20 | 是 | 角色ID |
| create_time | datetime | - | 是 | 创建时间 |

### 数据权限范围

```
数据范围枚举:
├── ALL              # 全部数据
├── DEPT_ONLY        # 本部门数据
├── DEPT_AND_CHILD   # 本部门及下级数据
├── SELF_ONLY        # 仅本人数据
└── CUSTOM           # 自定义规则
```

### 数据权限规则引擎

```java
@Component
public class DataPermissionRuleEngine {
    
    @Autowired
    private SysRoleDataPermissionMapper dataPermissionMapper;
    
    /**
     * 构建数据权限SQL条件
     */
    public String buildDataScopeCondition(Long userId, String tableAlias) {
        // 获取用户角色
        List<SysRole> roles = getUserRoles(userId);
        
        Set<String> conditions = new HashSet<>();
        
        for (SysRole role : roles) {
            String condition = buildRoleCondition(role, tableAlias);
            if (condition != null) {
                conditions.add(condition);
            }
        }
        
        if (conditions.isEmpty()) {
            return "1=0"; // 无权限
        }
        
        return String.join(" OR ", conditions);
    }
    
    private String buildRoleCondition(SysRole role, String alias) {
        switch (role.getDataScope()) {
            case ALL:
                return null; // 全部数据，无需限制
            case DEPT_ONLY:
                Long deptId = getUserDeptId();
                return alias + ".dept_id = " + deptId;
            case DEPT_AND_CHILD:
                List<Long> childDeptIds = getChildDeptIds(getUserDeptId());
                return alias + ".dept_id IN (" + StringUtils.join(childDeptIds, ",") + ")";
            case SELF_ONLY:
                return alias + ".create_by = " + SecurityUtils.getCurrentUserId();
            case CUSTOM:
                return buildCustomCondition(role.getId(), alias);
            default:
                return "1=0";
        }
    }
}
```

---

## 接口定义

### 角色管理接口

#### 1. 获取角色列表

```yaml
接口: GET /api/v1/sys/role/list
描述: 分页查询角色列表
参数:
  - pageNum: 页码 (默认1)
  - pageSize: 每页条数 (默认10)
  - roleName: 角色名称 (模糊查询)
  - roleType: 角色类型
  - status: 状态
响应:
  code: 200
  data:
    list: 角色列表
    total: 总条数
```

#### 2. 创建角色

```yaml
接口: POST /api/v1/sys/role
描述: 创建角色
请求体:
  roleCode: 角色编码
  roleName: 角色名称
  roleType: 角色类型
  dataScope: 数据范围
  description: 描述
响应:
  code: 200
  data: 创建的角色信息
```

#### 3. 更新角色

```yaml
接口: PUT /api/v1/sys/role/{id}
描述: 更新角色
请求体: 同创建
响应:
  code: 200
  data: 更新后的角色信息
```

#### 4. 删除角色

```yaml
接口: DELETE /api/v1/sys/role/{id}
描述: 删除角色
参数:
  - id: 角色ID
响应:
  code: 200
  message: 删除成功
```

#### 5. 分配角色权限

```yaml
接口: POST /api/v1/sys/role/{id}/permissions
描述: 为角色分配权限
请求体:
  permissionIds: 权限ID列表
响应:
  code: 200
  message: 分配成功
```

#### 6. 获取角色权限

```yaml
接口: GET /api/v1/sys/role/{id}/permissions
描述: 获取角色的权限列表
响应:
  code: 200
  data:
    permissionIds: 权限ID列表
    permissionTree: 权限树
```

#### 7. 复制角色权限

```yaml
接口: POST /api/v1/sys/role/{id}/copy-permissions
描述: 复制其他角色的权限
请求体:
  sourceRoleId: 源角色ID
响应:
  code: 200
  message: 复制成功
```

#### 8. 配置数据权限

```yaml
接口: POST /api/v1/sys/role/{id}/data-permission
描述: 配置角色数据权限
请求体:
  dataScope: 数据范围
  deptIds: 部门ID列表（自定义范围时使用）
响应:
  code: 200
  message: 配置成功
```

#### 9. 分配用户角色

```yaml
接口: POST /api/v1/sys/role/{id}/users
描述: 为角色分配用户
请求体:
  userIds: 用户ID列表
响应:
  code: 200
  message: 分配成功
```

#### 10. 获取角色用户

```yaml
接口: GET /api/v1/sys/role/{id}/users
描述: 获取角色的用户列表
响应:
  code: 200
  data:
    list: 用户列表
    total: 总条数
```

---

## 测试用例

### 功能测试用例

| 用例编号 | 用例名称 | 前置条件 | 测试步骤 | 预期结果 | 状态 |
|---------|---------|---------|---------|---------|------|
| TC-ROLE-001 | 创建角色 | 已登录管理员 | 1. 进入角色管理<br>2. 点击新增<br>3. 填写信息<br>4. 保存 | 角色创建成功 | [√] 通过 |
| TC-ROLE-002 | 编辑角色 | 存在角色数据 | 1. 选择角色<br>2. 点击编辑<br>3. 修改信息<br>4. 保存 | 角色更新成功 | [√] 通过 |
| TC-ROLE-003 | 删除角色 | 存在角色数据 | 1. 选择角色<br>2. 点击删除<br>3. 确认删除 | 角色删除成功 | [√] 通过 |
| TC-ROLE-004 | 分配权限 | 存在角色和权限 | 1. 选择角色<br>2. 点击分配权限<br>3. 选择权限<br>4. 保存 | 权限分配成功 | [√] 通过 |
| TC-ROLE-005 | 复制权限 | 存在两个角色 | 1. 选择目标角色<br>2. 点击复制权限<br>3. 选择源角色<br>4. 确认 | 权限复制成功 | [√] 通过 |
| TC-ROLE-006 | 配置数据权限 | 存在角色 | 1. 选择角色<br>2. 点击数据权限<br>3. 选择范围<br>4. 保存 | 数据权限配置成功 | [√] 通过 |
| TC-ROLE-007 | 分配用户 | 存在角色和用户 | 1. 选择角色<br>2. 点击分配用户<br>3. 选择用户<br>4. 保存 | 用户分配成功 | [√] 通过 |
| TC-ROLE-008 | 查看权限清单 | 角色已分配权限 | 1. 选择角色<br>2. 点击查看权限 | 权限清单正确显示 | [√] 通过 |

### 数据权限测试用例

| 用例编号 | 用例名称 | 测试场景 | 预期结果 | 状态 |
|---------|---------|---------|---------|------|
| TC-DATA-001 | 全部数据范围 | 设置数据范围为全部 | 可查看所有数据 | [√] 通过 |
| TC-DATA-002 | 本部门数据范围 | 设置数据范围为本部门 | 仅可查看本部门数据 | [√] 通过 |
| TC-DATA-003 | 部门及下级范围 | 设置数据范围为部门及下级 | 可查看本部门及下级数据 | [√] 通过 |
| TC-DATA-004 | 仅本人数据范围 | 设置数据范围为仅本人 | 仅可查看本人创建的数据 | [√] 通过 |
| TC-DATA-005 | 自定义数据范围 | 设置自定义部门范围 | 仅可查看指定部门数据 | [√] 通过 |

### 性能测试用例

| 用例编号 | 用例名称 | 测试场景 | 预期结果 | 状态 |
|---------|---------|---------|---------|------|
| PERF-ROLE-001 | 角色列表查询 | 1000+角色数据 | 查询时间<200ms | [√] 通过 |
| PERF-ROLE-002 | 权限分配保存 | 分配100+权限 | 保存时间<500ms | [√] 通过 |
| PERF-ROLE-003 | 数据权限校验 | 并发100请求 | 校验时间<50ms | [√] 通过 |

---

## 开发记录

| 日期 | 工作内容 | 完成状态 | 负责人 |
|------|---------|---------|--------|
| 2026-04-13 | 角色权限关联表设计 | [√] 已完成 | 钱七 |
| 2026-04-14 | 角色权限分配API开发 | [√] 已完成 | 钱七 |
| 2026-04-15 | 角色权限复制API开发 | [√] 已完成 | 钱七 |
| 2026-04-15 | 角色权限清单查询API | [√] 已完成 | 钱七 |
| 2026-04-16 | 角色权限分配页面开发 | [√] 已完成 | 赵六 |
| 2026-04-16 | 权限树选择组件优化 | [√] 已完成 | 赵六 |
| 2026-04-17 | 角色权限复制功能 | [√] 已完成 | 赵六 |
| 2026-04-17 | 角色权限清单页面 | [√] 已完成 | 赵六 |
| 2026-04-18 | 数据权限规则表设计 | [√] 已完成 | 钱七 |
| 2026-04-18 | 数据权限规则引擎设计 | [√] 已完成 | 钱七 |
| 2026-04-19 | 数据权限配置页面开发 | [√] 已完成 | 赵六 |
| 2026-04-20 | 角色权限单元测试 | [√] 已完成 | 孙八 |
| 2026-04-20 | 角色权限集成测试 | [√] 已完成 | 孙八 |

---

## 代码片段

### 角色权限服务

```java
@Service
public class RolePermissionServiceImpl implements RolePermissionService {
    
    @Autowired
    private SysRolePermissionMapper rolePermissionMapper;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void assignPermissions(Long roleId, List<Long> permissionIds) {
        // 删除原有权限
        rolePermissionMapper.deleteByRoleId(roleId);
        
        // 添加新权限
        if (CollectionUtils.isNotEmpty(permissionIds)) {
            List<SysRolePermission> list = permissionIds.stream()
                .map(permissionId -> {
                    SysRolePermission rp = new SysRolePermission();
                    rp.setRoleId(roleId);
                    rp.setPermissionId(permissionId);
                    return rp;
                })
                .collect(Collectors.toList());
            rolePermissionMapper.batchInsert(list);
        }
        
        // 清除权限缓存
        clearPermissionCache(roleId);
    }
    
    @Override
    public void copyPermissions(Long sourceRoleId, Long targetRoleId) {
        // 获取源角色权限
        List<Long> permissionIds = rolePermissionMapper
            .selectPermissionIdsByRoleId(sourceRoleId);
        
        // 分配给目标角色
        assignPermissions(targetRoleId, permissionIds);
    }
    
    private void clearPermissionCache(Long roleId) {
        // 获取拥有该角色的所有用户
        List<Long> userIds = getUsersByRoleId(roleId);
        
        // 清除用户权限缓存
        for (Long userId : userIds) {
            redisTemplate.delete("user:permissions:" + userId);
        }
    }
}
```

### 数据权限拦截器

```java
@Intercepts({
    @Signature(type = Executor.class, method = "query", 
               args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class})
})
@Component
public class DataPermissionInterceptor implements Interceptor {
    
    @Autowired
    private DataPermissionRuleEngine ruleEngine;
    
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        Object[] args = invocation.getArgs();
        MappedStatement ms = (MappedStatement) args[0];
        Object parameter = args[1];
        
        // 检查是否需要数据权限过滤
        DataPermission annotation = getDataPermissionAnnotation(ms);
        if (annotation != null) {
            // 构建数据权限条件
            Long userId = SecurityUtils.getCurrentUserId();
            String condition = ruleEngine.buildDataScopeCondition(userId, annotation.tableAlias());
            
            // 修改SQL
            BoundSql boundSql = ms.getBoundSql(parameter);
            String originalSql = boundSql.getSql();
            String newSql = addDataScopeCondition(originalSql, condition);
            
            // 重建BoundSql
            BoundSql newBoundSql = new BoundSql(ms.getConfiguration(), newSql, 
                boundSql.getParameterMappings(), parameter);
            
            // 复制参数
            boundSql.getParameterMappings().forEach(mapping -> {
                String prop = mapping.getProperty();
                if (boundSql.hasAdditionalParameter(prop)) {
                    newBoundSql.setAdditionalParameter(prop, boundSql.getAdditionalParameter(prop));
                }
            });
            
            // 替换参数
            args[0] = rebuildMappedStatement(ms, newBoundSql);
        }
        
        return invocation.proceed();
    }
}
```

### 前端角色权限分配组件

```vue
<template>
  <el-dialog v-model="visible" title="分配权限" width="600px">
    <permission-tree
      ref="permissionTreeRef"
      v-model="selectedPermissions"
      :show-checkbox="true"
    />
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { assignRolePermissions, getRolePermissions } from '@/api/system/role';
import PermissionTree from './PermissionTree.vue';

const props = defineProps({
  modelValue: Boolean,
  roleId: Number
});

const emit = defineEmits(['update:modelValue', 'success']);

const visible = ref(false);
const permissionTreeRef = ref(null);
const selectedPermissions = ref([]);

// 加载角色权限
const loadRolePermissions = async () => {
  if (!props.roleId) return;
  const res = await getRolePermissions(props.roleId);
  selectedPermissions.value = res.data.permissionIds;
  permissionTreeRef.value?.setCheckedKeys(selectedPermissions.value);
};

// 保存权限分配
const handleSave = async () => {
  const permissionIds = permissionTreeRef.value?.getCheckedKeys();
  await assignRolePermissions(props.roleId, permissionIds);
  ElMessage.success('权限分配成功');
  visible.value = false;
  emit('success');
};

watch(() => props.modelValue, (val) => {
  visible.value = val;
  if (val) {
    loadRolePermissions();
  }
});

watch(() => visible.value, (val) => {
  emit('update:modelValue', val);
});
</script>
```

---

## 问题记录

| 问题编号 | 问题描述 | 解决方案 | 状态 |
|---------|---------|---------|------|
| ISSUE-001 | 数据权限规则复杂，SQL拼接困难 | 使用MyBatis插件拦截SQL，动态添加条件 | [√] 已解决 |
| ISSUE-002 | 权限缓存一致性问题 | 角色权限变更时清除相关用户缓存 | [√] 已解决 |
| ISSUE-003 | 数据权限影响查询性能 | 增加索引，优化规则缓存 | [√] 已解决 |

---

**文档创建:** 2026-04-13  
**最后更新:** 2026-04-20  
**负责人:** 钱七、赵六
