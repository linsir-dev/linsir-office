# 运维手册文档

> **阶段**: 运维维护  
> **模块**: 维护管理  
> **状态**: ✅ 已完成  
> **更新日期**: 2026-05-12

---

## 1. 运维组织架构

### 1.1 职责分工

| 角色 | 职责 | 值班安排 |
|------|------|----------|
| 运维主管 | 运维策略制定、重大故障处理 | 7×24小时待命 |
| 系统运维 | 服务器管理、系统部署、监控 | 轮班制 |
| 数据库运维 | 数据库管理、备份恢复 | 轮班制 |
| 网络运维 | 网络配置、安全防护 | 轮班制 |
| 应用运维 | 应用发布、故障排查 | 轮班制 |

### 1.2 值班制度

| 班次 | 时间 | 负责人 |
|------|------|--------|
| 白班 | 08:00-20:00 | 值班运维 |
| 夜班 | 20:00-08:00 | 值班运维 |
| 周末 | 全天 | 轮班 |

---

## 2. 日常维护

### 2.1 每日巡检

#### 2.1.1 系统健康检查

```bash
#!/bin/bash
# daily-check.sh - 每日巡检脚本

DATE=$(date +%Y-%m-%d)
LOG_FILE="/var/log/ops/daily-check-${DATE}.log"

echo "========== 每日巡检开始: $(date) ==========" >> $LOG_FILE

# 1. 检查服务状态
echo "[1] 检查服务状态..." >> $LOG_FILE
systemctl status nginx >> $LOG_FILE 2>&1
systemctl status linsir-system >> $LOG_FILE 2>&1
systemctl status mysql >> $LOG_FILE 2>&1
systemctl status redis >> $LOG_FILE 2>&1

# 2. 检查磁盘空间
echo "[2] 检查磁盘空间..." >> $LOG_FILE
df -h >> $LOG_FILE

# 3. 检查内存使用
echo "[3] 检查内存使用..." >> $LOG_FILE
free -h >> $LOG_FILE

# 4. 检查CPU负载
echo "[4] 检查CPU负载..." >> $LOG_FILE
uptime >> $LOG_FILE

# 5. 检查日志错误
echo "[5] 检查日志错误..." >> $LOG_FILE
grep -i "error\|exception" /var/log/linsir-system/*.log | tail -20 >> $LOG_FILE

echo "========== 每日巡检结束: $(date) ==========" >> $LOG_FILE
```

#### 2.1.2 巡检检查清单

| 检查项 | 正常标准 | 检查命令 | 频率 |
|--------|----------|----------|------|
| 服务状态 | 所有服务running | `systemctl status` | 每日 |
| 磁盘空间 | 使用率<80% | `df -h` | 每日 |
| 内存使用 | 使用率<85% | `free -h` | 每日 |
| CPU负载 | load<核心数×2 | `uptime` | 每日 |
| 日志错误 | 无ERROR级别 | `grep ERROR` | 每日 |
| 网络连通 | 无丢包 | `ping` | 每日 |
| SSL证书 | 有效期>30天 | `openssl x509` | 每周 |

### 2.2 定期维护

#### 2.2.1 周维护任务

| 任务 | 描述 | 执行时间 |
|------|------|----------|
| 安全补丁更新 | 检查并安装安全补丁 | 每周一 02:00 |
| 日志清理 | 清理过期日志文件 | 每周日 03:00 |
| 性能分析 | 分析系统性能趋势 | 每周五 14:00 |
| 备份验证 | 验证备份完整性 | 每周六 01:00 |

#### 2.2.2 月维护任务

| 任务 | 描述 | 执行时间 |
|------|------|----------|
| 系统更新 | 更新系统软件包 | 每月第一个周日 |
| 密码轮换 | 更新系统密码 | 每月15日 |
| 容量规划 | 评估资源使用情况 | 每月最后一周 |
| 安全审计 | 检查安全日志 | 每月25日 |

#### 2.2.3 定期维护脚本

