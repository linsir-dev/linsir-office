# 备份策略文档

> **阶段**: 运维维护  
> **模块**: 备份恢复  
> **状态**: ✅ 已完成  
> **更新日期**: 2026-05-12

---

## 1. 备份策略总览

### 1.1 备份体系架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        备份体系架构                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          数据源层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   MySQL      │  │    Redis     │  │   文件存储    │          │
│  │   数据库      │  │    缓存      │  │   MinIO      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼─────────────────┼─────────────────┼───────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          备份执行层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  全量备份     │  │  增量备份     │  │  实时同步     │          │
│  │  (每日)      │  │  (每小时)    │  │  (持续)      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼─────────────────┼─────────────────┼───────────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                          存储管理层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  本地存储     │  │  异地存储     │  │  云端存储     │          │
│  │  (7天)       │  │  (30天)      │  │  (90天)      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 备份策略矩阵

| 数据类型 | 备份方式 | 备份频率 | 保留周期 | RPO | RTO |
|----------|----------|----------|----------|-----|-----|
| MySQL数据库 | 全量+增量 | 每日全量/每小时增量 | 本地7天/异地30天 | 1小时 | 2小时 |
| Redis缓存 | RDB+AOF | 每日RDB/实时AOF | 本地7天/异地30天 | 1秒 | 30分钟 |
| 文件存储 | 全量+增量 | 每日全量/实时同步 | 本地7天/异地30天 | 1小时 | 1小时 |
| 应用配置 | 版本控制 | 变更时 | 永久 | 0 | 30分钟 |
| 系统配置 | 全量备份 | 每周 | 本地30天 | 1周 | 2小时 |

---

## 2. 数据库备份

### 2.1 MySQL备份策略

#### 2.1.1 全量备份

```bash
#!/bin/bash
# mysql-full-backup.sh - MySQL全量备份脚本

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mysql/full"
DB_NAME="linsir_system"
RETENTION_DAYS=7

# 创建备份目录
mkdir -p ${BACKUP_DIR}/${DATE}

echo "[$(date)] 开始MySQL全量备份..."

# 执行全量备份
mysqldump \
    --single-transaction \
    --quick \
    --lock-tables=false \
    --routines \
    --triggers \
    --events \
    -h localhost \
    -u backup_user \
    -p'backup_password' \
    ${DB_NAME} | gzip > ${BACKUP_DIR}/${DATE}/${DB_NAME}_full_${DATE}.sql.gz

if [ $? -eq 0 ]; then
    echo "[$(date)] 全量备份完成: ${BACKUP_DIR}/${DATE}/${DB_NAME}_full_${DATE}.sql.gz"
    
    # 计算备份大小
    BACKUP_SIZE=$(du -h ${BACKUP_DIR}/${DATE}/${DB_NAME}_full_${DATE}.sql.gz | cut -f1)
    echo "[$(date)] 备份大小: ${BACKUP_SIZE}"
    
    # 生成校验文件
    md5sum ${BACKUP_DIR}/${DATE}/${DB_NAME}_full_${DATE}.sql.gz > ${BACKUP_DIR}/${DATE}/${DB_NAME}_full_${DATE}.md5
    
    # 清理过期备份
    echo "[$(date)] 清理${RETENTION_DAYS}天前的备份..."
    find ${BACKUP_DIR} -type d -mtime +${RETENTION_DAYS} -exec rm -rf {} \; 2>/dev/null
    
    echo "[$(date)] MySQL全量备份成功"
else
    echo "[$(date)] MySQL全量备份失败"
    exit 1
fi
```

#### 2.1.2 增量备份

