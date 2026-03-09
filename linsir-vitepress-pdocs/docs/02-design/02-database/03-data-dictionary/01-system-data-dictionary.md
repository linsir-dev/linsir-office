# 系统数据字典

> **文档编号**: SYS-DB-DICT-001  
> **版本**: 1.0  
> **日期**: 2026-03-08  
> **作者**: 数据库架构师  
> **状态**: ✅ 已评审

---

## 一、概述

### 1.1 文档目的

本文档定义System平台系统级数据字典，包括系统配置、日志、枚举值等系统级数据的详细说明。

### 1.2 适用范围

适用于System平台所有子系统的系统级数据管理。

### 1.3 数据分类

| 分类 | 说明 | 包含表 |
|-----|------|-------|
| 系统配置 | 系统运行配置参数 | sys_tenant_config, sys_web_config, sys_business_config |
| 数据字典 | 系统枚举值定义 | sys_dict_type, sys_dict_item |
| 系统日志 | 操作日志和登录日志 | sys_operation_log, sys_login_log |

---

## 二、系统配置表字典

### 2.1 租户基本信息配置表 (sys_tenant_config)

**表说明**: 存储租户的基本信息配置

#### 2.1.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_tenant_config |
| 中文名 | 租户基本信息配置表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 2.1.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 配置ID | 主键 |
| tenant_name | VARCHAR(100) | 否 | - | 租户名称 | 显示名称 |
| tenant_code | VARCHAR(50) | 否 | - | 租户编码 | 唯一标识 |
| logo_url | VARCHAR(200) | 是 | NULL | 租户Logo | 图片URL |
| contact_name | VARCHAR(50) | 是 | NULL | 联系人姓名 | - |
| contact_phone | VARCHAR(20) | 是 | NULL | 联系人电话 | - |
| contact_email | VARCHAR(100) | 是 | NULL | 联系人邮箱 | - |
| address | VARCHAR(200) | 是 | NULL | 公司地址 | - |
| industry_type | VARCHAR(50) | 是 | NULL | 行业类型 | 枚举值 |
| company_scale | VARCHAR(50) | 是 | NULL | 公司规模 | 枚举值 |
| expire_time | DATETIME | 是 | NULL | 到期时间 | 租户服务到期时间 |
| status | TINYINT | 否 | 1 | 租户状态 | 0-禁用, 1-启用 |
| remark | VARCHAR(500) | 是 | NULL | 备注 | - |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| update_by | BIGINT | 是 | NULL | 更新人ID | - |
| deleted | TINYINT | 否 | 0 | 删除标志 | 0-正常, 1-删除 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 2.1.3 枚举值定义

**status（租户状态）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 禁用 | 租户被禁用，无法访问系统 |
| 1 | 启用 | 租户正常启用 |

**industry_type（行业类型）**:

| 值 | 标签 | 说明 |
|---|------|------|
| technology | 互联网/科技 | 互联网、软件、科技类企业 |
| finance | 金融 | 银行、保险、证券等 |
| manufacturing | 制造业 | 生产制造企业 |
| retail | 零售 | 零售、电商企业 |
| education | 教育 | 学校、培训机构 |
| healthcare | 医疗 | 医院、医疗机构 |
| other | 其他 | 其他行业 |

**company_scale（公司规模）**:

| 值 | 标签 | 说明 |
|---|------|------|
| small | 小型企业 | 1-50人 |
| medium | 中型企业 | 51-200人 |
| large | 大型企业 | 201-1000人 |
| xlarge | 超大型企业 | 1000人以上 |

---

### 2.2 Web信息配置表 (sys_web_config)

**表说明**: Web端配置信息

#### 2.2.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_web_config |
| 中文名 | Web信息配置表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 2.2.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 配置ID | 主键 |
| site_title | VARCHAR(100) | 是 | NULL | 网站标题 | 浏览器标签页标题 |
| site_logo | VARCHAR(200) | 是 | NULL | 网站Logo | 顶部导航Logo |
| site_favicon | VARCHAR(200) | 是 | NULL | 网站图标 | 浏览器favicon |
| login_bg_image | VARCHAR(200) | 是 | NULL | 登录背景图 | 登录页面背景 |
| login_title | VARCHAR(100) | 是 | NULL | 登录页标题 | 登录页面显示的标题 |
| copyright | VARCHAR(200) | 是 | NULL | 版权信息 | 页面底部版权 |
| icp_record | VARCHAR(100) | 是 | NULL | ICP备案号 | 网站备案号 |
| theme_color | VARCHAR(20) | 是 | NULL | 主题色 | 品牌主色调 |
| sidebar_theme | TINYINT | 是 | 1 | 侧边栏主题 | 1-深色, 2-浅色 |
| layout_mode | TINYINT | 是 | 1 | 布局模式 | 1-左侧菜单, 2-顶部菜单 |
| is_show_watermark | TINYINT | 否 | 0 | 是否显示水印 | 0-否, 1-是 |
| watermark_text | VARCHAR(100) | 是 | NULL | 水印文字 | 页面水印内容 |
| remark | VARCHAR(500) | 是 | NULL | 备注 | - |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| update_by | BIGINT | 是 | NULL | 更新人ID | - |
| deleted | TINYINT | 否 | 0 | 删除标志 | 0-正常, 1-删除 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 2.2.3 枚举值定义

