# 数据库设计检查清单

> **阶段编号**: 3-02  
> **阶段名称**: 数据库设计  
> **阶段目标**: 完成数据库逻辑设计、物理设计，建立数据字典，输出完整的数据库设计方案  
> **阶段状态**: ✅ 已完成

---

## 一、阶段概述

### 1.1 阶段目标

完成数据库逻辑模型设计、物理模型设计、索引设计、分区设计，建立完整的数据字典，为后续开发提供数据库基础。

### 1.2 阶段范围

- 逻辑数据模型设计（ER图）
- 物理数据模型设计（表结构）
- 数据库索引设计
- 数据库分区设计
- 数据库备份策略
- 数据字典建立
- SQL脚本编写

### 1.3 输入文档

- 架构设计文档（逻辑架构、数据架构）
- 领域模型设计
- 业务需求文档（BRD）
- 架构基线文档

### 1.4 输出文档

- 数据库设计文档（6个）
- 数据字典文档（3个）
- SQL脚本
- 数据库评审文档（5个）

---

## 二、规范章节

### 2.1 数据库设计规范文件清单

数据库设计阶段需要创建的规范文件：

| 序号 | 规范文件 | 文件路径 | 状态 |
|-----|---------|---------|------|
| 1 | 数据库命名规范 | `01-database-design-standard/01-database-naming-convention.md` | ✅ 已完成 |
| 2 | SQL编码规范 | `01-database-design-standard/02-sql-coding-standard.md` | ✅ 已完成 |
| 3 | 数据库评审规范 | `01-database-design-standard/03-database-review-standard.md` | ✅ 已完成 |
| 4 | 数据字典规范 | `01-database-design-standard/04-data-dictionary-standard.md` | ✅ 已完成 |

### 2.2 规范文件说明

#### 2.2.1 数据库命名规范

**内容要求**:
- 数据库命名规则
- 表命名规则
- 字段命名规则
- 索引命名规则
- 约束命名规则
- 视图命名规则

#### 2.2.2 SQL编码规范

**内容要求**:
- SQL语句编写规范
- 注释规范
- 缩进和格式规范
- 性能优化建议
- 安全编码要求

#### 2.2.3 数据库评审规范

**内容要求**:
- 评审检查项清单
- 评审流程说明
- 评审标准定义
- 问题分级标准

#### 2.2.4 数据字典规范

**内容要求**:
- 数据字典格式规范
- 字段描述规范
- 枚举值定义规范
- 数据字典维护流程

---

## 三、任务清单

### 1. 数据库设计

**目标**: 完成数据库逻辑设计和物理设计  
**状态**: ✅ 已完成

#### 1.1 逻辑数据模型

- [√] ER图设计
  - 实体识别与定义
  - 实体关系定义（1:1, 1:N, M:N）
  - 业务规则映射
  - 输出: `02-database-design/01-logical-data-model.md`

- [√] 数据实体清单
  - 实体名称、描述、属性
  - 实体关系说明
  - 输出: `02-database-design/01-logical-data-model.md`

#### 1.2 物理数据模型

- [√] 表结构设计
  - 表名、字段名、数据类型
  - 字段长度、精度、默认值
  - 是否为空、注释
  - 输出: `02-database-design/02-physical-data-model.md`

- [√] 约束设计
  - 主键约束（Primary Key）
  - 外键约束（Foreign Key）
  - 唯一约束（Unique）
  - 检查约束（Check）
  - 输出: `02-database-design/02-physical-data-model.md`

- [√] 评审记录
  - 数据库设计评审记录
  - 输出: `02-database-design/06-database-design-review-record.md`

#### 1.3 索引设计

- [√] 主键索引
  - 每个表必须有主键
  - 主键选择策略（自增ID、UUID、业务主键）
  - 输出: `02-database-design/03-database-index-design.md`

- [√] 外键索引
  - 外键字段自动创建索引
  - 关联查询优化
  - 输出: `02-database-design/03-database-index-design.md`

- [√] 业务索引
  - 查询条件字段索引
  - 联合索引设计
  - 覆盖索引设计
  - 输出: `02-database-design/03-database-index-design.md`

#### 1.4 分区设计

- [√] 分区策略
  - 范围分区（Range）
  - 列表分区（List）
  - 哈希分区（Hash）
  - 输出: `02-database-design/04-database-partition-design.md`

- [√] 分区键选择
  - 时间字段分区
  - 业务字段分区
  - 输出: `02-database-design/04-database-partition-design.md`

#### 1.5 备份策略

