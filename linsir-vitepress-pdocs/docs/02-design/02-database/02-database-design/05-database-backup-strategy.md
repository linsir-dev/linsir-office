# 数据库备份策略

> **文档编号**: SYS-DB-DES-005  
> **版本**: 1.0  
> **日期**: 2026-03-08  
> **作者**: 数据库架构师  
> **状态**: ✅ 已评审

---

## 一、概述

### 1.1 备份目标

- 保障数据安全，防止数据丢失
- 支持灾难恢复，确保业务连续性
- 满足合规要求，保留审计数据
- 支持数据迁移和测试环境搭建

### 1.2 RTO/RPO定义

| 指标 | 定义 | 目标值 | 说明 |
|-----|------|-------|------|
| **RTO** | 恢复时间目标 | ≤ 4小时 | 从故障发生到业务恢复的时间 |
| **RPO** | 恢复点目标 | ≤ 1小时 | 可接受的数据丢失时间窗口 |

### 1.3 备份原则

1. **3-2-1原则**: 3份副本，2种介质，1份异地
2. **定期验证**: 定期测试备份恢复流程
3. **加密存储**: 敏感数据加密备份
4. **访问控制**: 严格限制备份访问权限

---

## 二、备份类型

### 2.1 全量备份 (Full Backup)

| 属性 | 说明 |
|-----|------|
| **备份内容** | 完整数据库 |
| **备份频率** | 每周日 02:00 |
| **保留周期** | 4周 |
| **存储位置** | 本地NAS + 云存储 |
| **预计大小** | 500MB - 2GB |

```bash
# 全量备份命令
mysqldump -u backup_user -p --single-transaction \
  --routines --triggers --events \
  --master-data=2 \
  db_system > /backup/full/db_system_$(date +%Y%m%d_%H%M%S).sql

# 压缩备份
gzip /backup/full/db_system_*.sql
```

### 2.2 增量备份 (Incremental Backup)

| 属性 | 说明 |
|-----|------|
| **备份内容** | 自上次备份后的变更 |
| **备份频率** | 每天 02:00 |
| **保留周期** | 7天 |
| **存储位置** | 本地NAS |
| **依赖** | 基于全量备份 |

```bash
# 使用Percona XtraBackup进行增量备份
xtrabackup --backup --target-dir=/backup/incr/$(date +%Y%m%d) \
  --incremental-basedir=/backup/full/latest \
  --user=backup_user --password=xxx
```

### 2.3 事务日志备份 (Binlog Backup)

| 属性 | 说明 |
|-----|------|
| **备份内容** | MySQL Binlog |
| **备份频率** | 实时同步 |
| **保留周期** | 7天 |
| **存储位置** | 独立服务器 |
| **用途** | 时间点恢复 |

```bash
# 实时备份binlog
mysqlbinlog --read-from-remote-server --raw \
  --host=master_host --user=backup_user --password=xxx \
  mysql-bin.000001 > /backup/binlog/
```

---

## 三、备份策略矩阵

### 3.1 生产环境备份策略

| 备份类型 | 频率 | 时间 | 保留期 | 存储位置 | 加密 |
|---------|------|------|-------|---------|------|
| 全量备份 | 每周 | 周日 02:00 | 4周 | NAS + 云 | ✅ |
| 增量备份 | 每天 | 02:00 | 7天 | NAS | ✅ |
| Binlog | 实时 | - | 7天 | 独立服务器 | ✅ |
| 配置备份 | 每次变更 | - | 12个月 | Git + NAS | ❌ |

### 3.2 测试/开发环境备份策略

| 备份类型 | 频率 | 保留期 | 说明 |
|---------|------|-------|------|
| 全量备份 | 每周 | 2周 | 从生产恢复 |
| 配置备份 | 每次变更 | 6个月 | 仅结构 |

---

## 四、备份脚本

### 4.1 全量备份脚本

```bash
#!/bin/bash
# full_backup.sh - 全量备份脚本

# 配置
DB_NAME="db_system"
DB_USER="backup_user"
DB_PASS="your_password"
BACKUP_DIR="/backup/full"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=28

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
echo "[$(date)] 开始全量备份..."
mysqldump -u$DB_USER -p$DB_PASS \
  --single-transaction \
  --routines --triggers --events \
  --master-data=2 \
  --databases $DB_NAME \
  | gzip > $BACKUP_DIR/${DB_NAME}_full_$DATE.sql.gz

# 检查备份结果
if [ $? -eq 0 ]; then
    echo "[$(date)] 备份成功: ${DB_NAME}_full_$DATE.sql.gz"
    
    # 计算MD5
    md5sum $BACKUP_DIR/${DB_NAME}_full_$DATE.sql.gz > $BACKUP_DIR/${DB_NAME}_full_$DATE.sql.gz.md5
    
    # 上传到云存储
    aws s3 cp $BACKUP_DIR/${DB_NAME}_full_$DATE.sql.gz s3://db-backup/$DB_NAME/
    aws s3 cp $BACKUP_DIR/${DB_NAME}_full_$DATE.sql.gz.md5 s3://db-backup/$DB_NAME/
else
    echo "[$(date)] 备份失败!"
    exit 1
fi

# 清理旧备份
echo "[$(date)] 清理${RETENTION_DAYS}天前的备份..."
find $BACKUP_DIR -name "${DB_NAME}_full_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "${DB_NAME}_full_*.sql.gz.md5" -mtime +$RETENTION_DAYS -delete

echo "[$(date)] 备份完成"
```