```bash
#!/bin/bash
# weekly-maintenance.sh - 周维护脚本

LOG_FILE="/var/log/ops/weekly-maintenance-$(date +%Y%m%d).log"

echo "========== 周维护开始: $(date) ==========" | tee -a $LOG_FILE

# 1. 系统更新
echo "[1] 检查系统更新..." | tee -a $LOG_FILE
apt-get update >> $LOG_FILE 2>&1
apt-get -s upgrade >> $LOG_FILE 2>&1

# 2. 清理日志
echo "[2] 清理过期日志..." | tee -a $LOG_FILE
find /var/log/linsir-system -name "*.log.*" -mtime +30 -delete
find /var/log/nginx -name "*.log.*" -mtime +30 -delete

# 3. 清理临时文件
echo "[3] 清理临时文件..." | tee -a $LOG_FILE
find /tmp -type f -mtime +7 -delete
find /var/tmp -type f -mtime +7 -delete

# 4. 优化数据库
echo "[4] 数据库优化..." | tee -a $LOG_FILE
mysqlcheck -o linsir_system >> $LOG_FILE 2>&1

echo "========== 周维护结束: $(date) ==========" | tee -a $LOG_FILE
```

---

## 3. 故障处理

### 3.1 故障分级

| 级别 | 定义 | 响应时间 | 解决时间 | 通知范围 |
|------|------|----------|----------|----------|
| P0-紧急 | 系统完全不可用 | 5分钟 | 1小时 | CTO、运维主管、全员 |
| P1-高 | 核心功能不可用 | 15分钟 | 4小时 | 运维主管、开发负责人 |
| P2-中 | 部分功能异常 | 30分钟 | 8小时 | 值班运维、开发团队 |
| P3-低 | 轻微问题 | 2小时 | 24小时 | 值班运维 |

### 3.2 故障处理流程

```
┌─────────────────────────────────────────────────────────────────┐
│                      故障处理流程                                │
└─────────────────────────────────────────────────────────────────┘

  告警/发现
      │
      ▼
┌─────────────┐
│  故障确认    │ ◄── 确认故障影响范围、严重程度
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  故障分级    │ ◄── 根据分级标准确定P0-P3
└──────┬──────┘
       │
       ▼
┌─────────────┐     是    ┌─────────────┐
│  是否有预案? │ ─────────►│  执行预案    │
└──────┬──────┘           └─────────────┘
       │ 否
       ▼
┌─────────────┐
│  故障诊断    │ ◄── 收集日志、分析原因
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  故障修复    │ ◄── 实施修复方案
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  验证恢复    │ ◄── 确认服务恢复正常
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  故障复盘    │ ◄── 编写故障报告、制定改进措施
└─────────────┘
```

### 3.3 常见故障处理

#### 3.3.1 服务宕机

| 现象 | 可能原因 | 处理步骤 |
|------|----------|----------|
| 502 Bad Gateway | Nginx后端服务异常 | 1. 检查后端服务状态<br>2. 查看服务日志<br>3. 重启服务<br>4. 检查资源使用 |
| 连接超时 | 网络或防火墙问题 | 1. 检查网络连通性<br>2. 检查防火墙规则<br>3. 检查安全组配置 |
| OOM killed | 内存不足 | 1. 检查内存使用<br>2. 调整JVM参数<br>3. 扩容服务器 |

#### 3.3.2 数据库故障

| 现象 | 可能原因 | 处理步骤 |
|------|----------|----------|
| 连接数满 | 连接未释放 | 1. 查看当前连接<br>2. 杀掉空闲连接<br>3. 优化连接池配置 |
| 主从延迟 | 从库性能不足 | 1. 检查从库负载<br>2. 优化慢查询<br>3. 考虑扩容 |
| 磁盘满 | 日志或数据增长 | 1. 清理过期日志<br>2. 扩展磁盘空间<br>3. 归档历史数据 |

#### 3.3.3 网络故障

