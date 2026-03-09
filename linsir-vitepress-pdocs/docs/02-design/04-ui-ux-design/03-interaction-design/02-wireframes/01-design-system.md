# 设计系统

**文档编号**: SYS-UX-IX-005  
**版本**: 1.0  
**日期**: 2026-03-09  
**编制**: UI/UX设计师  
**状态**: ⏳ 进行中

---

## 一、文档概述

### 1.1 文档目的

本文档定义系统的视觉设计规范，包括颜色系统、字体系统、间距系统、组件规范等，确保视觉设计的一致性和可维护性。

### 1.2 参考文档

- [视觉偏好调研](../01-user-research/04-visual-preference-research.md)
- [线框图设计](02-wireframe-design.md)
- [交互说明文档](03-interaction-specification.md)

---

## 二、设计原则

### 2.1 核心原则

| 原则 | 描述 | 设计体现 |
|------|------|---------|
| **清晰** | 信息层级清晰，易于理解 | 合理的对比度、明确的信息层级 |
| **一致** | 视觉元素统一 | 统一的颜色、字体、组件 |
| **高效** | 减少视觉干扰，提高效率 | 简洁的界面、突出的操作 |
| **专业** | 体现B端系统的专业性 | 稳重的配色、规范的排版 |

### 2.2 设计语言

**风格定位**: 现代商务风格  
**设计关键词**: 专业、简洁、高效、可靠

---

## 三、颜色系统

### 3.1 主色调

#### 3.1.1 品牌色

| 色阶 | 色值 | 用途 |
|------|------|------|
| **Brand-50** | #E6F7FF | 最浅背景 |
| **Brand-100** | #BAE7FF | 浅色背景 |
| **Brand-200** | #91D5FF | 悬停背景 |
| **Brand-300** | #69C0FF | 禁用状态 |
| **Brand-400** | #40A9FF | 悬停状态 |
| **Brand-500** | #1890FF | **主色** |
| **Brand-600** | #096DD9 | 点击状态 |
| **Brand-700** | #0050B3 | 深色文字 |
| **Brand-800** | #003A8C | 更深色 |
| **Brand-900** | #002766 | 最深色 |

**主色应用**:
- 主要按钮
- 链接文字
- 选中状态
- 关键数据高亮

#### 3.1.2 中性色

| 色阶 | 色值 | 用途 |
|------|------|------|
| **Gray-50** | #F5F5F5 | 页面背景 |
| **Gray-100** | #F0F0F0 | 卡片背景 |
| **Gray-200** | #D9D9D9 | 边框、分割线 |
| **Gray-300** | #BFBFBF | 禁用文字 |
| **Gray-400** | #8C8C8C | 次要文字 |
| **Gray-500** | #595959 | 辅助文字 |
| **Gray-600** | #434343 | 正文文字 |
| **Gray-700** | #262626 | **主文字** |
| **Gray-800** | #1F1F1F | 标题文字 |
| **Gray-900** | #141414 | 最深文字 |

**中性色应用**:
- 文字颜色
- 背景颜色
- 边框颜色
- 分割线

### 3.2 功能色

#### 3.2.1 成功色

| 色阶 | 色值 | 用途 |
|------|------|------|
| **Success-50** | #F6FFED | 成功背景 |
| **Success-100** | #D9F7BE | 成功浅色 |
| **Success-500** | #52C41A | **成功主色** |
| **Success-600** | #389E0D | 成功深色 |

**应用**: 成功提示、完成状态、正向数据

#### 3.2.2 警告色

| 色阶 | 色值 | 用途 |
|------|------|------|
| **Warning-50** | #FFFBE6 | 警告背景 |
| **Warning-100** | #FFF1B8 | 警告浅色 |
| **Warning-500** | #FAAD14 | **警告主色** |
| **Warning-600** | #D48806 | 警告深色 |

**应用**: 警告提示、待处理状态、提醒信息

#### 3.2.3 错误色

| 色阶 | 色值 | 用途 |
|------|------|------|
| **Error-50** | #FFF2F0 | 错误背景 |
| **Error-100** | #FFCCC7 | 错误浅色 |
| **Error-500** | #FF4D4F | **错误主色** |
| **Error-600** | #CF1322 | 错误深色 |

**应用**: 错误提示、失败状态、删除操作、必填提示

#### 3.2.4 信息色

| 色阶 | 色值 | 用途 |
|------|------|------|
| **Info-50** | #E6F7FF | 信息背景 |
| **Info-100** | #BAE7FF | 信息浅色 |
| **Info-500** | #1890FF | **信息主色** |
| **Info-600** | #096DD9 | 信息深色 |

**应用**: 信息提示、帮助信息、链接

### 3.3 颜色使用规范

#### 3.3.1 文字颜色

| 场景 | 颜色 | 色值 |
|------|------|------|
| **主文字** | Gray-700 | #262626 |
| **次要文字** | Gray-500 | #595959 |
| **辅助文字** | Gray-400 | #8C8C8C |
| **禁用文字** | Gray-300 | #BFBFBF |
| **链接文字** | Brand-500 | #1890FF |
| **错误文字** | Error-500 | #FF4D4F |