### 4.2 增量备份脚本

```bash
#!/bin/bash
# incr_backup.sh - 增量备份脚本

DB_NAME="db_system"
BACKUP_DIR="/backup/incr"
FULL_BACKUP_DIR="/backup/full"
DATE=$(date +%Y%m%d)
RETENTION_DAYS=7

# 查找最新的全量备份
LATEST_FULL=$(ls -td $FULL_BACKUP_DIR/${DB_NAME}_full_*.sql.gz | head -1)

if [ -z "$LATEST_FULL" ]; then
    echo "[$(date)] 错误: 未找到全量备份"
    exit 1
fi

echo "[$(date)] 基于全量备份: $LATEST_FULL"

# 创建增量备份目录
mkdir -p $BACKUP_DIR/$DATE

# 执行增量备份（使用XtraBackup）
echo "[$(date)] 开始增量备份..."
xtrabackup --backup \
  --target-dir=$BACKUP_DIR/$DATE \
  --incremental-basedir=$(dirname $LATEST_FULL) \
  --databases=$DB_NAME \
  --user=backup_user --password=xxx

# 压缩备份
tar czf $BACKUP_DIR/${DB_NAME}_incr_$DATE.tar.gz -C $BACKUP_DIR $DATE
rm -rf $BACKUP_DIR/$DATE

# 清理旧备份
find $BACKUP_DIR -name "${DB_NAME}_incr_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "[$(date)] 增量备份完成"
```

### 4.3 自动清理脚本

```bash
#!/bin/bash
# cleanup_backup.sh - 备份清理脚本

echo "[$(date)] 开始清理过期备份..."

# 清理全量备份（保留4周）
find /backup/full -name "db_system_full_*.sql.gz" -mtime +28 -exec rm -f {} \;
find /backup/full -name "db_system_full_*.sql.gz.md5" -mtime +28 -exec rm -f {} \;

# 清理增量备份（保留7天）
find /backup/incr -name "db_system_incr_*.tar.gz" -mtime +7 -exec rm -f {} \;

# 清理binlog（保留7天）
find /backup/binlog -name "mysql-bin.*" -mtime +7 -exec rm -f {} \;

echo "[$(date)] 清理完成"
```

---

## 五、恢复策略

### 5.1 恢复场景

| 场景 | 恢复方式 | 预计时间 | 数据丢失 |
|-----|---------|---------|---------|
| 误删除单表 | 单表恢复 | 10分钟 | 无 |
| 数据库损坏 | 全量+增量恢复 | 2-4小时 | 取决于备份时间 |
| 服务器故障 | 全量+Binlog恢复 | 2-4小时 | 最小化 |
| 灾难恢复 | 异地备份恢复 | 4-8小时 | 取决于同步延迟 |

### 5.2 恢复脚本

```bash
#!/bin/bash
# restore.sh - 数据库恢复脚本

BACKUP_FILE=$1
DB_NAME="db_system"
DB_USER="root"
DB_PASS="your_password"

if [ -z "$BACKUP_FILE" ]; then
    echo "用法: $0 <备份文件>"
    exit 1
fi

echo "[$(date)] 开始恢复数据库..."
echo "[$(date)] 备份文件: $BACKUP_FILE"

# 停止应用连接
echo "[$(date)] 停止应用连接..."
mysql -u$DB_USER -p$DB_PASS -e "SET GLOBAL max_connections = 1;"

# 删除并重建数据库
echo "[$(date)] 重建数据库..."
mysql -u$DB_USER -p$DB_PASS -e "DROP DATABASE IF EXISTS $DB_NAME;"
mysql -u$DB_USER -p$DB_PASS -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4;"

# 恢复数据
echo "[$(date)] 恢复数据..."
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip < $BACKUP_FILE | mysql -u$DB_USER -p$DB_PASS $DB_NAME
else
    mysql -u$DB_USER -p$DB_PASS $DB_NAME < $BACKUP_FILE
fi

# 恢复连接限制
echo "[$(date)] 恢复应用连接..."
mysql -u$DB_USER -p$DB_PASS -e "SET GLOBAL max_connections = 1000;"

# 验证恢复
echo "[$(date)] 验证恢复结果..."
TABLE_COUNT=$(mysql -u$DB_USER -p$DB_PASS -N -e "SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA='$DB_NAME';")
echo "[$(date)] 恢复完成，共 $TABLE_COUNT 张表"
```

### 5.3 时间点恢复 (PITR)