| 现象 | 可能原因 | 处理步骤 |
|------|----------|----------|
| 网络不通 | 路由或DNS问题 | 1. 测试网络连通性<br>2. 检查DNS解析<br>3. 检查路由表 |
| 高延迟 | 带宽不足或拥塞 | 1. 检查带宽使用<br>2. 分析流量来源<br>3. 考虑带宽扩容 |
| 丢包严重 | 网络设备故障 | 1. 检查网络设备<br>2. 更换故障设备<br>3. 启用备用链路 |

### 3.4 故障处理脚本

```bash
#!/bin/bash
# emergency-response.sh - 紧急故障响应脚本

INCIDENT_ID="INC-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="/var/log/ops/incident-${INCIDENT_ID}.log"

echo "========== 故障响应: ${INCIDENT_ID} ==========" | tee -a $LOG_FILE
echo "时间: $(date)" | tee -a $LOG_FILE
echo "操作人: $(whoami)" | tee -a $LOG_FILE

# 收集系统信息
echo "[INFO] 收集系统信息..." | tee -a $LOG_FILE
echo "--- 系统负载 ---" >> $LOG_FILE
uptime >> $LOG_FILE

echo "--- 内存使用 ---" >> $LOG_FILE
free -h >> $LOG_FILE

echo "--- 磁盘使用 ---" >> $LOG_FILE
df -h >> $LOG_FILE

echo "--- 服务状态 ---" >> $LOG_FILE
systemctl status nginx linsir-system mysql redis >> $LOG_FILE 2>&1

echo "--- 网络连接 ---" >> $LOG_FILE
netstat -tunlp >> $LOG_FILE

echo "--- 最近错误日志 ---" >> $LOG_FILE
tail -100 /var/log/linsir-system/error.log >> $LOG_FILE 2>&1

# 自动修复尝试
echo "[INFO] 尝试自动修复..." | tee -a $LOG_FILE

# 检查并重启异常服务
for service in nginx linsir-system mysql redis; do
    if ! systemctl is-active --quiet $service; then
        echo "[WARN] 服务 $service 未运行，尝试重启..." | tee -a $LOG_FILE
        systemctl restart $service >> $LOG_FILE 2>&1
        sleep 5
        if systemctl is-active --quiet $service; then
            echo "[OK] 服务 $service 重启成功" | tee -a $LOG_FILE
        else
            echo "[ERROR] 服务 $service 重启失败" | tee -a $LOG_FILE
        fi
    fi
done

# 健康检查
echo "[INFO] 执行健康检查..." | tee -a $LOG_FILE
HEALTH_STATUS=$(curl -s http://localhost:8080/actuator/health | grep -o '"status":"UP"' || echo "DOWN")
if [ "$HEALTH_STATUS" = '"status":"UP"' ]; then
    echo "[OK] 系统健康检查通过" | tee -a $LOG_FILE
else
    echo "[ERROR] 系统健康检查失败" | tee -a $LOG_FILE
fi

echo "========== 故障响应结束: $(date) ==========" | tee -a $LOG_FILE
echo "日志文件: ${LOG_FILE}"
```

---

## 4. 升级管理

### 4.1 升级流程

```
┌─────────────────────────────────────────────────────────────────┐
│                       升级管理流程                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐
│  升级申请    │ ◄── 提交升级申请单
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  影响评估    │ ◄── 评估影响范围、回滚方案
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  方案评审    │ ◄── 技术评审、安全评审
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  测试验证    │ ◄── 测试环境验证
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  升级审批    │ ◄── 获得升级授权
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  升级窗口    │ ◄── 选择低峰时段
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  升级执行    │ ◄── 执行升级操作
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  验证测试    │ ◄── 验证升级结果
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  升级完成    │ ◄── 更新文档、通知相关方
└─────────────┘
```

### 4.2 升级检查清单