```bash
#!/bin/bash
# mysql-incremental-backup.sh - MySQL增量备份脚本

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mysql/incremental"
BINLOG_DIR="/var/lib/mysql/binlog"
RETENTION_DAYS=7

echo "[$(date)] 开始MySQL增量备份..."

# 刷新二进制日志
mysql -u backup_user -p'backup_password' -e "FLUSH BINARY LOGS;"

# 获取当前binlog位置
CURRENT_LOG=$(mysql -u backup_user -p'backup_password' -e "SHOW MASTER STATUS;" | tail -1 | awk '{print $1}')
echo "[$(date)] 当前binlog: ${CURRENT_LOG}"

# 备份binlog文件
mkdir -p ${BACKUP_DIR}/${DATE}
cp ${BINLOG_DIR}/mysql-bin.* ${BACKUP_DIR}/${DATE}/

# 生成binlog索引
mysql -u backup_user -p'backup_password' -e "SHOW BINARY LOGS;" > ${BACKUP_DIR}/${DATE}/binlog.index

# 清理过期备份
find ${BACKUP_DIR} -type d -mtime +${RETENTION_DAYS} -exec rm -rf {} \; 2>/dev/null

echo "[$(date)] MySQL增量备份完成"
```

#### 2.1.3 备份验证

```bash
#!/bin/bash
# verify-mysql-backup.sh - MySQL备份验证脚本

BACKUP_DIR="/backup/mysql/full"
LATEST_BACKUP=$(ls -t ${BACKUP_DIR} | head -1)

echo "验证最新备份: ${LATEST_BACKUP}"

# 验证校验和
cd ${BACKUP_DIR}/${LATEST_BACKUP}
if md5sum -c *.md5; then
    echo "✅ 校验和验证通过"
else
    echo "❌ 校验和验证失败"
    exit 1
fi

# 测试解压
gunzip -t *.sql.gz
if [ $? -eq 0 ]; then
    echo "✅ 备份文件完整性验证通过"
else
    echo "❌ 备份文件损坏"
    exit 1
fi

# 测试恢复到临时数据库（可选）
# mysql -e "CREATE DATABASE IF NOT EXISTS test_restore;"
# gunzip < *.sql.gz | mysql test_restore
# if [ $? -eq 0 ]; then
#     echo "✅ 恢复测试通过"
#     mysql -e "DROP DATABASE test_restore;"
# else
#     echo "❌ 恢复测试失败"
#     exit 1
# fi

echo "备份验证完成"
```

### 2.2 Redis备份策略

#### 2.2.1 RDB备份配置

```bash
# /etc/redis/redis.conf

# RDB持久化配置
save 900 1      # 900秒内至少有1个key变化则触发保存
save 300 10     # 300秒内至少有10个key变化则触发保存
save 60 10000   # 60秒内至少有10000个key变化则触发保存

dbfilename dump.rdb
dir /var/lib/redis

# 压缩RDB文件
rdbcompression yes
rdbchecksum yes
```

#### 2.2.2 RDB备份脚本

```bash
#!/bin/bash
# redis-rdb-backup.sh - Redis RDB备份脚本

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/redis"
REDIS_DIR="/var/lib/redis"
RETENTION_DAYS=7

echo "[$(date)] 开始Redis RDB备份..."

# 触发BGSAVE
redis-cli BGSAVE

# 等待保存完成
while [ "$(redis-cli INFO Persistence | grep rdb_bgsave_in_progress | cut -d: -f2 | tr -d '\r')" = "1" ]; do
    echo "[$(date)] 等待BGSAVE完成..."
    sleep 1
done

# 检查保存状态
if [ "$(redis-cli INFO Persistence | grep rdb_last_bgsave_status | cut -d: -f2 | tr -d '\r')" = "ok" ]; then
    # 创建备份目录
    mkdir -p ${BACKUP_DIR}/${DATE}
    
    # 复制RDB文件
    cp ${REDIS_DIR}/dump.rdb ${BACKUP_DIR}/${DATE}/dump_${DATE}.rdb
    
    # 压缩备份
    gzip ${BACKUP_DIR}/${DATE}/dump_${DATE}.rdb
    
    # 生成校验文件
    md5sum ${BACKUP_DIR}/${DATE}/dump_${DATE}.rdb.gz > ${BACKUP_DIR}/${DATE}/dump_${DATE}.md5
    
    echo "[$(date)] Redis RDB备份完成"
    
    # 清理过期备份
    find ${BACKUP_DIR} -type d -mtime +${RETENTION_DAYS} -exec rm -rf {} \; 2>/dev/null
else
    echo "[$(date)] Redis RDB备份失败"
    exit 1
fi
```

