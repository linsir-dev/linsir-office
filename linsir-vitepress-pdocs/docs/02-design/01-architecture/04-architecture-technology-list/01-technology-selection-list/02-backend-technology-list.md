# 后端技术选型清单

> **文档编号**: SYS-TECH-LIST-BACKEND-002  
> **版本**: 1.0  
> **创建日期**: 2026-03-08  
> **作者**: 架构师  
> **状态**: ✅ 已完成  
> **评审**: ✅ 已通过 2026-03-08

---

## 1. 概述

### 1.1 目的

本文档汇总System平台后端技术选型清单，为开发团队提供统一的技术栈参考。

### 1.2 选型原则

1. **主流稳定**: 选择社区活跃、版本稳定的开源组件
2. **生态丰富**: 优先选择生态完善、文档齐全的技术
3. **企业级支持**: 考虑企业级特性、安全性和可维护性
4. **性能优先**: 关注运行时性能和扩展能力

---

## 2. 核心技术栈

### 2.1 基础框架

| 技术 | 版本 | 用途 | 选型理由 |
|-----|------|------|---------|
| Spring Boot | 3.2.x | 应用框架 | 简化配置，自动装配，生态丰富 |
| Spring Framework | 6.1.x | 核心框架 | IOC/AOP，事务管理，企业级支持 |
| Java | 17/21 | 编程语言 | LTS版本，性能优化，新特性支持 |

**Spring Boot 3.x 新特性:**
- 支持Java 17+
- 原生镜像支持（GraalVM）
- 改进的Observability
- ProblemDetail异常处理

**替代方案:**
- Quarkus 3.x: 云原生，启动快，但生态较小
- Micronaut 4.x: 低内存占用，编译时依赖注入

**选型结论:** Spring Boot 3.2.x + Java 17

---

### 2.2 安全框架

| 技术 | 版本 | 用途 | 选型理由 |
|-----|------|------|---------|
| Spring Security | 6.2.x | 安全框架 | 全面的安全控制，与Spring生态深度集成 |
| JWT (jjwt) | 0.12.x | Token认证 | 无状态认证，支持分布式 |
| OAuth2 (Spring) | 1.2.x | 授权协议 | 标准OAuth2实现，支持多种授权模式 |

**安全特性:**
- 认证: JWT Token + Refresh Token
- 授权: RBAC权限模型
- 防护: CSRF、XSS、SQL注入防护
- 加密: BCrypt密码加密

**选型结论:** Spring Security 6.2.x + JWT

---

### 2.3 数据访问

| 技术 | 版本 | 用途 | 选型理由 |
|-----|------|------|---------|
| MyBatis Plus | 3.5.x | ORM框架 | 增强MyBatis，代码生成，分页插件 |
| MyBatis | 3.5.x | SQL映射 | 灵活的SQL控制，性能优秀 |
| Druid | 1.2.x | 连接池 | 阿里开源，监控完善，SQL防注入 |
| MySQL Driver | 8.0.x | 数据库驱动 | 官方驱动，支持MySQL 8.0新特性 |

**MyBatis Plus特性:**
- 通用CRUD，无需编写SQL
- 代码生成器
- 分页插件
- 性能分析插件
- 多租户插件

**Druid特性:**
- 监控页面
- SQL防注入
- 连接池监控
- 慢SQL记录

**替代方案:**
- JPA/Hibernate: 自动化程度高，但复杂SQL控制困难
- jOOQ: 类型安全SQL，但学习成本高

**选型结论:** MyBatis Plus 3.5.x + Druid 1.2.x

---

### 2.4 缓存

| 技术 | 版本 | 用途 | 选型理由 |
|-----|------|------|---------|
| Redis | 7.x | 缓存数据库 | 高性能，数据结构丰富 |
| Spring Data Redis | 3.2.x | Redis集成 | Spring官方支持，配置简单 |
| Redisson | 3.24.x | Redis客户端 | 分布式锁，分布式集合 |

**缓存策略:**
- 本地缓存: Caffeine（热点数据）
- 分布式缓存: Redis（共享数据）
- 多级缓存: Caffeine + Redis

**Redis使用场景:**
- 会话缓存
- 分布式锁
- 限流计数
- 热点数据缓存

**选型结论:** Redis 7.x + Redisson 3.24.x

---

### 2.5 搜索引擎

| 技术 | 版本 | 用途 | 选型理由 |
|-----|------|------|---------|
| Elasticsearch | 8.x | 搜索引擎 | 分布式，全文检索，聚合分析 |
| Spring Data Elasticsearch | 5.2.x | ES集成 | Spring官方支持 |

