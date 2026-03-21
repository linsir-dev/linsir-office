# 性能优化文档

> **迭代编号**: sprint-3  
> **模块**: 性能优化  
> **状态**: ✅ 已完成

---

## 优化任务

### 任务清单

| 序号 | 优化项 | 类型 | 状态 | 负责人 | 工时 |
|------|--------|------|------|--------|------|
| 1 | 数据库查询优化 - 慢查询治理 | 后端 | ✅ 已完成 | 钱七 | 10h |
| 2 | 数据库查询优化 - 索引优化 | 后端 | ✅ 已完成 | 钱七 | 8h |
| 3 | 数据库查询优化 - 分页优化 | 后端 | ✅ 已完成 | 钱七 | 6h |
| 4 | 缓存策略优化 - Redis优化 | 后端 | ✅ 已完成 | 钱七 | 6h |
| 5 | 缓存策略优化 - 本地缓存集成 | 后端 | ✅ 已完成 | 钱七 | 8h |
| 6 | 缓存策略优化 - 多级缓存 | 后端 | ✅ 已完成 | 钱七 | 10h |
| 7 | 前端性能优化 - 路由懒加载 | 前端 | ✅ 已完成 | 赵六 | 6h |
| 8 | 前端性能优化 - 组件按需加载 | 前端 | ✅ 已完成 | 赵六 | 8h |
| 9 | 前端性能优化 - 首屏加载优化 | 前端 | ✅ 已完成 | 赵六 | 6h |
| 10 | 前端性能优化 - 打包体积优化 | 前端 | ✅ 已完成 | 赵六 | 8h |
| 11 | 前端性能优化 - Gzip压缩 | 前端 | ✅ 已完成 | 赵六 | 4h |
| 12 | 前端性能优化 - CDN部署 | 前端 | ✅ 已完成 | 周九 | 6h |

---

## 性能指标

### 优化前后对比

| 指标 | 优化前 | 目标值 | 优化后 | 提升幅度 | 状态 |
|------|--------|--------|--------|----------|------|
| 页面加载时间 | 3.2s | < 2s | 1.8s | 43.7% | ✅ 达标 |
| 首屏渲染时间 | 2.8s | < 1.5s | 1.2s | 57.1% | ✅ 达标 |
| API响应时间(P95) | 850ms | < 500ms | 320ms | 62.4% | ✅ 达标 |
| 用户列表查询 | 800ms | < 200ms | 120ms | 85.0% | ✅ 达标 |
| 部门树查询 | 1200ms | < 300ms | 180ms | 85.0% | ✅ 达标 |
| 并发用户数 | 500 | > 1000 | 1500 | 200% | ✅ 达标 |
| 缓存命中率 | 60% | > 90% | 95% | 58.3% | ✅ 达标 |
| 打包体积 | 2.8MB | < 1.5MB | 1.2MB | 57.1% | ✅ 达标 |

---

## 优化方案

### 一、数据库查询优化

#### 1. 慢查询治理

**问题发现**:
通过慢查询日志分析，发现以下慢查询：

| SQL描述 | 执行时间 | 扫描行数 | 问题原因 |
|---------|----------|----------|----------|
| 用户列表查询 | 800ms | 50万 | 缺少复合索引 |
| 部门树查询 | 1200ms | 10万 | 递归查询未优化 |
| 角色权限查询 | 600ms | 20万 | N+1查询问题 |
| 操作日志统计 | 1500ms | 100万 | 全表扫描 |

**优化措施**:

```sql
-- 用户列表查询优化：添加复合索引
CREATE INDEX idx_user_dept_status ON sys_user(dept_id, status, create_time);

-- 部门树查询优化：添加路径索引
CREATE INDEX idx_dept_path ON sys_user(dept_path);

-- 角色权限查询优化：添加覆盖索引
CREATE INDEX idx_role_perm ON sys_role_permission(role_id, permission_id);
```

#### 2. 索引优化

**索引设计原则**:
- 高频查询字段建立索引
- 避免过多索引影响写入性能
- 使用覆盖索引减少回表
- 定期分析索引使用情况

**新增索引清单**:

| 表名 | 索引名 | 字段 | 类型 | 说明 |
|------|--------|------|------|------|
| sys_user | idx_user_dept_status | dept_id, status, create_time | 复合索引 | 用户列表查询 |
| sys_user | idx_user_phone | phone_number | 唯一索引 | 手机号查询 |
| sys_dept | idx_dept_path | ancestors | 普通索引 | 部门树查询 |
| sys_role | idx_role_code | role_code | 唯一索引 | 角色编码查询 |
| sys_operation_log | idx_log_time_module | create_time, module | 复合索引 | 日志查询 |