- [√] 备份方案
  - 全量备份策略
  - 增量备份策略
  - 备份保留周期
  - 输出: `02-database-design/05-database-backup-strategy.md`

- [√] 恢复策略
  - 恢复时间目标（RTO）
  - 恢复点目标（RPO）
  - 恢复演练计划
  - 输出: `02-database-design/05-database-backup-strategy.md`

---

### 2. 数据字典

**目标**: 建立完整的数据字典  
**状态**: ✅ 已完成

#### 2.1 系统数据字典

- [√] 系统配置表字典
  - 配置项名称、类型、说明
  - 配置项取值范围
  - 输出: `03-data-dictionary/01-system-data-dictionary.md`

- [√] 系统日志表字典
  - 日志类型、字段说明
  - 日志保留策略
  - 输出: `03-data-dictionary/01-system-data-dictionary.md`

#### 2.2 业务数据字典

- [√] 用户相关表字典
  - 用户表、角色表、权限表
  - 部门表、岗位表
  - 输出: `03-data-dictionary/02-business-data-dictionary.md`

- [√] 业务数据表字典
  - 业务实体表字段说明
  - 枚举值定义
  - 业务规则说明
  - 输出: `03-data-dictionary/02-business-data-dictionary.md`

- [√] 评审记录
  - 数据字典评审记录
  - 输出: `03-data-dictionary/03-data-dictionary-review-record.md`

---

### 3. SQL脚本

**目标**: 编写完整的SQL脚本  
**状态**: ✅ 已完成

#### 3.1 DDL脚本

- [√] 数据库创建脚本
  - 创建数据库
  - 设置字符集、排序规则
  - 输出: `04-sql-scripts/01-ddl-scripts/01-create-database.sql`

- [√] 表创建脚本
  - 创建所有表结构
  - 设置字段属性、约束
  - 输出: `04-sql-scripts/01-ddl-scripts/02-create-tables.sql`

- [√] 索引创建脚本
  - 创建主键索引
  - 创建外键索引
  - 创建业务索引
  - 输出: `04-sql-scripts/01-ddl-scripts/03-create-indexes.sql`

- [√] 约束创建脚本
  - 创建外键约束
  - 创建唯一约束
  - 创建检查约束
  - 输出: `04-sql-scripts/01-ddl-scripts/04-create-constraints.sql`

- [√] 视图创建脚本
  - 创建业务视图
  - 创建统计视图
  - 输出: `04-sql-scripts/01-ddl-scripts/05-create-views.sql`

#### 3.2 DML脚本

- [√] 系统初始数据
  - 系统配置数据
  - 字典数据
  - 输出: `04-sql-scripts/02-dml-scripts/01-init-data.sql`

- [√] 业务初始数据
  - 基础业务数据
  - 测试数据（可选）
  - 输出: `04-sql-scripts/02-dml-scripts/01-init-data.sql`

#### 3.3 DCL脚本

- [√] 权限配置脚本
  - 创建数据库用户
  - 分配表权限
  - 输出: `04-sql-scripts/03-dcl-scripts/01-grant-permissions.sql`

#### 3.4 迁移脚本

- [√] 版本迁移脚本
  - 数据库版本管理
  - 迁移脚本规范
  - 输出: `04-sql-scripts/04-migration-scripts/README.md`

#### 3.5 SQL脚本审核记录

- [√] SQL脚本审核
  - 审核DDL/DML/DCL脚本
  - 生成审核记录
  - 输出: `04-sql-scripts/sql-scripts-review-record.md`

---

### 4. 数据库评审

**目标**: 完成数据库设计评审，建立数据库基线  
**状态**: ✅ 已完成

#### 4.1 评审准备

- [√] 评审通知
  - 评审会议通知
  - 评审材料准备
  - 输出: `05-database-review/01-database-review-notice.md`

- [√] 评审议程
  - 评审会议议程
  - 评审检查项
  - 输出: `05-database-review/02-database-review-agenda.md`

#### 4.2 评审执行

- [√] 评审报告
  - 评审内容记录
  - 问题清单
  - 评审结论: 通过
  - 输出: `05-database-review/03-database-review-report.md`

- [√] 评审记录
  - 会议记录
  - 决议记录
  - 输出: `05-database-review/04-database-review-record.md`

#### 4.3 基线建立

- [√] 数据库基线
  - 基线文档
  - 基线确认签字
  - 基线版本: V1.0.0
  - 输出: `05-database-review/05-database-baseline.md`

---

## 四、输出文档清单

### 数据库设计文档（SYS-DB-DES）