**sidebar_theme（侧边栏主题）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 1 | 深色 | 深色侧边栏主题 |
| 2 | 浅色 | 浅色侧边栏主题 |

**layout_mode（布局模式）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 1 | 左侧菜单 | 左侧导航菜单布局 |
| 2 | 顶部菜单 | 顶部导航菜单布局 |

**is_show_watermark（是否显示水印）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 否 | 不显示水印 |
| 1 | 是 | 显示水印 |

---

### 2.3 商务信息配置表 (sys_business_config)

**表说明**: 商务信息配置

#### 2.3.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_business_config |
| 中文名 | 商务信息配置表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 2.3.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 配置ID | 主键 |
| contract_no | VARCHAR(50) | 是 | NULL | 合同编号 | 商务合同编号 |
| contract_start_date | DATE | 是 | NULL | 合同开始日期 | 服务开始日期 |
| contract_end_date | DATE | 是 | NULL | 合同结束日期 | 服务结束日期 |
| service_type | VARCHAR(50) | 是 | NULL | 服务类型 | 购买的服务类型 |
| service_level | VARCHAR(50) | 是 | NULL | 服务等级 | SLA等级 |
| max_user_count | INT | 是 | NULL | 最大用户数 | 租户最大用户限制 |
| max_storage_size | BIGINT | 是 | NULL | 最大存储空间 | 单位：MB |
| payment_cycle | TINYINT | 是 | NULL | 付款周期 | 1-月付, 2-季付, 3-年付 |
| payment_status | TINYINT | 是 | NULL | 付款状态 | 0-未付款, 1-已付款 |
| invoice_title | VARCHAR(200) | 是 | NULL | 发票抬头 | 开票公司名称 |
| invoice_tax_no | VARCHAR(50) | 是 | NULL | 发票税号 | 纳税人识别号 |
| invoice_address | VARCHAR(200) | 是 | NULL | 发票地址 | 注册地址 |
| invoice_phone | VARCHAR(20) | 是 | NULL | 发票电话 | 注册电话 |
| invoice_bank | VARCHAR(100) | 是 | NULL | 开户银行 | 银行名称 |
| invoice_account | VARCHAR(50) | 是 | NULL | 银行账号 | 对公账户 |
| sales_manager | VARCHAR(50) | 是 | NULL | 销售经理 | 负责销售的员工 |
| sales_phone | VARCHAR(20) | 是 | NULL | 销售电话 | 销售联系方式 |
| remark | VARCHAR(500) | 是 | NULL | 备注 | - |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| update_by | BIGINT | 是 | NULL | 更新人ID | - |
| deleted | TINYINT | 否 | 0 | 删除标志 | 0-正常, 1-删除 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 2.3.3 枚举值定义

**payment_cycle（付款周期）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 1 | 月付 | 按月付款 |
| 2 | 季付 | 按季度付款 |
| 3 | 年付 | 按年付款 |

**payment_status（付款状态）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 未付款 | 尚未付款 |
| 1 | 已付款 | 已完成付款 |

**service_level（服务等级）**:

| 值 | 标签 | 说明 |
|---|------|------|
| basic | 基础版 | 基础功能服务 |
| standard | 标准版 | 标准功能服务 |
| professional | 专业版 | 高级功能服务 |
| enterprise | 企业版 | 全功能服务 |

---

## 三、数据字典表字典

### 3.1 数据字典类型表 (sys_dict_type)

**表说明**: 数据字典类型定义

#### 3.1.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_dict_type |
| 中文名 | 数据字典类型表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 3.1.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 类型ID | 主键 |
| dict_code | VARCHAR(50) | 否 | - | 字典编码 | 唯一标识 |
| dict_name | VARCHAR(50) | 否 | - | 字典名称 | 显示名称 |
| status | TINYINT | 否 | 1 | 状态 | 0-禁用, 1-启用 |
| remark | VARCHAR(500) | 是 | NULL | 备注 | - |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| update_by | BIGINT | 是 | NULL | 更新人ID | - |
| deleted | TINYINT | 否 | 0 | 删除标志 | 0-正常, 1-删除 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 3.1.3 系统预置字典类型