#### 3.3.2 背景颜色

| 场景 | 颜色 | 色值 |
|------|------|------|
| **页面背景** | Gray-50 | #F5F5F5 |
| **卡片背景** | White | #FFFFFF |
| **悬停背景** | Gray-100 | #F0F0F0 |
| **选中背景** | Brand-50 | #E6F7FF |
| **禁用背景** | Gray-100 | #F0F0F0 |

#### 3.3.3 边框颜色

| 场景 | 颜色 | 色值 |
|------|------|------|
| **默认边框** | Gray-200 | #D9D9D9 |
| **悬停边框** | Brand-400 | #40A9FF |
| **聚焦边框** | Brand-500 | #1890FF |
| **错误边框** | Error-500 | #FF4D4F |
| **分割线** | Gray-200 | #D9D9D9 |

---

## 四、字体系统

### 4.1 字体家族

#### 4.1.1 中文字体

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```

**优先顺序**:
1. 系统默认字体（-apple-system, BlinkMacSystemFont）
2. Windows字体（Segoe UI）
3. 通用字体（Roboto, Helvetica Neue, Arial）
4. 备用字体（Noto Sans, sans-serif）

#### 4.1.2 英文字体

与中文使用相同字体栈，系统会自动选择合适的英文字体。

#### 4.1.3 等宽字体

```css
font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
```

**应用**: 代码显示、数字对齐

### 4.2 字体大小

| 级别 | 大小 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| **H1** | 38px | 1.4 | 600 | 页面大标题 |
| **H2** | 30px | 1.4 | 600 | 页面标题 |
| **H3** | 24px | 1.4 | 600 | 区块标题 |
| **H4** | 20px | 1.5 | 600 | 卡片标题 |
| **H5** | 16px | 1.5 | 600 | 小标题 |
| **Body** | 14px | 1.5 | 400 | 正文 |
| **Small** | 12px | 1.5 | 400 | 辅助文字 |

### 4.3 字重

| 字重 | 数值 | 用途 |
|------|------|------|
| **Regular** | 400 | 正文 |
| **Medium** | 500 | 强调文字 |
| **Semibold** | 600 | 标题 |
| **Bold** | 700 | 重点强调 |

### 4.4 行高

| 场景 | 行高 | 说明 |
|------|------|------|
| **标题** | 1.4 | 紧凑，突出标题 |
| **正文** | 1.5 | 舒适阅读 |
| **宽松** | 1.8 | 大段文字 |

---

## 五、间距系统

### 5.1 基础间距

| 名称 | 数值 | 用途 |
|------|------|------|
| **xs** | 4px | 图标间距、紧凑间距 |
| **sm** | 8px | 小间距、按钮内边距 |
| **md** | 16px | 标准间距、卡片内边距 |
| **lg** | 24px | 大间距、页面边距 |
| **xl** | 32px | 区块间距 |
| **2xl** | 48px | 大区块间距 |

### 5.2 间距应用

#### 5.2.1 页面间距

| 元素 | 间距 |
|------|------|
| 页面边距 | 24px (lg) |
| 区块间距 | 24px (lg) |
| 卡片间距 | 16px (md) |

#### 5.2.2 组件间距

| 元素 | 间距 |
|------|------|
| 按钮内边距 | 8px 16px (sm md) |
| 输入框内边距 | 8px 12px (sm) |
| 卡片内边距 | 16px (md) |
| 表单字段间距 | 24px (lg) |

#### 5.2.3 文字间距

| 元素 | 间距 |
|------|------|
| 标题下边距 | 16px (md) |
| 段落下边距 | 16px (md) |
| 列表项间距 | 8px (sm) |

---

## 六、阴影系统

### 6.1 阴影层级

| 层级 | 阴影 | 用途 |
|------|------|------|
| **Shadow-1** | 0 1px 2px rgba(0,0,0,0.05) | 卡片默认 |
| **Shadow-2** | 0 4px 6px rgba(0,0,0,0.05) | 悬停状态 |
| **Shadow-3** | 0 10px 15px rgba(0,0,0,0.1) | 下拉菜单 |
| **Shadow-4** | 0 20px 25px rgba(0,0,0,0.1) | 弹窗 |

### 6.2 阴影应用

```css
/* 卡片 */
.card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* 下拉菜单 */
.dropdown {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* 弹窗 */
.modal {
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
}
```

---

## 七、圆角系统

### 7.1 圆角规范

| 名称 | 数值 | 用途 |
|------|------|------|
| **None** | 0px | 表格、列表 |
| **Small** | 4px | 按钮、输入框、标签 |
| **Medium** | 8px | 卡片、弹窗 |
| **Large** | 12px | 大卡片、模态框 |
| **Full** | 9999px | 圆形按钮、头像 |

### 7.2 圆角应用

```css
/* 按钮 */
.button {
  border-radius: 4px;
}

/* 卡片 */
.card {
  border-radius: 8px;
}

/* 弹窗 */
.modal {
  border-radius: 8px;
}

/* 头像 */
.avatar {
  border-radius: 9999px;
}
```

---

## 八、组件规范

### 8.1 按钮

#### 8.1.1 按钮类型

**主要按钮**:
```css
.btn-primary {
  background: #1890FF;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
}
```

**次要按钮**:
```css
.btn-secondary {
  background: #FFFFFF;
  color: #262626;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
}
```

**文字按钮**:
```css
.btn-text {
  background: transparent;
  color: #1890FF;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
}
```

**危险按钮**:
```css
.btn-danger {
  background: #FF4D4F;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
}
```

#### 8.1.2 按钮尺寸

| 尺寸 | 高度 | 内边距 | 字体 |
|------|------|--------|------|
| **Small** | 24px | 4px 8px | 12px |
| **Medium** | 32px | 8px 16px | 14px |
| **Large** | 40px | 12px 24px | 16px |

### 8.2 输入框

```css
.input {
  height: 32px;
  padding: 8px 12px;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  font-size: 14px;
  color: #262626;
  background: #FFFFFF;
}

.input:hover {
  border-color: #40A9FF;
}

.input:focus {
  border-color: #1890FF;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.input.error {
  border-color: #FF4D4F;
}

.input:disabled {
  background: #F0F0F0;
  color: #BFBFBF;
}
```

### 8.3 卡片

```css
.card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #D9D9D9;
  margin-bottom: 16px;
}