| 序号 | 文档名称 | 文档编号 | 状态 | 位置 |
|-----|---------|---------|------|------|
| 1 | 逻辑数据模型 | SYS-DB-DES-001 | ✅ 已完成 | `02-database-design/01-logical-data-model.md` |
| 2 | 物理数据模型 | SYS-DB-DES-002 | ✅ 已评审 | `02-database-design/02-physical-data-model.md` |
| 3 | 数据库索引设计 | SYS-DB-DES-003 | ✅ 已完成 | `02-database-design/03-database-index-design.md` |
| 4 | 数据库分区设计 | SYS-DB-DES-004 | ✅ 已完成 | `02-database-design/04-database-partition-design.md` |
| 5 | 数据库备份策略 | SYS-DB-DES-005 | ✅ 已完成 | `02-database-design/05-database-backup-strategy.md` |
| 6 | 数据库设计评审记录 | SYS-DB-DES-006 | ✅ 已完成 | `02-database-design/06-database-design-review-record.md` |

### 数据字典文档（SYS-DB-DICT）

| 序号 | 文档名称 | 文档编号 | 状态 | 位置 |
|-----|---------|---------|------|------|
| 1 | 系统数据字典 | SYS-DB-DICT-001 | ✅ 已评审 | `03-data-dictionary/01-system-data-dictionary.md` |
| 2 | 业务数据字典 | SYS-DB-DICT-002 | ✅ 已评审 | `03-data-dictionary/02-business-data-dictionary.md` |
| 3 | 数据字典评审记录 | SYS-DB-DICT-003 | ✅ 已完成 | `03-data-dictionary/03-data-dictionary-review-record.md` |

### 数据库评审文档（SYS-DB-REV）

| 序号 | 文档名称 | 文档编号 | 状态 | 位置 |
|-----|---------|---------|------|------|
| 1 | 数据库评审通知 | SYS-DB-REV-001 | ✅ 已完成 | `05-database-review/01-database-review-notice.md` |
| 2 | 评审会议议程 | SYS-DB-REV-002 | ✅ 已完成 | `05-database-review/02-database-review-agenda.md` |
| 3 | 数据库评审报告 | SYS-DB-REV-003 | ✅ 已完成 | `05-database-review/03-database-review-report.md` |
| 4 | 评审会议记录 | SYS-DB-REV-004 | ✅ 已完成 | `05-database-review/04-database-review-record.md` |
| 5 | 数据库基线 | SYS-DB-REV-005 | ✅ 已完成 | `05-database-review/05-database-baseline.md` |

---

## 五、数据库设计标准

### 5.1 命名规范

| 对象类型 | 命名规则 | 示例 |
|---------|---------|------|
| 数据库 | db_系统名 | db_system |
| 表 | t_模块名_表名 | t_sys_user |
| 视图 | v_视图名 | v_user_role |
| 索引 | idx_表名_字段名 | idx_user_name |
| 主键 | pk_表名 | pk_user |
| 外键 | fk_表名_字段名 | fk_user_dept |
| 字段 | 小写+下划线 | user_name |

### 5.2 字段类型规范

| 数据类型 | 使用场景 | 示例 |
|---------|---------|------|
| BIGINT | 主键、大数据量计数 | 用户ID、订单号 |
| INT | 普通整数 | 状态码、数量 |
| VARCHAR | 变长字符串 | 用户名、地址 |
| CHAR | 定长字符串 | 手机号、身份证号 |
| DECIMAL | 精确小数 | 金额、价格 |
| DATETIME | 日期时间 | 创建时间、更新时间 |
| DATE | 日期 | 生日、生效日期 |
| TEXT | 长文本 | 备注、描述 |
| JSON | JSON数据 | 配置、扩展字段 |

### 5.3 必备字段

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | BIGINT | 主键，自增 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |
| create_by | BIGINT | 创建人ID |
| update_by | BIGINT | 更新人ID |
| deleted | TINYINT | 逻辑删除标志 |
| tenant_id | BIGINT | 租户ID（多租户） |

---

## 六、阶段完成标准

### 6.1 完成条件

- [√] 逻辑数据模型完成
- [√] 物理数据模型完成
- [√] 索引设计完成
- [√] 分区设计完成（如需要）
- [√] 备份策略完成
- [√] 数据字典完成
- [√] SQL脚本完成
- [√] 数据库评审完成
- [√] 数据库基线已建立

### 6.2 质量要求

- [√] 所有表必须有主键
- [√] 所有字段必须有注释
- [√] 外键关系必须定义
- [√] 索引设计合理，避免过多索引
- [√] 数据字典完整准确
- [√] SQL脚本可执行，无语法错误

---

## 七、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，建立数据库设计检查清单 |