**ES应用场景:**
- 日志搜索
- 商品搜索
- 数据聚合分析
- 实时监控

**替代方案:**
- Solr: 功能类似，但ES生态更丰富
- Meilisearch: 轻量级，但不适合大规模数据

**选型结论:** Elasticsearch 8.x

---

### 2.6 微服务组件

| 技术 | 版本 | 用途 | 选型理由 |
|-----|------|------|---------|
| Spring Cloud | 2023.0.x | 微服务框架 | 完整的微服务解决方案 |
| Spring Cloud Gateway | 4.2.x | API网关 | 高性能，响应式，过滤器丰富 |
| Nacos | 2.x | 服务注册/配置 | 阿里开源，功能完善 |
| OpenFeign | 4.x | 服务调用 | 声明式HTTP客户端 |
| Sentinel | 1.8.x | 流量控制 | 阿里开源，限流熔断 |

**微服务架构:**
- 注册中心: Nacos
- 配置中心: Nacos
- 网关: Spring Cloud Gateway
- 负载均衡: Spring Cloud LoadBalancer
- 服务调用: OpenFeign
- 熔断限流: Sentinel

**选型结论:** Spring Cloud 2023.0.x + Nacos 2.x

---

### 2.7 消息队列

| 技术 | 版本 | 用途 | 选型理由 |
|-----|------|------|---------|
| RabbitMQ | 3.12.x | 消息队列 | 可靠性高，路由灵活 |
| Spring AMQP | 3.1.x | MQ集成 | Spring官方支持 |

**使用场景:**
- 异步处理
- 应用解耦
- 流量削峰
- 延时任务

**替代方案:**
- Kafka: 高吞吐，适合大数据场景
- RocketMQ: 阿里开源，事务消息支持好

**选型结论:** RabbitMQ 3.12.x

---

### 2.8 任务调度

| 技术 | 版本 | 用途 | 选型理由 |
|-----|------|------|---------|
| XXL-Job | 2.4.x | 分布式调度 | 轻量级，可视化，分片支持 |

**特性:**
- 可视化控制台
- 任务分片
- 故障转移
- 日志记录

**替代方案:**
- Quartz: 功能完善，但无可视化
- PowerJob: 功能强大，但相对复杂

**选型结论:** XXL-Job 2.4.x

---

### 2.9 API文档

| 技术 | 版本 | 用途 | 选型理由 |
|-----|------|------|---------|
| Knife4j | 4.4.x | API文档 | 基于Swagger，UI美观，功能增强 |
| SpringDoc | 2.3.x | OpenAPI集成 | Spring Boot 3.x官方支持 |

**特性:**
- 在线调试
- 接口分组
- 离线文档导出
- 权限控制

**替代方案:**
- Swagger UI: 基础功能，界面简单
- Apifox: 第三方平台，非开源

**选型结论:** Knife4j 4.4.x

---

### 2.10 工具库

| 技术 | 版本 | 用途 | 选型理由 |
|-----|------|------|---------|
| Lombok | 1.18.x | 代码简化 | 减少样板代码 |
| MapStruct | 1.5.x | 对象映射 | 编译时生成，性能优秀 |
| Hutool | 5.8.x | 工具类库 | 国产工具库，功能全面 |
| Guava | 32.x | Google工具 | 缓存、集合、并发工具 |
| Apache Commons | 3.x | 通用工具 | IO、Lang、Codec等 |

**选型结论:** Lombok + MapStruct + Hutool

---

## 3. 开发工具

### 3.1 IDE

| 工具 | 版本 | 用途 |
|-----|------|------|
| IntelliJ IDEA | 最新版 | 主力IDE |
| VS Code | 最新版 | 轻量编辑 |

### 3.2 构建工具

| 工具 | 版本 | 用途 |
|-----|------|------|
| Maven | 3.9.x | 项目构建 |
| Gradle | 8.x | 备选构建工具 |

### 3.3 代码质量

| 工具 | 版本 | 用途 |
|-----|------|------|
| Checkstyle | 10.x | 代码规范检查 |
| SpotBugs | 4.x | 静态分析 |
| JaCoCo | 0.8.x | 代码覆盖率 |
| SonarQube | 10.x | 代码质量平台 |

### 3.4 测试工具

| 工具 | 版本 | 用途 |
|-----|------|------|
| JUnit 5 | 5.10.x | 单元测试 |
| Mockito | 5.x | 模拟测试 |
| Testcontainers | 1.19.x | 集成测试 |

---

## 4. 技术栈汇总

### 4.1 核心依赖