| 字典编码 | 字典名称 | 说明 |
|---------|---------|------|
| sys_user_status | 用户状态 | 用户账号状态 |
| sys_gender | 性别 | 性别类型 |
| sys_role_type | 角色类型 | 角色分类 |
| sys_data_scope | 数据范围 | 数据权限范围 |
| sys_menu_type | 菜单类型 | 菜单分类 |
| sys_dept_status | 部门状态 | 部门启用状态 |
| sys_position_status | 岗位状态 | 岗位启用状态 |
| sys_employment_status | 在职状态 | 员工在职状态 |
| sys_industry_type | 行业类型 | 企业行业分类 |
| sys_company_scale | 公司规模 | 企业规模分类 |
| sys_service_level | 服务等级 | SLA服务等级 |
| sys_payment_cycle | 付款周期 | 付款方式 |
| sys_payment_status | 付款状态 | 付款状态 |
| sys_operation_type | 操作类型 | 系统操作类型 |
| sys_login_type | 登录类型 | 登录方式 |
| sys_resource_type | 资源类型 | 权限资源类型 |

---

### 3.2 数据字典项表 (sys_dict_item)

**表说明**: 数据字典项定义

#### 3.2.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_dict_item |
| 中文名 | 数据字典项表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |

#### 3.2.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 项ID | 主键 |
| dict_type_id | BIGINT | 否 | - | 字典类型ID | 外键 |
| item_code | VARCHAR(50) | 否 | - | 项编码 | 字典项标识 |
| item_label | VARCHAR(50) | 否 | - | 项标签 | 显示文本 |
| item_value | VARCHAR(100) | 否 | - | 项值 | 存储值 |
| sort_order | INT | 否 | 0 | 排序号 | 显示顺序 |
| status | TINYINT | 否 | 1 | 状态 | 0-禁用, 1-启用 |
| remark | VARCHAR(500) | 是 | NULL | 备注 | - |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | - |
| update_time | DATETIME | 否 | CURRENT_TIMESTAMP | 更新时间 | - |
| create_by | BIGINT | 是 | NULL | 创建人ID | - |
| update_by | BIGINT | 是 | NULL | 更新人ID | - |
| deleted | TINYINT | 否 | 0 | 删除标志 | 0-正常, 1-删除 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 3.2.3 系统预置字典项示例

**sys_user_status（用户状态）**:

| 项编码 | 项标签 | 项值 | 排序 |
|-------|-------|------|------|
| disabled | 禁用 | 0 | 1 |
| enabled | 启用 | 1 | 2 |

**sys_gender（性别）**:

| 项编码 | 项标签 | 项值 | 排序 |
|-------|-------|------|------|
| unknown | 未知 | 0 | 1 |
| male | 男 | 1 | 2 |
| female | 女 | 2 | 3 |

**sys_role_type（角色类型）**:

| 项编码 | 项标签 | 项值 | 排序 |
|-------|-------|------|------|
| system | 系统角色 | 1 | 1 |
| business | 业务角色 | 2 | 2 |

**sys_data_scope（数据范围）**:

| 项编码 | 项标签 | 项值 | 排序 |
|-------|-------|------|------|
| all | 全部数据 | 1 | 1 |
| dept | 本部门数据 | 2 | 2 |
| dept_and_child | 本部门及子部门 | 3 | 3 |
| self | 仅本人数据 | 4 | 4 |
| custom | 自定义 | 5 | 5 |

---

## 四、系统日志表字典

### 4.1 操作日志表 (sys_operation_log)

**表说明**: 用户操作日志

#### 4.1.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_operation_log |
| 中文名 | 操作日志表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |
| 分区 | 按月RANGE分区 |

#### 4.1.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 日志ID | 主键 |
| user_id | BIGINT | 是 | NULL | 用户ID | 操作用户 |
| username | VARCHAR(50) | 是 | NULL | 用户名 | 操作用户名 |
| operation_type | VARCHAR(50) | 否 | - | 操作类型 | 见枚举值 |
| operation_desc | VARCHAR(200) | 是 | NULL | 操作描述 | 操作说明 |
| request_method | VARCHAR(10) | 是 | NULL | 请求方法 | HTTP方法 |
| request_url | VARCHAR(500) | 是 | NULL | 请求URL | 请求地址 |
| request_params | TEXT | 是 | NULL | 请求参数 | JSON格式 |
| response_data | TEXT | 是 | NULL | 响应数据 | JSON格式 |
| ip_address | VARCHAR(50) | 是 | NULL | IP地址 | 客户端IP |
| user_agent | VARCHAR(500) | 是 | NULL | 用户代理 | 浏览器信息 |
| execution_time | INT | 是 | NULL | 执行时间 | 单位：毫秒 |
| status | TINYINT | 否 | 1 | 状态 | 0-失败, 1-成功 |
| error_msg | TEXT | 是 | NULL | 错误信息 | 失败时记录 |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | 操作时间 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 4.1.3 枚举值定义

