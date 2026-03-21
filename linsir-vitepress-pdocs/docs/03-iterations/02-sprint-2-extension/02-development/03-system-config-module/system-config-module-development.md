# 系统配置模块开发文档

> **迭代编号**: sprint-2  
> **模块**: 系统配置模块  
> **状态**: ✅ 已完成

---

## 开发任务

- [√] 系统参数配置页面
- [√] 密码策略配置
- [√] 登录策略配置
- [√] 参数热加载机制
- [√] 参数导入导出
- [√] 操作日志增强

---

## 技术方案

### 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                      系统配置模块                            │
├─────────────────────────────────────────────────────────────┤
│  前端层                                                       │
│  ├── ConfigList.vue            系统参数列表                  │
│  ├── ConfigForm.vue            系统参数表单                  │
│  ├── PasswordPolicy.vue        密码策略配置                  │
│  ├── LoginPolicy.vue           登录策略配置                  │
│  └── OperationLog.vue          操作日志管理                  │
├─────────────────────────────────────────────────────────────┤
│  API层                                                        │
│  ├── ConfigController          系统参数接口                  │
│  ├── PasswordPolicyController  密码策略接口                  │
│  ├── LoginPolicyController     登录策略接口                  │
│  ├── OperationLogController    操作日志接口                  │
│  └── ConfigRefreshService      配置刷新服务                  │
├─────────────────────────────────────────────────────────────┤
│  数据层                                                       │
│  ├── sys_config                系统参数表                    │
│  ├── sys_password_policy       密码策略表                    │
│  ├── sys_login_policy          登录策略表                    │
│  └── sys_operation_log         操作日志表                    │
└─────────────────────────────────────────────────────────────┘
```

### 数据库设计

#### 系统参数表 (sys_config)

| 字段名 | 类型 | 长度 | 必填 | 说明 |
|--------|------|------|------|------|
| id | bigint | 20 | 是 | 主键ID |
| config_key | varchar | 100 | 是 | 参数键 |
| config_value | varchar | 500 | 是 | 参数值 |
| config_group | varchar | 50 | 是 | 参数分组 |
| config_type | tinyint | 1 | 是 | 类型：1-字符串 2-数字 3-布尔 4-JSON |
| description | varchar | 500 | 否 | 描述 |
| is_system | tinyint | 1 | 是 | 是否系统参数：0-否 1-是 |
| status | tinyint | 1 | 是 | 状态：0-禁用 1-启用 |
| create_time | datetime | - | 是 | 创建时间 |
| update_time | datetime | - | 是 | 更新时间 |
| create_by | bigint | 20 | 否 | 创建人 |
| update_by | bigint | 20 | 否 | 更新人 |
| deleted | tinyint | 1 | 是 | 删除标记 |

#### 密码策略表 (sys_password_policy)

| 字段名 | 类型 | 长度 | 必填 | 说明 |
|--------|------|------|------|------|
| id | bigint | 20 | 是 | 主键ID |
| min_length | int | 11 | 是 | 最小长度 |
| max_length | int | 11 | 是 | 最大长度 |
| require_uppercase | tinyint | 1 | 是 | 需要大写字母 |
| require_lowercase | tinyint | 1 | 是 | 需要小写字母 |
| require_digit | tinyint | 1 | 是 | 需要数字 |
| require_special | tinyint | 1 | 是 | 需要特殊字符 |
| special_chars | varchar | 50 | 否 | 特殊字符集 |
| expiry_days | int | 11 | 是 | 过期天数（0-永不过期） |
| history_count | int | 11 | 是 | 历史密码限制数量 |
| status | tinyint | 1 | 是 | 状态 |
| create_time | datetime | - | 是 | 创建时间 |
| update_time | datetime | - | 是 | 更新时间 |

#### 登录策略表 (sys_login_policy)

| 字段名 | 类型 | 长度 | 必填 | 说明 |
|--------|------|------|------|------|
| id | bigint | 20 | 是 | 主键ID |
| max_fail_attempts | int | 11 | 是 | 最大失败次数 |
| lock_duration | int | 11 | 是 | 锁定时间（分钟） |
| enable_ip_whitelist | tinyint | 1 | 是 | 启用IP白名单 |
| enable_ip_blacklist | tinyint | 1 | 是 | 启用IP黑名单 |
| ip_whitelist | text | - | 否 | IP白名单 |
| ip_blacklist | text | - | 否 | IP黑名单 |
| status | tinyint | 1 | 是 | 状态 |
| create_time | datetime | - | 是 | 创建时间 |
| update_time | datetime | - | 是 | 更新时间 |

### 参数热加载机制

```java
@Configuration
@EnableConfigurationProperties
public class ConfigRefreshConfig {
    