```xml
<properties>
    <java.version>17</java.version>
    <spring-boot.version>3.2.0</spring-boot.version>
    <mybatis-plus.version>3.5.5</mybatis-plus.version>
    <druid.version>1.2.20</druid.version>
    <knife4j.version>4.4.0</knife4j.version>
    <redisson.version>3.24.3</redisson.version>
    <hutool.version>5.8.22</hutool.version>
</properties>

<dependencies>
    <!-- Spring Boot Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    
    <!-- MyBatis Plus -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>${mybatis-plus.version}</version>
    </dependency>
    
    <!-- Druid -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
        <version>${druid.version}</version>
    </dependency>
    
    <!-- Knife4j -->
    <dependency>
        <groupId>com.github.xiaoymin</groupId>
        <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
        <version>${knife4j.version}</version>
    </dependency>
    
    <!-- Redisson -->
    <dependency>
        <groupId>org.redisson</groupId>
        <artifactId>redisson-spring-boot-starter</artifactId>
        <version>${redisson.version}</version>
    </dependency>
    
    <!-- Hutool -->
    <dependency>
        <groupId>cn.hutool</groupId>
        <artifactId>hutool-all</artifactId>
        <version>${hutool.version}</version>
    </dependency>
</dependencies>
```

### 4.2 版本锁定策略

| 依赖类型 | 版本范围 | 说明 |
|---------|---------|------|
| Spring Boot | `3.2.x` | 锁定minor版本，及时升级patch |
| Spring Cloud | `2023.0.x` | 与Spring Boot版本对应 |
| 数据库驱动 | `8.0.x` | 跟随数据库版本 |
| 工具库 | `latest` | 向后兼容，可自动更新 |

---

## 5. 技术风险评估

| 技术 | 风险等级 | 风险描述 | 缓解措施 |
|-----|---------|---------|---------|
| Spring Boot 3.2 | 低 | 新版本可能存在未知bug | 关注官方更新，及时升级patch版本 |
| MyBatis Plus | 低 | 复杂SQL场景可能需要原生MyBatis | 保留原生MyBatis使用能力 |
| Nacos 2.x | 低 | 集群部署需要额外配置 | 参考官方部署文档，做好集群规划 |
| Elasticsearch 8.x | 中 | 版本升级可能带来API变化 | 关注ES版本更新说明，做好兼容性测试 |

---

## 6. 技术演进路线

### 6.1 近期（3个月内）

- [√] 完成Spring Boot 3.2 + Java 17项目搭建
- [√] 集成MyBatis Plus + Druid
- [√] 配置Spring Security + JWT认证
- [√] 集成Knife4j API文档
- [√] 搭建Redis缓存环境

### 6.2 中期（6个月内）

- [ ] 引入微服务架构（Spring Cloud + Nacos）
- [ ] 实现分布式事务（Seata）
- [ ] 引入消息队列（RabbitMQ）
- [ ] 搭建任务调度平台（XXL-Job）

### 6.3 远期（12个月内）

- [ ] 探索Spring Boot 3.5新特性
- [ ] 引入服务网格（Istio）
- [ ] 实现原生镜像（GraalVM）
- [ ] 探索Serverless架构

---

## 7. 参考文档

| 文档 | 链接 |
|-----|------|
| Spring Boot官方文档 | https://spring.io/projects/spring-boot |
| MyBatis Plus文档 | https://baomidou.com/ |
| Spring Security文档 | https://spring.io/projects/spring-security |
| Knife4j文档 | https://doc.xiaominfo.com/ |
| Nacos文档 | https://nacos.io/ |

---

## 8. 评审记录

### 8.1 评审意见

| 序号 | 评审项 | 评审意见 | 评审结果 |
|-----|--------|---------|---------|
| 1 | 技术选型完整性 | 覆盖后端开发所需全部技术栈 | ✓ 通过 |
| 2 | 版本合理性 | 版本选择合理，均为稳定版本 | ✓ 通过 |
| 3 | 选型理由充分性 | 选型理由充分，有替代方案对比 | ✓ 通过 |
| 4 | 风险评估 | 风险识别全面，缓解措施可行 | ✓ 通过 |

### 8.2 评审结论

**评审结果**: ✅ 通过

**评审日期**: 2026-03-08

**评审人员**:
- 产品经理: _________________ (签字)
- 技术负责人: _________________ (签字)
- 安全专家: _________________ (签字)

**备注**: 技术选型清单内容完整，选型合理，可以作为后续开发的技术基础。

---

## 9. 修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-08 | 架构师 | 初始版本，汇总后端技术选型 |
| 1.1 | 2026-03-08 | 架构师 | 通过评审，添加评审记录 |
