# 业务流程图

**文档编号：** SYS-RA-BP-006  
**版本：** 1.0  
**日期：** 2026-03-08  
**编制：** 项目经理

---

## 一、流程图说明

本文档使用Mermaid语法绘制业务流程图，可导出为图片使用。

---

## 二、用户入职流程图

```mermaid
flowchart TD
    Start([开始]) --> Receive[收到入职通知]
    Receive --> Create[创建用户账号]
    Create --> AssignRole[分配基础角色]
    AssignRole --> NotifyDept[通知部门管理员]
    NotifyDept --> AssignPerm[分配部门权限]
    AssignPerm --> SendEmail[发送激活邮件]
    SendEmail --> Activate[用户激活账号]
    Activate --> FirstLogin[首次登录]
    FirstLogin --> ForceChange[强制修改密码]
    ForceChange --> End([完成])
    
    Create -->|失败| Error1[记录错误]
    Error1 --> NotifyHR[通知HR]
    
    Activate -->|链接过期| Resend[重新发送]
    Resend --> SendEmail
```

---

## 三、用户离职流程图

```mermaid
flowchart TD
    Start([开始]) --> Receive[收到离职通知]
    Receive --> Confirm[确认工作交接]
    Confirm --> Transfer[数据转移]
    Transfer --> Disable[禁用用户账号]
    Disable --> Revoke[回收所有权限]
    Revoke --> Log[记录审计日志]
    Log --> Notify[通知相关人员]
    Notify --> End([完成])
    
    Confirm -->|紧急| Emergency[立即禁用]
    Emergency --> Disable
```

---

## 四、权限申请流程图

```mermaid
flowchart TD
    Start([开始]) --> Apply[提交权限申请]
    Apply --> Review[部门管理员审批]
    Review --> Decision{审批结果}
    Decision -->|通过| Assign[系统管理员分配权限]
    Decision -->|拒绝| NotifyReject[通知申请人]
    Decision -->|转交| Transfer[转上级审批]
    Transfer --> Review
    Assign --> NotifyAccept[通知申请人]
    NotifyReject --> End1([结束])
    NotifyAccept --> End1
```

---

## 五、用户登录流程图

```mermaid
flowchart TD
    Start([开始]) --> Input[输入用户名密码]
    Input --> Validate{验证账号}
    Validate -->|账号不存在| Error1[提示账号错误]
    Validate -->|账号锁定| Error2[提示账号锁定]
    Validate -->|账号禁用| Error3[提示账号禁用]
    Validate -->|正常| CheckPwd[验证密码]
    CheckPwd -->|密码错误| FailCount[失败次数+1]
    FailCount -->|失败5次| Lock[锁定账号]
    FailCount -->|失败<5次| Error4[提示密码错误]
    CheckPwd -->|密码正确| CheckMFA{需要二次验证}
    CheckMFA -->|是| MFA[二次验证]
    CheckMFA -->|否| Success[登录成功]
    MFA -->|验证成功| Success
    MFA -->|验证失败| Error5[验证失败]
    Success --> CheckFirst{首次登录}
    CheckFirst -->|是| ForceChange[强制修改密码]
    CheckFirst -->|否| Home[进入工作台]
    ForceChange --> Home
    
    Error1 --> Input
    Error4 --> Input
```

---

## 六、密码重置流程图

```mermaid
flowchart TD
    Start([开始]) --> Click[点击忘记密码]
    Click --> InputEmail[输入注册邮箱]
    InputEmail --> SendCode[发送验证码]
    SendCode --> InputCode[输入验证码]
    InputCode --> Validate{验证}
    Validate -->|错误| Error[提示错误]
    Validate -->|正确| Reset[设置新密码]
    Reset --> CheckRule{符合规则}
    CheckRule -->|否| Error2[提示规则]
    CheckRule -->|是| Confirm[确认修改]
    Confirm --> Success[修改成功]
    Success --> Login[返回登录]
    
    Error --> InputCode
    Error2 --> Reset
```

---

## 七、SSO登录流程图

```mermaid
sequenceDiagram
    participant User as 用户
    participant App as 第三方应用
    participant SSO as System平台
    participant Auth as 认证服务
    
    User->>App: 访问应用
    App->>SSO: 重定向到登录页
    SSO->>User: 显示登录页
    User->>SSO: 输入凭证
    SSO->>Auth: 验证身份
    Auth-->>SSO: 返回Token
    SSO-->>User: 登录成功
    SSO->>App: 回调授权码
    App->>SSO: 换取Token
    SSO-->>App: 返回用户信息
    App->>User: 登录成功，显示应用
```

---

## 八、流程图文件

以上流程图已保存为独立的 `.mmd` 文件，可导出为图片：

| 流程 | MMD文件 | PNG文件 |
|-----|---------|---------|
| 用户入职 | `user-onboarding-process.mmd` | `user-onboarding-process.png` |
| 用户离职 | `user-offboarding-process.mmd` | `user-offboarding-process.png` |
| 权限申请 | `permission-application-process.mmd` | `permission-application-process.png` |
| 用户登录 | `user-login-process.mmd` | `user-login-process.png` |
| 密码重置 | `password-reset-process.mmd` | `password-reset-process.png` |
| SSO登录 | `sso-login-process.mmd` | `sso-login-process.png` |

---

**文档整理时间：** 2026-03-08