    @Bean
    public ConfigRefreshListener configRefreshListener() {
        return new ConfigRefreshListener();
    }
}

@Component
public class ConfigRefreshListener {
    
    @Autowired
    private ApplicationContext applicationContext;
    
    @Autowired
    private SysConfigMapper configMapper;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 刷新配置
     */
    @EventListener
    public void handleConfigChange(ConfigChangeEvent event) {
        String configKey = event.getConfigKey();
        String configValue = event.getConfigValue();
        
        // 更新缓存
        redisTemplate.opsForValue().set("config:" + configKey, configValue);
        
        // 刷新Spring Environment
        refreshEnvironment(configKey, configValue);
        
        // 发布刷新事件
        applicationContext.publishEvent(new EnvironmentChangeEvent(
            Collections.singleton(configKey)
        ));
    }
    
    /**
     * 获取配置值（带缓存）
     */
    public String getConfigValue(String key, String defaultValue) {
        String cacheKey = "config:" + key;
        String value = (String) redisTemplate.opsForValue().get(cacheKey);
        
        if (value == null) {
            SysConfig config = configMapper.selectByKey(key);
            if (config != null && config.getStatus() == 1) {
                value = config.getConfigValue();
                redisTemplate.opsForValue().set(cacheKey, value, 30, TimeUnit.MINUTES);
            }
        }
        
        return value != null ? value : defaultValue;
    }
}
```

### 密码策略校验器

```java
@Component
public class PasswordPolicyValidator {
    
    @Autowired
    private SysPasswordPolicyMapper passwordPolicyMapper;
    
    @Autowired
    private SysUserPasswordHistoryMapper passwordHistoryMapper;
    
    /**
     * 校验密码复杂度
     */
    public void validatePassword(String password) {
        SysPasswordPolicy policy = passwordPolicyMapper.selectActivePolicy();
        
        if (policy == null) {
            return; // 无策略，跳过校验
        }
        
        List<String> errors = new ArrayList<>();
        
        // 长度校验
        if (password.length() < policy.getMinLength()) {
            errors.add("密码长度不能少于" + policy.getMinLength() + "位");
        }
        if (password.length() > policy.getMaxLength()) {
            errors.add("密码长度不能超过" + policy.getMaxLength() + "位");
        }
        
        // 字符类型校验
        if (policy.getRequireUppercase() == 1 && !containsUppercase(password)) {
            errors.add("密码必须包含大写字母");
        }
        if (policy.getRequireLowercase() == 1 && !containsLowercase(password)) {
            errors.add("密码必须包含小写字母");
        }
        if (policy.getRequireDigit() == 1 && !containsDigit(password)) {
            errors.add("密码必须包含数字");
        }
        if (policy.getRequireSpecial() == 1 && !containsSpecial(password, policy.getSpecialChars())) {
            errors.add("密码必须包含特殊字符");
        }
        
        if (!errors.isEmpty()) {
            throw new BusinessException("密码不符合策略：" + String.join("；", errors));
        }
    }
    
    /**
     * 检查密码是否过期
     */
    public boolean isPasswordExpired(Long userId) {
        SysPasswordPolicy policy = passwordPolicyMapper.selectActivePolicy();
        
        if (policy == null || policy.getExpiryDays() == 0) {
            return false; // 无过期策略
        }
        
        SysUser user = userMapper.selectById(userId);
        if (user.getPasswordUpdateTime() == null) {
            return true; // 从未修改过密码
        }
        
        LocalDateTime expiryTime = user.getPasswordUpdateTime()
            .plusDays(policy.getExpiryDays());
        
        return LocalDateTime.now().isAfter(expiryTime);
    }
    