```bash
#!/bin/bash
# pitr_restore.sh - 时间点恢复

TARGET_TIME=$1  # 格式: "2025-03-08 14:30:00"

if [ -z "$TARGET_TIME" ]; then
    echo "用法: $0 'YYYY-MM-DD HH:MM:SS'"
    exit 1
fi

# 1. 恢复全量备份
echo "[$(date)] 步骤1: 恢复全量备份..."
# ... 恢复代码 ...

# 2. 应用增量备份
echo "[$(date)] 步骤2: 应用增量备份..."
# ... 应用增量 ...

# 3. 应用Binlog到指定时间点
echo "[$(date)] 步骤3: 应用Binlog到 $TARGET_TIME..."
mysqlbinlog \
  --start-datetime="2025-03-08 00:00:00" \
  --stop-datetime="$TARGET_TIME" \
  /backup/binlog/mysql-bin.000001 \
  | mysql -u root -p db_system

echo "[$(date)] 时间点恢复完成"
```

---

## 六、备份验证

### 6.1 定期恢复测试

| 测试类型 | 频率 | 负责人 | 验证内容 |
|---------|------|-------|---------|
| 备份完整性检查 | 每天 | 自动化 | MD5校验 |
| 测试环境恢复 | 每周 | DBA | 全量恢复测试 |
| 灾难恢复演练 | 每季度 | DBA+运维 | 异地恢复测试 |

### 6.2 验证脚本

```bash
#!/bin/bash
# verify_backup.sh - 备份验证脚本

BACKUP_FILE=$1

echo "[$(date)] 验证备份文件: $BACKUP_FILE"

# 1. 检查文件存在
if [ ! -f "$BACKUP_FILE" ]; then
    echo "[$(date)] 错误: 文件不存在"
    exit 1
fi

# 2. 检查文件大小
FILE_SIZE=$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE")
if [ $FILE_SIZE -lt 1024 ]; then
    echo "[$(date)] 错误: 文件太小 ($FILE_SIZE bytes)"
    exit 1
fi

# 3. MD5校验
if [ -f "$BACKUP_FILE.md5" ]; then
    echo "[$(date)] 执行MD5校验..."
    md5sum -c "$BACKUP_FILE.md5"
    if [ $? -ne 0 ]; then
        echo "[$(date)] 错误: MD5校验失败"
        exit 1
    fi
fi

# 4. 测试解压
echo "[$(date)] 测试解压..."
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -t "$BACKUP_FILE"
    if [ $? -ne 0 ]; then
        echo "[$(date)] 错误: 文件损坏"
        exit 1
    fi
fi

echo "[$(date)] 备份验证通过"
```

---

## 七、监控与告警

### 7.1 监控指标

| 指标 | 告警阈值 | 说明 |
|-----|---------|------|
| 备份失败 | = 1 | 备份任务失败 |
| 备份大小变化 | > 50% | 与上次备份大小差异 |
| 备份时长 | > 2小时 | 备份执行时间 |
| 存储空间 | > 80% | 备份存储使用率 |
| 上次备份时间 | > 25小时 | 检查备份是否按时执行 |

### 7.2 告警配置

```bash
# 备份监控脚本
#!/bin/bash
# backup_monitor.sh

BACKUP_DIR="/backup/full"
ALERT_EMAIL="dba@company.com"

# 检查最近24小时是否有备份
LATEST_BACKUP=$(find $BACKUP_DIR -name "db_system_full_*.sql.gz" -mtime -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "[ALERT] 最近24小时无备份!" | mail -s "[ALERT] 数据库备份异常" $ALERT_EMAIL
fi

# 检查存储空间
USAGE=$(df -h $BACKUP_DIR | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $USAGE -gt 80 ]; then
    echo "[ALERT] 备份存储空间不足: ${USAGE}%" | mail -s "[ALERT] 备份存储告警" $ALERT_EMAIL
fi
```

---

## 八、备份统计

| 项目 | 值 |
|-----|---|
| 全量备份频率 | 每周 |
| 增量备份频率 | 每天 |
| Binlog备份 | 实时 |
| 全量保留周期 | 4周 |
| 增量保留周期 | 7天 |
| Binlog保留周期 | 7天 |
| RTO目标 | ≤ 4小时 |
| RPO目标 | ≤ 1小时 |
| 加密存储 | 是 |
| 异地备份 | 是 |

---

## 九、审核记录

### 9.1 审核状态

| 审核项 | 状态 | 审核人 | 审核日期 |
|-------|------|-------|---------|
| 备份策略 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 恢复策略 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| RTO/RPO定义 | ✓ 通过 | 技术负责人 | 2026-03-08 |
| 备份脚本 | ✓ 通过 | 技术负责人 | 2026-03-08 |

### 9.2 签字确认

| 角色 | 姓名 | 签字 | 日期 |
|-----|------|------|------|
| 编制人 | 数据库架构师 | _____________ | 2026-03-08 |
| 审核人 | 技术负责人 | _____________ | 2026-03-08 |
| 批准人 | 项目经理 | _____________ | 2026-03-08 |

---

## 十、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 数据库架构师 | 初始版本，创建备份策略文档 |