| 阶段 | 检查项 | 状态 |
|------|--------|------|
| 升级前 | 已创建完整备份 | [ ] |
| 升级前 | 已验证回滚方案 | [ ] |
| 升级前 | 已通知相关方 | [ ] |
| 升级前 | 已准备升级包 | [ ] |
| 升级前 | 已检查依赖项 | [ ] |
| 升级中 | 按步骤执行升级 | [ ] |
| 升级中 | 记录升级日志 | [ ] |
| 升级后 | 验证服务状态 | [ ] |
| 升级后 | 验证功能正常 | [ ] |
| 升级后 | 验证监控正常 | [ ] |
| 升级后 | 更新配置文档 | [ ] |

### 4.3 版本发布管理

| 版本类型 | 发布频率 | 审批级别 | 测试要求 |
|----------|----------|----------|----------|
| 补丁版本 | 按需 | 运维主管 | 回归测试 |
| 小版本 | 每月 | 技术总监 | 完整测试 |
| 大版本 | 每季度 | CTO | 全面测试 |

### 4.4 升级脚本

```bash
#!/bin/bash
# upgrade-system.sh - 系统升级脚本

VERSION=$1
ENV=${2:-uat}

if [ -z "$VERSION" ]; then
    echo "用法: $0 <版本号> [环境]"
    exit 1
fi

echo "========== 系统升级 =========="
echo "版本: $VERSION"
echo "环境: $ENV"
echo "时间: $(date)"
echo "操作人: $(whoami)"
echo "=============================="

# 升级前检查
echo "[1/6] 升级前检查..."
# 检查备份
if [ ! -d "/backup/linsir-system-$(date +%Y%m%d)" ]; then
    echo "错误: 未找到今日备份，请先执行备份"
    exit 1
fi

# 检查磁盘空间
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "错误: 磁盘使用率超过80%，无法升级"
    exit 1
fi

# 下载升级包
echo "[2/6] 下载升级包..."
wget -q "https://nexus.linsir.com/repository/releases/com/linsir/system/${VERSION}/system-${VERSION}.jar" \
    -O /tmp/system-${VERSION}.jar

if [ $? -ne 0 ]; then
    echo "错误: 下载升级包失败"
    exit 1
fi

# 停止服务
echo "[3/6] 停止服务..."
systemctl stop linsir-system
sleep 5

# 备份当前版本
echo "[4/6] 备份当前版本..."
cp /opt/linsir-system/app.jar /opt/linsir-system/app.jar.backup.$(date +%Y%m%d%H%M%S)

# 部署新版本
echo "[5/6] 部署新版本..."
cp /tmp/system-${VERSION}.jar /opt/linsir-system/app.jar
chown linsir:linsir /opt/linsir-system/app.jar
chmod 755 /opt/linsir-system/app.jar

# 启动服务
echo "[6/6] 启动服务..."
systemctl start linsir-system
sleep 10

# 健康检查
echo "验证升级结果..."
HEALTH_STATUS=$(curl -s http://localhost:8080/actuator/health | grep -o '"status":"UP"' || echo "DOWN")
if [ "$HEALTH_STATUS" = '"status":"UP"' ]; then
    echo "✅ 升级成功！当前版本: $VERSION"
    echo "升级完成时间: $(date)"
else
    echo "❌ 升级失败，服务未正常启动"
    echo "执行回滚..."
    # 回滚逻辑
    exit 1
fi
```

---

## 5. 容量管理

### 5.1 容量规划

| 资源类型 | 当前使用 | 告警阈值 | 扩容阈值 | 规划周期 |
|----------|----------|----------|----------|----------|
| CPU | 监控中 | 70% | 80% | 季度 |
| 内存 | 监控中 | 80% | 90% | 季度 |
| 磁盘 | 监控中 | 80% | 85% | 月度 |
| 带宽 | 监控中 | 70% | 80% | 季度 |
| 数据库连接 | 监控中 | 70% | 80% | 季度 |

### 5.2 扩容流程