#### 2.2.3 AOF备份配置

```bash
# /etc/redis/redis.conf

# AOF持久化配置
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec    # 每秒同步一次
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
```

---

## 3. 文件备份

### 3.1 应用文件备份

```bash
#!/bin/bash
# files-backup.sh - 应用文件备份脚本

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/files"
SOURCE_DIRS=(
    "/opt/linsir-system/config"
    "/opt/linsir-system/uploads"
    "/var/log/linsir-system"
)
RETENTION_DAYS=7

echo "[$(date)] 开始文件备份..."

# 创建备份目录
mkdir -p ${BACKUP_DIR}/${DATE}

# 备份各个目录
for dir in "${SOURCE_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "[$(date)] 备份目录: $dir"
        tar czf ${BACKUP_DIR}/${DATE}/$(basename $dir)_${DATE}.tar.gz -C $(dirname $dir) $(basename $dir)
    fi
done

# 生成校验文件
cd ${BACKUP_DIR}/${DATE}
md5sum *.tar.gz > files_${DATE}.md5

echo "[$(date)] 文件备份完成"

# 清理过期备份
find ${BACKUP_DIR} -type d -mtime +${RETENTION_DAYS} -exec rm -rf {} \; 2>/dev/null
```

### 3.2 MinIO对象存储备份

```bash
#!/bin/bash
# minio-backup.sh - MinIO备份脚本

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/minio"
MINIO_ALIAS="local"
BUCKETS=("linsir-files" "linsir-images" "linsir-docs")
RETENTION_DAYS=7

echo "[$(date)] 开始MinIO备份..."

# 创建备份目录
mkdir -p ${BACKUP_DIR}/${DATE}

# 备份各个bucket
for bucket in "${BUCKETS[@]}"; do
    echo "[$(date)] 备份Bucket: $bucket"
    mc mirror ${MINIO_ALIAS}/${bucket} ${BACKUP_DIR}/${DATE}/${bucket}
done

# 压缩备份
cd ${BACKUP_DIR}
tar czf ${DATE}.tar.gz ${DATE}
rm -rf ${DATE}

# 生成校验文件
md5sum ${DATE}.tar.gz > ${DATE}.md5

echo "[$(date)] MinIO备份完成"

# 清理过期备份
find ${BACKUP_DIR} -type f -mtime +${RETENTION_DAYS} -delete
```

---

## 4. 配置备份

### 4.1 配置文件备份

```bash
#!/bin/bash
# config-backup.sh - 配置文件备份脚本

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/config"
RETENTION_DAYS=30

echo "[$(date)] 开始配置备份..."

# 创建备份目录
mkdir -p ${BACKUP_DIR}/${DATE}

# 备份Nginx配置
cp -r /etc/nginx ${BACKUP_DIR}/${DATE}/

# 备份应用配置
cp -r /opt/linsir-system/config ${BACKUP_DIR}/${DATE}/

# 备份系统配置
cp /etc/hosts ${BACKUP_DIR}/${DATE}/
cp /etc/resolv.conf ${BACKUP_DIR}/${DATE}/
cp -r /etc/systemd/system ${BACKUP_DIR}/${DATE}/

# 备份环境变量
cp /opt/linsir-system/.env ${BACKUP_DIR}/${DATE}/ 2>/dev/null || true

# 压缩备份
cd ${BACKUP_DIR}
tar czf config_${DATE}.tar.gz ${DATE}
rm -rf ${DATE}

# 生成校验文件
md5sum config_${DATE}.tar.gz > config_${DATE}.md5

echo "[$(date)] 配置备份完成"

# 清理过期备份
find ${BACKUP_DIR} -type f -mtime +${RETENTION_DAYS} -delete
```

---