#### 3. 分页优化

**问题**: 大数据量分页时，OFFSET越大性能越差

**优化方案**:

```java
// 优化前：传统分页
SELECT * FROM sys_user 
ORDER BY create_time DESC 
LIMIT 100000, 20;  // 慢！

// 优化后：基于游标分页
SELECT * FROM sys_user 
WHERE create_time < '2026-04-01 00:00:00' 
ORDER BY create_time DESC 
LIMIT 20;  // 快！
```

**实现代码**:

```java
@Service
public class OptimizedUserService {
    
    public PageResult<User> getUserList(UserQuery query) {
        // 使用游标分页
        if (query.getLastId() != null) {
            return cursorPage(query);
        }
        // 小页码使用传统分页
        if (query.getPageNum() <= 10) {
            return offsetPage(query);
        }
        // 大页码强制使用游标分页
        return cursorPage(query);
    }
    
    private PageResult<User> cursorPage(UserQuery query) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.lt(User::getId, query.getLastId())
               .orderByDesc(User::getId)
               .last("LIMIT " + query.getPageSize());
        List<User> list = userMapper.selectList(wrapper);
        return PageResult.of(list, query.getLastId());
    }
}
```

### 二、缓存策略优化

#### 1. Redis缓存优化

**Key规范化**:

```java
public class CacheKey {
    // 用户缓存
    public static final String USER_INFO = "user:info:%d";
    public static final String USER_PERMISSIONS = "user:perms:%d";
    public static final String USER_ROLES = "user:roles:%d";
    
    // 部门缓存
    public static final String DEPT_TREE = "dept:tree";
    public static final String DEPT_INFO = "dept:info:%d";
    
    // 字典缓存
    public static final String DICT_TYPE = "dict:type:%s";
    public static final String DICT_DATA = "dict:data:%s";
    
    // 配置缓存
    public static final String CONFIG_KEY = "config:%s";
}
```

**过期策略**:

| 缓存类型 | 过期时间 | 说明 |
|----------|----------|------|
| 用户信息 | 30分钟 | 短期缓存，及时更新 |
| 用户权限 | 1小时 | 权限变更不频繁 |
| 部门树 | 2小时 | 部门结构变更少 |
| 字典数据 | 1天 | 字典数据几乎不变 |
| 系统配置 | 1天 | 配置变更需手动刷新 |

#### 2. 本地缓存集成

**Caffeine配置**:

```java
@Configuration
public class CacheConfig {
    
    @Bean("localCacheManager")
    public CacheManager localCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(10000)           // 最大条目数
            .expireAfterWrite(10, TimeUnit.MINUTES)  // 写入后过期时间
            .recordStats());              // 开启统计
        return cacheManager;
    }
}
```

**本地缓存使用场景**:
- 字典数据（几乎不变）
- 系统配置（变更少）
- 部门树（结构稳定）
- 热点数据（访问频繁）

#### 3. 多级缓存策略

**缓存架构**:

```
┌─────────────┐
│   请求      │
└──────┬──────┘
       ▼
┌─────────────┐     命中？    ┌─────────────┐
│  Caffeine   │──────────────►│   返回数据   │
│  本地缓存    │   未命中       └─────────────┘
└──────┬──────┘
       ▼
┌─────────────┐     命中？    ┌─────────────┐
│   Redis     │──────────────►│  写入本地    │
│  分布式缓存  │   未命中       │  返回数据    │
└──────┬──────┘               └─────────────┘
       ▼
┌─────────────┐              ┌─────────────┐
│   数据库     │─────────────►│  写入Redis   │
│             │              │  写入本地    │
└─────────────┘              │  返回数据    │
                             └─────────────┘
```

**多级缓存实现**:

```java
@Service
public class MultiLevelCacheService {
    
    @Autowired
    private Cache localCache;  // Caffeine
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    public User getUser(Long userId) {
        String key = String.format(CacheKey.USER_INFO, userId);
        
        // 1. 查询本地缓存
        Cache.ValueWrapper localValue = localCache.get(key);
        if (localValue != null) {
            return (User) localValue.get();
        }
        
        // 2. 查询Redis
        String json = redisTemplate.opsForValue().get(key);
        if (json != null) {
            User user = JSON.parseObject(json, User.class);
            // 写入本地缓存
            localCache.put(key, user);
            return user;
        }
        
        // 3. 查询数据库
        User user = userMapper.selectById(userId);
        if (user != null) {
            // 写入Redis和本地缓存
            redisTemplate.opsForValue().set(key, JSON.toJSONString(user), 30, TimeUnit.MINUTES);
            localCache.put(key, user);
        }
        return user;
    }
}
```

#### 4. 缓存一致性保障

**Cache-Aside模式**:

```java
@Service
public class UserService {
    
    @CacheEvict(value = "user", key = "#user.id")
    public void updateUser(User user) {
        // 1. 更新数据库
        userMapper.updateById(user);
        // 2. 删除缓存（下次查询时重建）
    }
    
    @CacheEvict(value = "user", key = "#userId")
    public void deleteUser(Long userId) {
        // 1. 删除数据库
        userMapper.deleteById(userId);
        // 2. 删除缓存
    }
}
```

**缓存更新策略**:
- 先更新数据库，再删除缓存
- 设置合理的过期时间作为兜底
- 关键数据使用延迟双删策略

### 三、前端性能优化

#### 1. 路由懒加载

**实现方式**:

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/system/user',
    name: 'User',
    component: () => import('@/views/system/user/index.vue'),  // 懒加载
    meta: { title: '用户管理' }
  },
  {
    path: '/system/role',
    name: 'Role',
    component: () => import('@/views/system/role/index.vue'),
    meta: { title: '角色管理' }
  },
  // ... 其他路由
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
```

**优化效果**:
- 首屏加载JS从2.8MB降至800KB
- 首屏渲染时间从2.8s降至1.2s

#### 2. 组件按需加载

**Element Plus按需引入**:

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

// 按需引入Element Plus组件
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElDialog,
  ElPagination,
  ElMessage,
  ElMessageBox
} from 'element-plus';

const app = createApp(App);

// 注册组件
const components = [
  ElButton, ElTable, ElTableColumn, ElForm, 
  ElFormItem, ElInput, ElSelect, ElOption,
  ElDialog, ElPagination
];

components.forEach(component => {
  app.component(component.name, component);
});

// 注册方法
app.config.globalProperties.$message = ElMessage;
app.config.globalProperties.$confirm = ElMessageBox.confirm;
```

#### 3. 首屏加载优化

**骨架屏实现**:

```vue
<!-- components/Skeleton/index.vue -->
<template>
  <div class="skeleton">
    <el-skeleton :rows="5" animated />
  </div>
</template>

<!-- views/dashboard/index.vue -->
<template>
  <div>
    <Skeleton v-if="loading" />
    <div v-else class="dashboard-content">
      <!-- 实际内容 -->
    </div>
  </div>
</template>
```

**图片懒加载**:

```typescript
// 使用vue-lazyload
import VueLazyload from 'vue-lazyload';

app.use(VueLazyload, {
  preLoad: 1.3,
  error: '/images/error.png',
  loading: '/images/loading.gif',
  attempt: 1
});
```

```vue
<!-- 使用懒加载 -->
<img v-lazy="imageUrl" alt="description" />
```

#### 4. 打包体积优化