    /**
     * 检查历史密码
     */
    public void checkHistoryPassword(Long userId, String newPassword) {
        SysPasswordPolicy policy = passwordPolicyMapper.selectActivePolicy();
        
        if (policy == null || policy.getHistoryCount() == 0) {
            return;
        }
        
        List<String> historyPasswords = passwordHistoryMapper
            .selectRecentPasswords(userId, policy.getHistoryCount());
        
        for (String historyPassword : historyPasswords) {
            if (passwordEncoder.matches(newPassword, historyPassword)) {
                throw new BusinessException("新密码不能与最近" + 
                    policy.getHistoryCount() + "次密码相同");
            }
        }
    }
}
```

---

## 接口定义

### 系统参数接口

#### 1. 获取参数列表

```yaml
接口: GET /api/v1/sys/config/list
描述: 分页查询系统参数
参数:
  - pageNum: 页码
  - pageSize: 每页条数
  - configKey: 参数键
  - configGroup: 参数分组
响应:
  code: 200
  data:
    list: 参数列表
    total: 总条数
```

#### 2. 创建参数

```yaml
接口: POST /api/v1/sys/config
描述: 创建系统参数
请求体:
  configKey: 参数键
  configValue: 参数值
  configGroup: 参数分组
  configType: 参数类型
  description: 描述
响应:
  code: 200
  data: 创建的参数信息
```

#### 3. 更新参数

```yaml
接口: PUT /api/v1/sys/config/{id}
描述: 更新系统参数
请求体: 同创建
响应:
  code: 200
  data: 更新后的参数信息
```

#### 4. 刷新参数

```yaml
接口: POST /api/v1/sys/config/refresh
描述: 刷新参数缓存
请求体:
  configKey: 参数键（不传则刷新全部）
响应:
  code: 200
  message: 刷新成功
```

#### 5. 导出参数

```yaml
接口: GET /api/v1/sys/config/export
描述: 导出系统参数
响应:
  content-type: application/json
  body: JSON文件
```

#### 6. 导入参数

```yaml
接口: POST /api/v1/sys/config/import
描述: 导入系统参数
请求体:
  content-type: multipart/form-data
  file: JSON文件
响应:
  code: 200
  data:
    success: 成功数量
    failed: 失败数量
    errors: 错误列表
```

### 密码策略接口

#### 7. 获取密码策略

```yaml
接口: GET /api/v1/sys/password-policy
描述: 获取当前密码策略
响应:
  code: 200
  data: 密码策略信息
```

#### 8. 更新密码策略

```yaml
接口: PUT /api/v1/sys/password-policy
描述: 更新密码策略
请求体:
  minLength: 最小长度
  maxLength: 最大长度
  requireUppercase: 需要大写字母
  requireLowercase: 需要小写字母
  requireDigit: 需要数字
  requireSpecial: 需要特殊字符
  expiryDays: 过期天数
  historyCount: 历史密码限制
响应:
  code: 200
  message: 更新成功
```

### 登录策略接口

#### 9. 获取登录策略

```yaml
接口: GET /api/v1/sys/login-policy
描述: 获取当前登录策略
响应:
  code: 200
  data: 登录策略信息
```

#### 10. 更新登录策略

```yaml
接口: PUT /api/v1/sys/login-policy
描述: 更新登录策略
请求体:
  maxFailAttempts: 最大失败次数
  lockDuration: 锁定时间
  enableIpWhitelist: 启用IP白名单
  enableIpBlacklist: 启用IP黑名单
  ipWhitelist: IP白名单
  ipBlacklist: IP黑名单
响应:
  code: 200
  message: 更新成功