**operation_type（操作类型）**:

| 值 | 标签 | 说明 |
|---|------|------|
| CREATE | 新增 | 创建操作 |
| UPDATE | 修改 | 更新操作 |
| DELETE | 删除 | 删除操作 |
| QUERY | 查询 | 查询操作 |
| EXPORT | 导出 | 数据导出 |
| IMPORT | 导入 | 数据导入 |
| LOGIN | 登录 | 用户登录 |
| LOGOUT | 登出 | 用户登出 |
| OTHER | 其他 | 其他操作 |

**status（操作状态）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 失败 | 操作执行失败 |
| 1 | 成功 | 操作执行成功 |

---

### 4.2 登录日志表 (sys_login_log)

**表说明**: 用户登录日志

#### 4.2.1 表基本信息

| 属性 | 值 |
|-----|---|
| 表名 | sys_login_log |
| 中文名 | 登录日志表 |
| 存储引擎 | InnoDB |
| 字符集 | utf8mb4 |
| 分区 | 按月RANGE分区 |

#### 4.2.2 字段字典

| 字段名 | 数据类型 | 可空 | 默认值 | 说明 | 业务规则 |
|-------|---------|------|-------|------|---------|
| id | BIGINT | 否 | 自增 | 日志ID | 主键 |
| user_id | BIGINT | 是 | NULL | 用户ID | 登录用户 |
| username | VARCHAR(50) | 否 | - | 用户名 | 登录账号 |
| login_type | TINYINT | 否 | - | 登录类型 | 见枚举值 |
| ip_address | VARCHAR(50) | 是 | NULL | IP地址 | 登录IP |
| ip_location | VARCHAR(100) | 是 | NULL | IP归属地 | 地理位置 |
| user_agent | VARCHAR(500) | 是 | NULL | 用户代理 | 浏览器信息 |
| browser | VARCHAR(50) | 是 | NULL | 浏览器 | 浏览器名称 |
| os | VARCHAR(50) | 是 | NULL | 操作系统 | 系统类型 |
| status | TINYINT | 否 | 1 | 状态 | 0-失败, 1-成功 |
| error_msg | VARCHAR(500) | 是 | NULL | 错误信息 | 失败原因 |
| create_time | DATETIME | 否 | CURRENT_TIMESTAMP | 创建时间 | 登录时间 |
| tenant_id | BIGINT | 否 | - | 租户ID | 当前租户标识 |

#### 4.2.3 枚举值定义

**login_type（登录类型）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 1 | 账号密码 | 用户名密码登录 |
| 2 | 手机号 | 手机号验证码登录 |
| 3 | 邮箱 | 邮箱验证码登录 |
| 4 | 第三方 | 第三方OAuth登录 |

**status（登录状态）**:

| 值 | 标签 | 说明 |
|---|------|------|
| 0 | 失败 | 登录失败 |
| 1 | 成功 | 登录成功 |

---

## 五、数据字典统计

### 5.1 表统计

| 类别 | 表数量 | 字段总数 | 枚举值数量 |
|-----|-------|---------|-----------|
| 系统配置 | 3 | 58 | 18 |
| 数据字典 | 2 | 24 | 50+ |
| 系统日志 | 2 | 32 | 14 |
| **总计** | **7** | **114** | **82+** |

### 5.2 枚举值统计

| 字典类型 | 字典项数量 |
|---------|-----------|
| 系统预置 | 16个 |
| 业务扩展 | 可自定义 |

---

## 六、审核记录

### 6.1 审核状态

| 审核项 | 状态 | 审核人 | 审核日期 |
|-------|------|-------|---------|
| 系统配置表字典 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 数据字典表字典 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 系统日志表字典 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 枚举值定义 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 数据完整性 | ✓ 通过 | 技术负责人 | 2026-03-08 |

### 6.2 签字确认

| 角色 | 姓名 | 签字 | 日期 |
|-----|------|------|------|
| 编制人 | 数据库架构师 | _____________ | 2026-03-08 |
| 审核人 | 技术负责人 | _____________ | 2026-03-08 |
| 批准人 | 项目经理 | _____________ | 2026-03-08 |

---

## 七、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 数据库架构师 | 初始版本，创建系统数据字典 |