## 5. 异地备份

### 5.1 异地备份策略

```bash
#!/bin/bash
# remote-backup.sh - 异地备份脚本

DATE=$(date +%Y%m%d)
LOCAL_BACKUP_DIR="/backup"
REMOTE_SERVER="backup@backup-server.linsir.com"
REMOTE_DIR="/remote-backup/linsir-system"
RETENTION_DAYS=30

echo "[$(date)] 开始异地备份..."

# 创建远程目录
ssh ${REMOTE_SERVER} "mkdir -p ${REMOTE_DIR}/${DATE}"

# 同步MySQL备份
echo "[$(date)] 同步MySQL备份..."
rsync -avz --delete ${LOCAL_BACKUP_DIR}/mysql/ ${REMOTE_SERVER}:${REMOTE_DIR}/${DATE}/mysql/

# 同步Redis备份
echo "[$(date)] 同步Redis备份..."
rsync -avz --delete ${LOCAL_BACKUP_DIR}/redis/ ${REMOTE_SERVER}:${REMOTE_DIR}/${DATE}/redis/

# 同步文件备份
echo "[$(date)] 同步文件备份..."
rsync -avz --delete ${LOCAL_BACKUP_DIR}/files/ ${REMOTE_SERVER}:${REMOTE_DIR}/${DATE}/files/

# 同步MinIO备份
echo "[$(date)] 同步MinIO备份..."
rsync -avz --delete ${LOCAL_BACKUP_DIR}/minio/ ${REMOTE_SERVER}:${REMOTE_DIR}/${DATE}/minio/

# 清理远程过期备份
echo "[$(date)] 清理远程过期备份..."
ssh ${REMOTE_SERVER} "find ${REMOTE_DIR} -type d -mtime +${RETENTION_DAYS} -exec rm -rf {} \; 2>/dev/null"

echo "[$(date)] 异地备份完成"
```

### 5.2 云存储备份

```bash
#!/bin/bash
# cloud-backup.sh - 云存储备份脚本

DATE=$(date +%Y%m%d)
LOCAL_BACKUP_DIR="/backup"
S3_BUCKET="s3://linsir-backup"
RETENTION_DAYS=90

echo "[$(date)] 开始云存储备份..."

# 上传MySQL备份
echo "[$(date)] 上传MySQL备份..."
aws s3 sync ${LOCAL_BACKUP_DIR}/mysql/ ${S3_BUCKET}/mysql/${DATE}/

# 上传Redis备份
echo "[$(date)] 上传Redis备份..."
aws s3 sync ${LOCAL_BACKUP_DIR}/redis/ ${S3_BUCKET}/redis/${DATE}/

# 上传配置文件
echo "[$(date)] 上传配置文件..."
aws s3 sync ${LOCAL_BACKUP_DIR}/config/ ${S3_BUCKET}/config/${DATE}/

# 设置生命周期策略（自动删除过期备份）
# aws s3api put-bucket-lifecycle-configuration --bucket linsir-backup --lifecycle-configuration file://lifecycle.json

echo "[$(date)] 云存储备份完成"
```

---

## 6. 恢复流程

### 6.1 数据库恢复

#### 6.1.1 MySQL全量恢复