```

---

## 测试用例

### 系统参数测试用例

| 用例编号 | 用例名称 | 前置条件 | 测试步骤 | 预期结果 | 状态 |
|---------|---------|---------|---------|---------|------|
| TC-CONFIG-001 | 创建参数 | 已登录管理员 | 1. 进入系统参数<br>2. 点击新增<br>3. 填写信息<br>4. 保存 | 参数创建成功 | [√] 通过 |
| TC-CONFIG-002 | 修改参数 | 存在参数 | 1. 选择参数<br>2. 修改值<br>3. 保存 | 参数更新成功，热加载生效 | [√] 通过 |
| TC-CONFIG-003 | 导出参数 | 存在参数 | 1. 点击导出 | 导出JSON文件成功 | [√] 通过 |
| TC-CONFIG-004 | 导入参数 | 有参数文件 | 1. 点击导入<br>2. 选择文件 | 参数导入成功 | [√] 通过 |
| TC-CONFIG-005 | 参数热加载 | 已修改参数 | 1. 修改参数值<br>2. 验证功能 | 新值立即生效 | [√] 通过 |

### 密码策略测试用例

| 用例编号 | 用例名称 | 测试场景 | 预期结果 | 状态 |
|---------|---------|---------|---------|------|
| TC-PWD-001 | 密码长度校验 | 密码长度小于最小值 | 校验失败 | [√] 通过 |
| TC-PWD-002 | 密码复杂度校验 | 密码缺少必需字符类型 | 校验失败 | [√] 通过 |
| TC-PWD-003 | 密码过期检查 | 密码超过过期天数 | 提示密码过期 | [√] 通过 |
| TC-PWD-004 | 历史密码检查 | 使用最近使用过的密码 | 校验失败 | [√] 通过 |
| TC-PWD-005 | 密码强度检测 | 输入不同复杂度密码 | 正确显示强度等级 | [√] 通过 |

### 登录策略测试用例

| 用例编号 | 用例名称 | 测试场景 | 预期结果 | 状态 |
|---------|---------|---------|---------|------|
| TC-LOGIN-001 | 登录失败锁定 | 连续失败达到上限 | 账户锁定 | [√] 通过 |
| TC-LOGIN-002 | 自动解锁 | 锁定时间到达 | 自动解锁 | [√] 通过 |
| TC-LOGIN-003 | IP白名单 | 非白名单IP访问 | 拒绝访问 | [√] 通过 |
| TC-LOGIN-004 | IP黑名单 | 黑名单IP访问 | 拒绝访问 | [√] 通过 |

---

## 开发记录

| 日期 | 工作内容 | 完成状态 | 负责人 |
|------|---------|---------|--------|
| 2026-04-20 | 系统参数表设计 | [√] 已完成 | 钱七 |
| 2026-04-20 | 系统参数CRUD API开发 | [√] 已完成 | 钱七 |
| 2026-04-21 | 参数热加载机制实现 | [√] 已完成 | 钱七 |
| 2026-04-21 | 参数缓存管理 | [√] 已完成 | 钱七 |
| 2026-04-21 | 系统参数页面开发 | [√] 已完成 | 赵六 |
| 2026-04-22 | 参数分组展示优化 | [√] 已完成 | 赵六 |
| 2026-04-22 | 参数导入导出功能 | [√] 已完成 | 钱七 |
| 2026-04-22 | 参数导入导出页面 | [√] 已完成 | 赵六 |
| 2026-04-22 | 密码策略表设计 | [√] 已完成 | 钱七 |
| 2026-04-22 | 密码策略API开发 | [√] 已完成 | 钱七 |
| 2026-04-23 | 密码复杂度校验器 | [√] 已完成 | 钱七 |
| 2026-04-23 | 密码过期检查机制 | [√] 已完成 | 钱七 |
| 2026-04-23 | 密码策略页面开发 | [√] 已完成 | 赵六 |
| 2026-04-23 | 密码强度检测组件 | [√] 已完成 | 赵六 |
| 2026-04-24 | 登录策略表设计 | [√] 已完成 | 钱七 |
| 2026-04-24 | 登录策略API开发 | [√] 已完成 | 钱七 |
| 2026-04-24 | 登录失败锁定机制 | [√] 已完成 | 钱七 |
| 2026-04-24 | 登录策略页面开发 | [√] 已完成 | 赵六 |
| 2026-04-24 | 系统参数单元测试 | [√] 已完成 | 孙八 |
| 2026-04-24 | 密码策略单元测试 | [√] 已完成 | 孙八 |

---

## 代码片段

### 登录失败锁定服务

```java
@Service
public class LoginLockService {
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    @Autowired
    private SysLoginPolicyMapper loginPolicyMapper;
    
    private static final String LOGIN_FAIL_KEY = "login:fail:";
    private static final String LOGIN_LOCK_KEY = "login:lock:";
    