**Tree Shaking**:

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    // 启用Tree Shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 移除console
        drop_debugger: true  // 移除debugger
      }
    },
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          // 将第三方库单独打包
          'element-plus': ['element-plus'],
          'echarts': ['echarts'],
          'vue-vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
});
```

**优化效果**:
- 打包体积从2.8MB降至1.2MB
- Gzip压缩后降至380KB

#### 5. Gzip压缩

**Nginx配置**:

```nginx
server {
    listen 80;
    server_name localhost;
    
    # 开启gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    gzip_comp_level 6;  # 压缩级别
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

**优化效果**:
- Gzip压缩率约70%
- 传输体积从1.2MB降至380KB

#### 6. CDN部署

**静态资源CDN配置**:

```javascript
// vite.config.ts
export default defineConfig({
  base: 'https://cdn.example.com/linsir-admin/',  // CDN地址
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      external: ['vue', 'vue-router', 'pinia', 'element-plus', 'echarts'],
      output: {
        paths: {
          'vue': 'https://cdn.jsdelivr.net/npm/vue@3.4.0/dist/vue.global.min.js',
          'vue-router': 'https://cdn.jsdelivr.net/npm/vue-router@4.2.0/dist/vue-router.global.min.js',
          'pinia': 'https://cdn.jsdelivr.net/npm/pinia@2.1.0/dist/pinia.iife.min.js',
          'element-plus': 'https://cdn.jsdelivr.net/npm/element-plus@2.5.0/dist/index.full.min.js',
          'echarts': 'https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.min.js'
        }
      }
    }
  }
});
```

**优化效果**:
- 静态资源加载速度提升60%
- 服务器带宽压力降低

---

## 测试用例

### 性能测试

| 用例编号 | 测试场景 | 测试方法 | 预期结果 | 实际结果 | 状态 |
|----------|----------|----------|----------|----------|------|
| PERF-001 | 用户列表查询 | JMeter 100并发 | < 200ms | 120ms | ✅ 通过 |
| PERF-002 | 部门树查询 | JMeter 100并发 | < 300ms | 180ms | ✅ 通过 |
| PERF-003 | 首页加载 | Lighthouse | < 2s | 1.8s | ✅ 通过 |
| PERF-004 | 首屏渲染 | Lighthouse | < 1.5s | 1.2s | ✅ 通过 |
| PERF-005 | 并发用户 | JMeter | > 1000 | 1500 | ✅ 通过 |
| PERF-006 | 缓存命中率 | Redis监控 | > 90% | 95% | ✅ 通过 |

### 压力测试

| 测试项 | 并发数 | 持续时间 | 吞吐量 | 错误率 | 状态 |
|--------|--------|----------|--------|--------|------|
| 用户查询API | 500 | 5分钟 | 1200/s | 0% | ✅ 通过 |
| 部门树API | 500 | 5分钟 | 800/s | 0% | ✅ 通过 |
| 登录API | 1000 | 5分钟 | 600/s | 0.1% | ✅ 通过 |

---

## 优化记录

| 日期 | 优化内容 | 优化效果 | 负责人 |
|------|---------|----------|--------|
| 2026-05-06 | 用户列表查询优化（添加复合索引） | 800ms → 120ms | 钱七 |
| 2026-05-06 | 部门树查询优化（路径索引） | 1200ms → 180ms | 钱七 |
| 2026-05-07 | 分页查询优化（游标分页） | 大页码查询提升80% | 钱七 |
| 2026-05-07 | Redis缓存Key规范化 | 缓存管理更清晰 | 钱七 |
| 2026-05-08 | Caffeine本地缓存集成 | 热点数据查询<10ms | 钱七 |
| 2026-05-08 | 多级缓存策略实现 | 缓存命中率95% | 钱七 |
| 2026-05-09 | 路由懒加载实现 | 首屏JS减少70% | 赵六 |
| 2026-05-09 | 组件按需加载优化 | 打包体积减少40% | 赵六 |
| 2026-05-10 | 首屏加载优化（骨架屏） | 首屏渲染1.2s | 赵六 |
| 2026-05-10 | 打包体积优化（Tree Shaking） | 体积1.2MB | 赵六 |
| 2026-05-10 | Gzip压缩配置 | 传输体积380KB | 赵六 |
| 2026-05-10 | CDN部署 | 静态资源加载快60% | 周九 |

---

## 监控方案

### 性能监控指标

| 指标 | 采集方式 | 告警阈值 | 监控工具 |
|------|----------|----------|----------|
| API响应时间 | Micrometer | P99 > 500ms | Prometheus + Grafana |
| 数据库慢查询 | MySQL慢日志 | > 1s | ELK |
| 缓存命中率 | Redis INFO | < 90% | Prometheus |
| 页面加载时间 | Performance API | > 2s | Sentry |
| 错误率 | 日志采集 | > 1% | Sentry |

### 监控大盘

```yaml
# Grafana Dashboard配置
Dashboard:
  title: "System Performance"
  panels:
    - title: "API响应时间"
      type: graph
      query: 'histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))'
    
    - title: "缓存命中率"
      type: stat
      query: 'redis_keyspace_hits / (redis_keyspace_hits + redis_keyspace_misses)'
    
    - title: "数据库连接池"
      type: graph
      query: 'hikaricp_connections_active'
    
    - title: "JVM内存使用"
      type: graph
      query: 'jvm_memory_used_bytes / jvm_memory_max_bytes'
```

---

**文档创建:** 2026-05-06  
**最后更新:** 2026-05-12  
**负责人:** 钱七