```bash
#!/bin/bash
# mysql-restore.sh - MySQL恢复脚本

BACKUP_DATE=$1
DB_NAME="linsir_system"
BACKUP_DIR="/backup/mysql/full/${BACKUP_DATE}"

if [ -z "$BACKUP_DATE" ]; then
    echo "用法: $0 <备份日期YYYYMMDD>"
    exit 1
fi

if [ ! -d "$BACKUP_DIR" ]; then
    echo "错误: 备份目录不存在: $BACKUP_DIR"
    exit 1
fi

echo "========== MySQL恢复 =========="
echo "备份日期: $BACKUP_DATE"
echo "目标数据库: $DB_NAME"
echo "==============================="

# 确认恢复
read -p "确认恢复数据库? 这将覆盖现有数据! (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "恢复已取消"
    exit 0
fi

# 停止应用服务
echo "[1/5] 停止应用服务..."
systemctl stop linsir-system

# 备份当前数据库
echo "[2/5] 备份当前数据库..."
mysqldump -u root -p ${DB_NAME} > /tmp/${DB_NAME}_pre_restore_$(date +%Y%m%d%H%M%S).sql

# 恢复数据库
echo "[3/5] 恢复数据库..."
mysql -u root -p -e "DROP DATABASE IF EXISTS ${DB_NAME}; CREATE DATABASE ${DB_NAME};"
gunzip < ${BACKUP_DIR}/${DB_NAME}_full_${BACKUP_DATE}*.sql.gz | mysql -u root -p ${DB_NAME}

if [ $? -eq 0 ]; then
    echo "[4/5] 数据库恢复成功"
    
    # 应用增量备份（如果有）
    INCREMENTAL_DIR="/backup/mysql/incremental"
    if [ -d "$INCREMENTAL_DIR" ]; then
        echo "[5/5] 应用增量备份..."
        # 应用binlog增量
        for binlog in $(ls ${INCREMENTAL_DIR}/*/mysql-bin.* | sort); do
            echo "应用binlog: $binlog"
            mysqlbinlog $binlog | mysql -u root -p ${DB_NAME}
        done
    fi
    
    # 启动应用服务
    echo "启动应用服务..."
    systemctl start linsir-system
    
    echo "✅ 数据库恢复完成"
else
    echo "❌ 数据库恢复失败"
    exit 1
fi
```

#### 6.1.2 Redis恢复

```bash
#!/bin/bash
# redis-restore.sh - Redis恢复脚本

BACKUP_DATE=$1
BACKUP_DIR="/backup/redis/${BACKUP_DATE}"

if [ -z "$BACKUP_DATE" ]; then
    echo "用法: $0 <备份日期YYYYMMDD_HHMMSS>"
    exit 1
fi

if [ ! -d "$BACKUP_DIR" ]; then
    echo "错误: 备份目录不存在: $BACKUP_DIR"
    exit 1
fi

echo "========== Redis恢复 =========="
echo "备份日期: $BACKUP_DATE"
echo "==============================="

# 确认恢复
read -p "确认恢复Redis数据? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "恢复已取消"
    exit 0
fi

# 停止Redis
echo "[1/3] 停止Redis服务..."
systemctl stop redis

# 备份当前数据
echo "[2/3] 备份当前Redis数据..."
cp /var/lib/redis/dump.rdb /var/lib/redis/dump.rdb.backup.$(date +%Y%m%d%H%M%S)

# 恢复数据
echo "[3/3] 恢复Redis数据..."
gunzip -c ${BACKUP_DIR}/dump_${BACKUP_DATE}.rdb.gz > /var/lib/redis/dump.rdb
chown redis:redis /var/lib/redis/dump.rdb
chmod 660 /var/lib/redis/dump.rdb

# 启动Redis
echo "启动Redis服务..."
systemctl start redis

# 验证恢复
if redis-cli PING | grep -q "PONG"; then
    echo "✅ Redis恢复完成"
else
    echo "❌ Redis恢复失败"
    exit 1
fi
```

### 6.2 文件恢复

```bash
#!/bin/bash
# files-restore.sh - 文件恢复脚本

BACKUP_DATE=$1
BACKUP_DIR="/backup/files/${BACKUP_DATE}"
RESTORE_DIR=${2:-"/tmp/restore"}

if [ -z "$BACKUP_DATE" ]; then
    echo "用法: $0 <备份日期YYYYMMDD_HHMMSS> [恢复目录]"
    exit 1
fi

if [ ! -d "$BACKUP_DIR" ]; then
    echo "错误: 备份目录不存在: $BACKUP_DIR"
    exit 1
fi

echo "========== 文件恢复 =========="
echo "备份日期: $BACKUP_DATE"
echo "恢复目录: $RESTORE_DIR"
echo "=============================="

# 创建恢复目录
mkdir -p ${RESTORE_DIR}

# 解压备份文件
echo "[1/2] 解压备份文件..."
for backup in ${BACKUP_DIR}/*.tar.gz; do
    echo "解压: $(basename $backup)"
    tar xzf $backup -C ${RESTORE_DIR}
done

# 验证恢复
echo "[2/2] 验证恢复..."
ls -la ${RESTORE_DIR}

echo "✅ 文件已恢复到: ${RESTORE_DIR}"
echo "请检查恢复的文件，确认无误后手动替换到目标位置"
```