    /**
     * 记录登录失败
     */
    public void recordLoginFail(String username, String ip) {
        SysLoginPolicy policy = loginPolicyMapper.selectActivePolicy();
        if (policy == null || policy.getMaxFailAttempts() == 0) {
            return;
        }
        
        String failKey = LOGIN_FAIL_KEY + username;
        String lockKey = LOGIN_LOCK_KEY + username;
        
        // 增加失败次数
        Long failCount = redisTemplate.opsForValue().increment(failKey);
        redisTemplate.expire(failKey, 30, TimeUnit.MINUTES);
        
        // 检查是否达到锁定阈值
        if (failCount >= policy.getMaxFailAttempts()) {
            // 锁定账户
            redisTemplate.opsForValue().set(lockKey, "1", 
                policy.getLockDuration(), TimeUnit.MINUTES);
            
            // 发送锁定通知
            sendLockNotification(username, ip);
        }
    }
    
    /**
     * 检查账户是否被锁定
     */
    public boolean isLocked(String username) {
        String lockKey = LOGIN_LOCK_KEY + username;
        return Boolean.TRUE.equals(redisTemplate.hasKey(lockKey));
    }
    
    /**
     * 清除登录失败记录
     */
    public void clearLoginFail(String username) {
        String failKey = LOGIN_FAIL_KEY + username;
        redisTemplate.delete(failKey);
    }
    
    /**
     * 手动解锁
     */
    public void unlock(String username) {
        String lockKey = LOGIN_LOCK_KEY + username;
        String failKey = LOGIN_FAIL_KEY + username;
        redisTemplate.delete(lockKey);
        redisTemplate.delete(failKey);
    }
}
```

### 前端密码强度检测组件

```vue
<template>
  <div class="password-strength">
    <el-input
      v-model="password"
      type="password"
      placeholder="请输入密码"
      @input="checkStrength"
    />
    <div class="strength-bar">
      <div
        class="strength-item"
        :class="getStrengthClass(index)"
        v-for="index in 4"
        :key="index"
      />
    </div>
    <div class="strength-text">{{ strengthText }}</div>
    <ul class="requirement-list">
      <li :class="{ met: hasMinLength }">至少{{ policy.minLength }}位字符</li>
      <li :class="{ met: hasUppercase }">包含大写字母</li>
      <li :class="{ met: hasLowercase }">包含小写字母</li>
      <li :class="{ met: hasDigit }">包含数字</li>
      <li :class="{ met: hasSpecial }">包含特殊字符</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  policy: Object
});

const password = ref('');
const strength = ref(0);

const hasMinLength = computed(() => password.value.length >= props.policy.minLength);
const hasUppercase = computed(() => /[A-Z]/.test(password.value));
const hasLowercase = computed(() => /[a-z]/.test(password.value));
const hasDigit = computed(() => /\d/.test(password.value));
const hasSpecial = computed(() => new RegExp(`[${props.policy.specialChars}]`).test(password.value));

const strengthText = computed(() => {
  const texts = ['太短', '弱', '中', '强', '非常强'];
  return texts[strength.value] || '';
});

const checkStrength = () => {
  let score = 0;
  if (hasMinLength.value) score++;
  if (hasUppercase.value && hasLowercase.value) score++;
  if (hasDigit.value) score++;
  if (hasSpecial.value) score++;
  strength.value = score;
};

const getStrengthClass = (index) => {
  if (index <= strength.value) {
    const classes = ['weak', 'fair', 'good', 'strong'];
    return classes[strength.value - 1];
  }
  return '';
};
</script>

<style scoped>
.strength-bar {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}
.strength-item {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
}
.strength-item.weak { background: #ff4d4f; }
.strength-item.fair { background: #faad14; }
.strength-item.good { background: #52c41a; }
.strength-item.strong { background: #1890ff; }
.requirement-list li { color: #999; }
.requirement-list li.met { color: #52c41a; }
</style>
```

---

## 问题记录

| 问题编号 | 问题描述 | 解决方案 | 状态 |
|---------|---------|---------|------|
| ISSUE-001 | 参数热加载与Spring配置冲突 | 使用@RefreshScope注解，配合配置中心 | [√] 已解决 |
| ISSUE-002 | 密码策略实时生效问题 | 策略变更时清除校验器缓存 | [√] 已解决 |
| ISSUE-003 | 登录锁定分布式一致性问题 | 使用Redis分布式锁，统一锁定状态 | [√] 已解决 |

---

**文档创建:** 2026-04-20  
**最后更新:** 2026-04-24  
**负责人:** 钱七、赵六