```
容量告警
    │
    ▼
┌─────────────┐
│  容量评估    │ ◄── 分析增长趋势
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  扩容方案    │ ◄── 制定扩容计划
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  方案评审    │ ◄── 技术+成本评审
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  资源申请    │ ◄── 申请云资源
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  扩容实施    │ ◄── 执行扩容
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  效果验证    │ ◄── 验证扩容效果
└─────────────┘
```

---

## 6. 运维工具

### 6.1 常用命令速查

| 场景 | 命令 | 说明 |
|------|------|------|
| 查看日志 | `tail -f /var/log/linsir-system/app.log` | 实时查看日志 |
| 搜索日志 | `grep "ERROR" app.log \| tail -20` | 搜索错误日志 |
| 查看进程 | `ps aux \| grep java` | 查看Java进程 |
| 查看端口 | `netstat -tunlp \| grep 8080` | 查看端口占用 |
| 查看连接 | `ss -s` | 查看连接统计 |
| 性能分析 | `top -p $(pgrep java)` | 查看进程资源 |
| 线程分析 | `jstack <pid> > thread.dump` | 导出线程栈 |
| GC分析 | `jstat -gc <pid> 1000` | 监控GC情况 |

### 6.2 运维自动化

```bash
#!/bin/bash
# ops-automation.sh - 运维自动化脚本

ACTION=$1

case $ACTION in
    "status")
        echo "=== 服务状态 ==="
        systemctl status nginx linsir-system mysql redis --no-pager
        ;;
    "restart")
        echo "=== 重启服务 ==="
        systemctl restart linsir-system
        sleep 5
        systemctl status linsir-system --no-pager
        ;;
    "logs")
        echo "=== 最近日志 ==="
        journalctl -u linsir-system -n 100 --no-pager
        ;;
    "clean")
        echo "=== 清理日志 ==="
        find /var/log/linsir-system -name "*.log.*" -mtime +30 -delete
        echo "日志清理完成"
        ;;
    "backup")
        echo "=== 执行备份 ==="
        /opt/scripts/backup-database.sh
        /opt/scripts/backup-files.sh
        ;;
    *)
        echo "用法: $0 {status|restart|logs|clean|backup}"
        exit 1
        ;;
esac
```

---

## 7. 运维文档

### 7.1 文档清单

| 文档名称 | 更新频率 | 负责人 |
|----------|----------|--------|
| 系统架构图 | 变更时 | 运维主管 |
| 部署文档 | 变更时 | 运维工程师 |
| 运维手册 | 月度 | 运维工程师 |
| 故障案例库 | 实时 | 全体运维 |
| 应急预案 | 季度 | 运维主管 |
| 容量报告 | 月度 | 运维工程师 |

### 7.2 知识库管理

```
知识库结构:
├── 系统文档
│   ├── 架构设计
│   ├── 部署指南
│   └── 配置说明
├── 运维手册
│   ├── 日常运维
│   ├── 故障处理
│   └── 升级管理
├── 故障案例
│   ├── P0故障
│   ├── P1故障
│   └── 常见问题
└── 应急预案
    ├── 服务宕机
    ├── 数据丢失
    └── 网络故障
```

---

## 8. 联系信息

### 8.1 内部联系

| 角色 | 姓名 | 电话 | 邮箱 |
|------|------|------|------|
| 运维主管 | 周九 | 138-xxxx-xxxx | zhoujiu@linsir.com |
| 系统运维 | 吴十 | 139-xxxx-xxxx | wushi@linsir.com |
| 数据库运维 | 郑十一 | 137-xxxx-xxxx | zhengshiyi@linsir.com |
| 开发负责人 | 张三 | 136-xxxx-xxxx | zhangsan@linsir.com |

### 8.2 外部支持

| 服务商 | 支持内容 | 联系方式 |
|--------|----------|----------|
| 云服务商 | 基础设施 | 7×24小时热线 |
| 安全厂商 | 安全防护 | 工作日9-18点 |
| 数据库厂商 | 数据库支持 | 7×24小时热线 |

---

**文档创建:** 2026-05-12  
**最后更新:** 2026-05-12  
**运维负责人:** 周九