---

## 7. 灾难恢复

### 7.1 灾难恢复计划

| 灾难场景 | 恢复策略 | RTO | RPO | 恢复步骤 |
|----------|----------|-----|-----|----------|
| 单点故障 | 切换到备用节点 | 5分钟 | 0 | 1. 检测故障<br>2. 切换VIP<br>3. 恢复服务 |
| 数据中心故障 | 切换到异地灾备 | 1小时 | 1小时 | 1. 启动灾备环境<br>2. 恢复数据<br>3. 切换DNS |
| 数据损坏 | 从备份恢复 | 2小时 | 1小时 | 1. 停止服务<br>2. 恢复数据<br>3. 验证数据<br>4. 启动服务 |
| 人为误操作 | 按时间点恢复 | 2小时 | 1小时 | 1. 确定时间点<br>2. 恢复数据<br>3. 应用binlog |

### 7.2 灾难恢复脚本

```bash
#!/bin/bash
# disaster-recovery.sh - 灾难恢复脚本

DISASTER_TYPE=$1
RECOVERY_POINT=$2

echo "========== 灾难恢复 =========="
echo "灾难类型: $DISASTER_TYPE"
echo "恢复时间点: $RECOVERY_POINT"
echo "=============================="

case $DISASTER_TYPE in
    "database")
        echo "执行数据库灾难恢复..."
        # 1. 停止应用
        systemctl stop linsir-system
        
        # 2. 恢复数据库
        bash /opt/scripts/mysql-restore.sh $RECOVERY_POINT
        
        # 3. 启动应用
        systemctl start linsir-system
        ;;
    "files")
        echo "执行文件系统灾难恢复..."
        # 恢复文件备份
        bash /opt/scripts/files-restore.sh $RECOVERY_POINT
        ;;
    "full")
        echo "执行全系统灾难恢复..."
        # 1. 恢复数据库
        bash /opt/scripts/mysql-restore.sh $RECOVERY_POINT
        
        # 2. 恢复Redis
        bash /opt/scripts/redis-restore.sh $RECOVERY_POINT
        
        # 3. 恢复文件
        bash /opt/scripts/files-restore.sh $RECOVERY_POINT
        
        # 4. 启动所有服务
        systemctl start redis
        systemctl start linsir-system
        systemctl start nginx
        ;;
    *)
        echo "未知的灾难类型: $DISASTER_TYPE"
        echo "支持的类型: database, files, full"
        exit 1
        ;;
esac

echo "✅ 灾难恢复完成"
```

---

## 8. 备份自动化

### 8.1 Crontab配置

```bash
# /etc/cron.d/linsir-backup

# MySQL全量备份 - 每天凌晨2点
0 2 * * * root /opt/scripts/mysql-full-backup.sh >> /var/log/backup/mysql-full.log 2>&1

# MySQL增量备份 - 每小时
0 * * * * root /opt/scripts/mysql-incremental-backup.sh >> /var/log/backup/mysql-incr.log 2>&1

# Redis RDB备份 - 每天凌晨3点
0 3 * * * root /opt/scripts/redis-rdb-backup.sh >> /var/log/backup/redis.log 2>&1

# 文件备份 - 每天凌晨4点
0 4 * * * root /opt/scripts/files-backup.sh >> /var/log/backup/files.log 2>&1

# 配置备份 - 每天凌晨5点
0 5 * * * root /opt/scripts/config-backup.sh >> /var/log/backup/config.log 2>&1

# MinIO备份 - 每天凌晨1点
0 1 * * * root /opt/scripts/minio-backup.sh >> /var/log/backup/minio.log 2>&1

# 异地备份 - 每天凌晨6点
0 6 * * * root /opt/scripts/remote-backup.sh >> /var/log/backup/remote.log 2>&1

# 云存储备份 - 每周日凌晨7点
0 7 * * 0 root /opt/scripts/cloud-backup.sh >> /var/log/backup/cloud.log 2>&1

# 备份验证 - 每天上午9点
0 9 * * * root /opt/scripts/verify-mysql-backup.sh >> /var/log/backup/verify.log 2>&1
```