.card-body {
  /* 内容区域 */
}
```

### 8.4 表格

```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #262626;
  background: #F5F5F5;
  border-bottom: 1px solid #D9D9D9;
}

.table td {
  padding: 12px 16px;
  color: #262626;
  border-bottom: 1px solid #D9D9D9;
}

.table tr:hover {
  background: #F5F5F5;
}
```

### 8.5 标签

```css
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.tag-default {
  background: #F5F5F5;
  color: #262626;
}

.tag-primary {
  background: #E6F7FF;
  color: #1890FF;
}

.tag-success {
  background: #F6FFED;
  color: #52C41A;
}

.tag-warning {
  background: #FFFBE6;
  color: #FAAD14;
}

.tag-error {
  background: #FFF2F0;
  color: #FF4D4F;
}
```

---

## 九、图标系统

### 9.1 图标规范

**图标库**: Ant Design Icons  
**图标尺寸**:
- Small: 12px
- Medium: 16px
- Large: 24px

### 9.2 图标使用

| 场景 | 尺寸 | 颜色 |
|------|------|------|
| 按钮内图标 | 16px | 继承按钮颜色 |
| 菜单图标 | 16px | Gray-600 |
| 提示图标 | 24px | 对应功能色 |
| 状态图标 | 12px | 对应功能色 |

---

## 十、响应式断点

### 10.1 断点定义

| 断点 | 宽度 | 设备 |
|------|------|------|
| **xs** | < 576px | 手机竖屏 |
| **sm** | ≥ 576px | 手机横屏 |
| **md** | ≥ 768px | 平板 |
| **lg** | ≥ 992px | 小型桌面 |
| **xl** | ≥ 1200px | 标准桌面 |
| **xxl** | ≥ 1600px | 大屏桌面 |

### 10.2 响应式规则

| 元素 | xs | sm | md | lg | xl | xxl |
|------|----|----|----|----|----|-----|
| 侧边栏 | 隐藏 | 隐藏 | 240px | 240px | 240px | 240px |
| 内容边距 | 16px | 16px | 24px | 24px | 24px | 32px |
| 卡片列数 | 1 | 1 | 2 | 3 | 4 | 4 |

---

## 十一、设计Token

### 11.1 Token命名规范

```
{类别}-{属性}-{状态}

示例:
- color-primary-500
- color-text-primary
- spacing-md
- font-size-body
- border-radius-small
```

### 11.2 Token列表

```javascript
const tokens = {
  // 颜色
  color: {
    primary: {
      50: '#E6F7FF',
      100: '#BAE7FF',
      500: '#1890FF',
      600: '#096DD9',
    },
    text: {
      primary: '#262626',
      secondary: '#595959',
      tertiary: '#8C8C8C',
    },
    background: {
      page: '#F5F5F5',
      card: '#FFFFFF',
    },
    border: '#D9D9D9',
  },
  
  // 间距
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  
  // 字体
  fontSize: {
    h1: '38px',
    h2: '30px',
    h3: '24px',
    h4: '20px',
    body: '14px',
    small: '12px',
  },
  
  // 圆角
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    full: '9999px',
  },
  
  // 阴影
  shadow: {
    1: '0 1px 2px rgba(0,0,0,0.05)',
    2: '0 4px 6px rgba(0,0,0,0.05)',
    3: '0 10px 15px rgba(0,0,0,0.1)',
    4: '0 20px 25px rgba(0,0,0,0.1)',
  },
};
```

---

## 十二、修订记录

| 版本 | 日期 | 作者 | 变更内容 |
|-----|------|------|---------|
| 1.0 | 2026-03-09 | UI/UX设计师 | 初始版本，创建设计系统 |

---

**文档状态**: ⏳ 进行中  
**最后更新**: 2026-03-09  
**文档作者**: UI/UX设计师