### 8.2 备份监控

```bash
#!/bin/bash
# backup-monitor.sh - 备份监控脚本

BACKUP_LOG_DIR="/var/log/backup"
ALERT_EMAIL="ops@linsir.com"

echo "[$(date)] 检查备份状态..."

# 检查备份日志中的错误
ERRORS=$(grep -i "error\|fail\|失败" ${BACKUP_LOG_DIR}/*.log 2>/dev/null)

if [ -n "$ERRORS" ]; then
    echo "发现备份错误:"
    echo "$ERRORS"
    
    # 发送告警邮件
    echo "$ERRORS" | mail -s "[ALERT] 备份异常 - $(date +%Y-%m-%d)" ${ALERT_EMAIL}
else
    echo "✅ 所有备份正常"
fi

# 检查备份文件是否存在
BACKUP_DIRS=(
    "/backup/mysql/full"
    "/backup/redis"
    "/backup/files"
)

for dir in "${BACKUP_DIRS[@]}"; do
    LATEST_BACKUP=$(ls -t $dir 2>/dev/null | head -1)
    if [ -z "$LATEST_BACKUP" ]; then
        echo "⚠️ 警告: $dir 目录下没有备份文件"
    else
        BACKUP_AGE=$(stat -c %Y $dir/$LATEST_BACKUP)
        CURRENT_TIME=$(date +%s)
        AGE_HOURS=$(( (CURRENT_TIME - BACKUP_AGE) / 3600 ))
        
        if [ $AGE_HOURS -gt 25 ]; then
            echo "⚠️ 警告: $dir 的最新备份已超过25小时 (年龄: ${AGE_HOURS}小时)"
        fi
    fi
done
```

---

## 9. 备份检查清单

### 9.1 日常检查

| 检查项 | 检查方法 | 频率 | 负责人 |
|--------|----------|------|--------|
| 备份日志检查 | 查看日志文件 | 每日 | 运维 |
| 备份文件存在性 | ls检查 | 每日 | 运维 |
| 备份文件大小 | du检查 | 每日 | 运维 |
| 备份完整性 | md5校验 | 每日 | 运维 |
| 磁盘空间 | df检查 | 每日 | 运维 |

### 9.2 定期检查

| 检查项 | 检查方法 | 频率 | 负责人 |
|--------|----------|------|--------|
| 恢复演练 | 执行恢复测试 | 每月 | DBA |
| 异地备份验证 | 检查远程备份 | 每周 | 运维 |
| 云备份验证 | 检查云存储 | 每周 | 运维 |
| 备份策略评审 | 策略评估 | 季度 | 运维主管 |
| 灾难恢复演练 | 全链路演练 | 半年 | 运维主管 |

---

## 10. 备份恢复联系信息

| 角色 | 姓名 | 电话 | 邮箱 | 职责 |
|------|------|------|------|------|
| 备份负责人 | 郑十一 | 137-xxxx-xxxx | zhengshiyi@linsir.com | 备份策略、恢复演练 |
| 数据库管理员 | 周九 | 138-xxxx-xxxx | zhoujiu@linsir.com | 数据库备份恢复 |
| 运维工程师 | 吴十 | 139-xxxx-xxxx | wushi@linsir.com | 文件备份、系统恢复 |

---

**文档创建:** 2026-05-12  
**最后更新:** 2026-05-12  
**备份负责人:** 郑十一
