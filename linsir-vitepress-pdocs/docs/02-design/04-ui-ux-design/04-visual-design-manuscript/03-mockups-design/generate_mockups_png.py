#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mockups PNG生成器
根据Mockups设计文档生成高保真PNG图片
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 设置中文字体
def get_font(size=14, bold=False):
    """获取字体"""
    font_paths = [
        ("C:/Windows/Fonts/msyh.ttc", "C:/Windows/Fonts/msyhbd.ttc"),
        ("C:/Windows/Fonts/simhei.ttf", "C:/Windows/Fonts/simhei.ttf"),
    ]
    for regular, bold_font in font_paths:
        if os.path.exists(regular):
            path = bold_font if bold else regular
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()

def hex_to_rgb(hex_color):
    """将十六进制颜色转换为RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    """绘制圆角矩形"""
    x1, y1, x2, y2 = xy
    r = radius
    
    # 主体矩形
    draw.rectangle([x1+r, y1, x2-r, y2], fill=fill)
    draw.rectangle([x1, y1+r, x2, y2-r], fill=fill)
    
    # 四个圆角
    draw.ellipse([x1, y1, x1+2*r, y1+2*r], fill=fill)
    draw.ellipse([x2-2*r, y1, x2, y1+2*r], fill=fill)
    draw.ellipse([x1, y2-2*r, x1+2*r, y2], fill=fill)
    draw.ellipse([x2-2*r, y2-2*r, x2, y2], fill=fill)

def draw_login_mockup():
    """绘制登录页高保真Mockup"""
    width, height = 1440, 900
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # 渐变背景
    for y in range(height):
        ratio = y / height
        r = int(24 + (9 - 24) * ratio)
        g = int(144 + (109 - 144) * ratio)
        b = int(255 + (217 - 255) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    font_title = get_font(24, bold=True)
    font_label = get_font(14)
    font_small = get_font(12)
    font_logo = get_font(48, bold=True)
    
    # 卡片阴影效果
    card_x, card_y = 520, 120
    card_w, card_h = 400, 560
    
    # 阴影
    for i in range(20):
        alpha = int(25 - i)
        shadow_color = (0, 0, 0)
        draw.rectangle([card_x + i, card_y + i*2, card_x + card_w + i, card_y + card_h + i*2], 
                      fill=(240, 240, 240))
    
    # 主卡片
    draw_rounded_rect(draw, [card_x, card_y, card_x + card_w, card_y + card_h], 12, (255, 255, 255))
    
    # Logo
    logo_color = hex_to_rgb("#1890FF")
    draw.ellipse([card_x + 168, card_y + 40, card_x + 232, card_y + 104], fill=logo_color)
    draw.text((card_x + 185, card_y + 55), "L", fill=(255, 255, 255), font=font_logo)
    
    # 标题
    draw.text((card_x + 140, card_y + 130), "用户登录", fill=(38, 38, 38), font=font_title)
    
    # 用户名输入框
    input_y = card_y + 200
    draw.text((card_x + 40, input_y), "用户名", fill=(38, 38, 38), font=font_label)
    draw_rounded_rect(draw, [card_x + 40, input_y + 25, card_x + 360, input_y + 73], 4, (255, 255, 255), (217, 217, 217), 1)
    draw.text((card_x + 55, input_y + 38), "请输入用户名", fill=(191, 191, 191), font=font_label)
    
    # 密码输入框
    input_y = card_y + 290
    draw.text((card_x + 40, input_y), "密码", fill=(38, 38, 38), font=font_label)
    draw_rounded_rect(draw, [card_x + 40, input_y + 25, card_x + 360, input_y + 73], 4, (255, 255, 255), (217, 217, 217), 1)
    draw.text((card_x + 55, input_y + 38), "请输入密码", fill=(191, 191, 191), font=font_label)
    draw.text((card_x + 330, input_y + 38), "👁", fill=(140, 140, 140), font=font_label)
    
    # 记住我
    draw_rounded_rect(draw, [card_x + 40, card_y + 380, card_x + 56, card_y + 396], 2, (255, 255, 255), (140, 140, 140), 1)
    draw.text((card_x + 65, card_y + 378), "记住我", fill=(89, 89, 89), font=font_small)
    
    # 登录按钮
    btn_color = hex_to_rgb("#1890FF")
    draw_rounded_rect(draw, [card_x + 40, card_y + 430, card_x + 360, card_y + 478], 4, btn_color)
    draw.text((card_x + 170, card_y + 445), "登 录", fill=(255, 255, 255), font=font_label)
    
    # 忘记密码
    draw.text((card_x + 160, card_y + 500), "忘记密码?", fill=(24, 144, 255), font=font_small)
    
    # 底部版权
    draw.text((width//2 - 80, height - 50), "© 2026 公司名称", fill=(255, 255, 255), font=font_small)
    
    return img

def draw_dashboard_mockup():
    """绘制首页仪表盘高保真Mockup"""
    width, height = 1440, 900
    img = Image.new('RGB', (width, height), (245, 245, 245))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(20, bold=True)
    font_label = get_font(14)
    font_small = get_font(12)
    font_number = get_font(36, bold=True)
    font_icon = get_font(24)
    
    # 顶部导航栏
    draw.rectangle([0, 0, width, 64], fill=(255, 255, 255))
    draw.rectangle([0, 64, width, 65], fill=(240, 240, 240))
    
    # Logo
    logo_color = hex_to_rgb("#1890FF")
    draw.ellipse([20, 16, 52, 48], fill=logo_color)
    draw.text((28, 22), "L", fill=(255, 255, 255), font=get_font(16, True))
    draw.text((60, 22), "Linsir", fill=(24, 144, 255), font=get_font(16, True))
    
    # 导航菜单
    nav_items = [("首页", True), ("用户管理", False), ("组织架构", False), ("权限管理", False), ("系统设置", False)]
    nav_x = 150
    for item, active in nav_items:
        color = (24, 144, 255) if active else (89, 89, 89)
        draw.text((nav_x, 22), item, fill=color, font=font_label)
        nav_x += 100
    
    # 用户头像
    draw.ellipse([width - 50, 16, width - 18, 48], fill=(217, 217, 217))
    draw.text((width - 42, 22), "👤", fill=(255, 255, 255), font=font_label)
    
    # 页面标题
    draw.text((24, 84), "首页", fill=(38, 38, 38), font=font_title)
    
    # 统计卡片
    stats = [
        ("👤", "总用户数", "1,234", "较昨日 +12%", True),
        ("📈", "今日新增", "+56", "较昨日 +8%", True),
        ("🔥", "活跃用户", "892", "较昨日 +5%", True),
        ("🏢", "部门数", "12", "较昨日 0%", False),
    ]
    
    card_x = 24
    for icon, title, number, trend, positive in stats:
        # 卡片背景
        draw_rounded_rect(draw, [card_x, 120, card_x + 336, 240], 8, (255, 255, 255))
        
        # 图标容器
        icon_bg = hex_to_rgb("#E6F7FF")
        draw.ellipse([card_x + 20, 140, card_x + 68, 188], fill=icon_bg)
        draw.text((card_x + 32, 152), icon, fill=(24, 144, 255), font=font_icon)
        
        # 标签
        draw.text((card_x + 88, 148), title, fill=(140, 140, 140), font=font_small)
        
        # 数值
        draw.text((card_x + 20, 200), number, fill=(38, 38, 38), font=font_number)
        
        # 趋势
        trend_color = (82, 196, 26) if positive else (140, 140, 140)
        draw.text((card_x + 150, 215), trend, fill=trend_color, font=font_small)
        
        card_x += 352
    
    # 图表区域
    # 用户增长趋势
    draw_rounded_rect(draw, [24, 260, 700, 580], 8, (255, 255, 255))
    draw.text((40, 275), "用户增长趋势", fill=(38, 38, 38), font=font_label)
    
    # 简化的折线图
    chart_y_base = 520
    points = [(100, 480), (200, 450), (300, 470), (400, 420), (500, 440), (600, 400)]
    for i in range(len(points) - 1):
        x1, y1 = points[i]
        x2, y2 = points[i + 1]
        draw.line([(x1, y1), (x2, y2)], fill=(24, 144, 255), width=3)
    for x, y in points:
        draw.ellipse([x-5, y-5, x+5, y+5], fill=(24, 144, 255))
    
    # 部门人员分布
    draw_rounded_rect(draw, [724, 260, 1400, 580], 8, (255, 255, 255))
    draw.text((740, 275), "部门人员分布", fill=(38, 38, 38), font=font_label)
    
    # 简化的饼图
    pie_center = (1050, 420)
    pie_radius = 80
    colors = [hex_to_rgb("#1890FF"), hex_to_rgb("#52C41A"), hex_to_rgb("#FAAD14"), hex_to_rgb("#FF4D4F")]
    angles = [0, 90, 180, 270, 360]
    for i in range(4):
        # 简化表示
        draw.pieslice([pie_center[0]-pie_radius, pie_center[1]-pie_radius,
                      pie_center[0]+pie_radius, pie_center[1]+pie_radius],
                     angles[i], angles[i+1], fill=colors[i])
    
    # 最近活动
    draw_rounded_rect(draw, [24, 600, 1400, 800], 8, (255, 255, 255))
    draw.text((40, 615), "最近活动", fill=(38, 38, 38), font=font_label)
    
    activities = [
        ("张三", "创建了用户 李四", "10分钟前"),
        ("王五", "修改了部门 技术部", "30分钟前"),
        ("赵六", "分配了权限 管理员", "1小时前"),
    ]
    
    y = 660
    for user, action, time in activities:
        # 头像
        draw.ellipse([40, y, 72, y + 32], fill=(24, 144, 255))
        draw.text((48, y + 5), user[0], fill=(255, 255, 255), font=font_small)
        
        # 活动内容
        draw.text((85, y + 5), f"{user} {action}", fill=(89, 89, 89), font=font_label)
        draw.text((width - 150, y + 5), time, fill=(140, 140, 140), font=font_small)
        
        y += 45
    
    return img

def draw_user_list_mockup():
    """绘制用户列表页高保真Mockup"""
    width, height = 1440, 900
    img = Image.new('RGB', (width, height), (245, 245, 245))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(20, bold=True)
    font_label = get_font(14)
    font_small = get_font(12)
    
    # 顶部导航栏
    draw.rectangle([0, 0, width, 64], fill=(255, 255, 255))
    logo_color = hex_to_rgb("#1890FF")
    draw.ellipse([20, 16, 52, 48], fill=logo_color)
    draw.text((28, 22), "L", fill=(255, 255, 255), font=get_font(16, True))
    
    nav_items = [("首页", False), ("用户管理", True), ("组织架构", False), ("权限管理", False), ("系统设置", False)]
    nav_x = 100
    for item, active in nav_items:
        color = (24, 144, 255) if active else (89, 89, 89)
        draw.text((nav_x, 22), item, fill=color, font=font_label)
        nav_x += 100
    
    # 页面标题和新建按钮
    draw.text((24, 84), "用户管理", fill=(38, 38, 38), font=font_title)
    btn_color = hex_to_rgb("#1890FF")
    draw_rounded_rect(draw, [width - 140, 80, width - 24, 112], 4, btn_color)
    draw.text((width - 125, 87), "+ 新建用户", fill=(255, 255, 255), font=font_small)
    
    # 筛选栏
    draw_rounded_rect(draw, [24, 130, width - 24, 190], 4, (255, 255, 255))
    
    # 搜索框
    draw_rounded_rect(draw, [40, 145, 280, 175], 4, (255, 255, 255), (217, 217, 217), 1)
    draw.text((50, 150), "🔍 搜索用户名...", fill=(140, 140, 140), font=font_label)
    
    # 下拉选择
    filters = ["部门 ▼", "状态 ▼", "更多 ▼"]
    filter_x = 300
    for filter_text in filters:
        draw_rounded_rect(draw, [filter_x, 145, filter_x + 100, 175], 4, (245, 245, 245), (217, 217, 217), 1)
        draw.text((filter_x + 10, 150), filter_text, fill=(89, 89, 89), font=font_small)
        filter_x += 120
    
    # 查询按钮
    draw_rounded_rect(draw, [width - 100, 145, width - 40, 175], 4, btn_color)
    draw.text((width - 85, 150), "查询", fill=(255, 255, 255), font=font_small)
    
    # 操作按钮
    y = 210
    buttons = ["批量启用", "批量禁用", "批量删除", "📥 导入", "📤 导出"]
    x = 24
    for btn in buttons:
        draw_rounded_rect(draw, [x, y, x + 80, y + 32], 4, (255, 255, 255), (217, 217, 217), 1)
        draw.text((x + 10, y + 6), btn, fill=(89, 89, 89), font=font_small)
        x += 90
    
    # 表格
    y = 260
    draw_rounded_rect(draw, [24, y, width - 24, y + 400], 4, (255, 255, 255))
    
    # 表头
    header_bg = hex_to_rgb("#F5F5F5")
    draw.rectangle([24, y, width - 24, y + 48], fill=header_bg)
    headers = ["☑", "用户名", "姓名", "部门", "手机号", "状态", "操作"]
    header_x = [30, 80, 200, 300, 420, 580, 750]
    for i, header in enumerate(headers):
        draw.text((header_x[i], y + 15), header, fill=(38, 38, 38), font=font_label)
    
    # 表格行
    rows = [
        ("☐", "zhangs", "张三", "技术部", "138****8888", "启用", "编辑 删除"),
        ("☐", "lis", "李四", "产品部", "139****9999", "启用", "编辑 删除"),
        ("☐", "wangw", "王五", "测试部", "137****7777", "禁用", "编辑 删除"),
        ("☐", "zhaol", "赵六", "设计部", "136****6666", "启用", "编辑 删除"),
    ]
    
    y += 48
    for row in rows:
        for i, cell in enumerate(row):
            if i == 5:  # 状态列
                if cell == "启用":
                    # 绿色标签
                    tag_bg = hex_to_rgb("#F6FFED")
                    tag_color = hex_to_rgb("#52C41A")
                    draw.rounded_rectangle([header_x[i], y + 10, header_x[i] + 50, y + 30], radius=2, fill=tag_bg)
                    draw.text((header_x[i] + 5, y + 12), "● 启用", fill=tag_color, font=font_small)
                else:
                    # 红色标签
                    tag_bg = hex_to_rgb("#FFF2F0")
                    tag_color = hex_to_rgb("#FF4D4F")
                    draw.rounded_rectangle([header_x[i], y + 10, header_x[i] + 50, y + 30], radius=2, fill=tag_bg)
                    draw.text((header_x[i] + 5, y + 12), "● 禁用", fill=tag_color, font=font_small)
            elif i == 6:  # 操作列
                draw.text((header_x[i], y + 15), "编辑", fill=(24, 144, 255), font=font_label)
                draw.text((header_x[i] + 40, y + 15), "删除", fill=(255, 77, 79), font=font_label)
            else:
                draw.text((header_x[i], y + 15), cell, fill=(38, 38, 38), font=font_label)
        y += 48
        if y < 600:
            draw.line([(24, y), (width - 24, y)], fill=(240, 240, 240))
    
    # 分页
    draw.text((24, 670), "共 128 条记录", fill=(89, 89, 89), font=font_small)
    
    # 分页按钮
    pages = ["<", "1", "2", "3", "4", "5", "...", "13", ">"]
    page_x = width - 350
    for page in pages:
        if page == "1":
            draw.rounded_rectangle([page_x, 665, page_x + 30, 695], radius=4, fill=btn_color)
            draw.text((page_x + 10, 670), page, fill=(255, 255, 255), font=font_small)
        else:
            draw.text((page_x + 10, 670), page, fill=(89, 89, 89), font=font_small)
        page_x += 35
    
    draw.text((page_x + 10, 670), "10条/页", fill=(89, 89, 89), font=font_small)
    
    return img

def draw_user_create_mockup():
    """绘制用户创建页高保真Mockup"""
    width, height = 1440, 900
    img = Image.new('RGB', (width, height), (245, 245, 245))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(20, bold=True)
    font_label = get_font(14)
    font_small = get_font(12)
    
    # 顶部导航栏
    draw.rectangle([0, 0, width, 64], fill=(255, 255, 255))
    logo_color = hex_to_rgb("#1890FF")
    draw.ellipse([20, 16, 52, 48], fill=logo_color)
    draw.text((28, 22), "L", fill=(255, 255, 255), font=get_font(16, True))
    
    draw.text((100, 22), "首页", fill=(89, 89, 89), font=font_label)
    draw.text((180, 22), "用户管理", fill=(24, 144, 255), font=font_label)
    
    # 面包屑
    draw.text((24, 84), "首页 > 用户管理 > 新建用户", fill=(140, 140, 140), font=font_label)
    
    # 表单卡片
    draw_rounded_rect(draw, [300, 120, 1140, 780], 8, (255, 255, 255))
    
    # 标题
    draw.text((340, 140), "新建用户", fill=(38, 38, 38), font=font_title)
    
    # 步骤条
    steps = [("1 基本信息", True), ("2 部门岗位", False), ("3 确认提交", False)]
    step_x = 340
    for i, (step, active) in enumerate(steps):
        if active:
            # 当前步骤
            draw.ellipse([step_x, 185, step_x + 20, 205], fill=(24, 144, 255))
            draw.text((step_x + 6, 188), "1", fill=(255, 255, 255), font=font_small)
            draw.text((step_x + 25, 188), step, fill=(24, 144, 255), font=font_label)
        else:
            # 未激活步骤
            draw.ellipse([step_x, 185, step_x + 20, 205], outline=(217, 217, 217), width=1)
            draw.text((step_x + 6, 188), str(i+1), fill=(191, 191, 191), font=font_small)
            draw.text((step_x + 25, 188), step.split()[1], fill=(191, 191, 191), font=font_label)
        
        if i < 2:
            draw.line([(step_x + 100, 195), (step_x + 140, 195)], fill=(217, 217, 217), width=1)
        step_x += 160
    
    # 分隔线
    draw.line([(340, 230), (1100, 230)], fill=(240, 240, 240), width=1)
    
    # 表单字段
    y = 260
    fields = [
        ("用户名 *", "请输入用户名", "4-20个字符, 支持字母、数字、下划线"),
        ("姓名 *", "请输入姓名", ""),
        ("手机号 *", "请输入手机号", ""),
        ("邮箱", "请输入邮箱", ""),
    ]
    
    for label, placeholder, hint in fields:
        draw.text((340, y), label, fill=(38, 38, 38), font=font_label)
        y += 30
        draw_rounded_rect(draw, [340, y, 1100, y + 48], 4, (255, 255, 255), (217, 217, 217), 1)
        draw.text((355, y + 14), placeholder, fill=(191, 191, 191), font=font_label)
        y += 60
        
        if hint:
            draw.text((340, y - 15), hint, fill=(140, 140, 140), font=font_small)
    
    # 状态选择
    draw.text((340, y), "状态", fill=(38, 38, 38), font=font_label)
    y += 35
    
    # 启用选项
    draw.ellipse([340, y, 360, y + 20], fill=(24, 144, 255))
    draw.ellipse([345, y + 5, 355, y + 15], fill=(255, 255, 255))
    draw.text((370, y), "启用", fill=(38, 38, 38), font=font_label)
    
    # 禁用选项
    draw.ellipse([440, y, 460, y + 20], outline=(140, 140, 140), width=1)
    draw.text((470, y), "禁用", fill=(89, 89, 89), font=font_label)
    
    # 按钮
    y = 700
    draw_rounded_rect(draw, [800, y, 900, y + 40], 4, (255, 255, 255), (217, 217, 217), 1)
    draw.text((830, y + 10), "取消", fill=(89, 89, 89), font=font_label)
    
    btn_color = hex_to_rgb("#1890FF")
    draw_rounded_rect(draw, [920, y, 1100, y + 40], 4, btn_color)
    draw.text((990, y + 10), "下一步", fill=(255, 255, 255), font=font_label)
    
    return img

def draw_department_mockup():
    """绘制部门管理页高保真Mockup"""
    width, height = 1440, 900
    img = Image.new('RGB', (width, height), (245, 245, 245))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(20, bold=True)
    font_label = get_font(14)
    font_small = get_font(12)
    
    # 顶部导航栏
    draw.rectangle([0, 0, width, 64], fill=(255, 255, 255))
    logo_color = hex_to_rgb("#1890FF")
    draw.ellipse([20, 16, 52, 48], fill=logo_color)
    draw.text((28, 22), "L", fill=(255, 255, 255), font=get_font(16, True))
    
    nav_items = [("首页", False), ("用户管理", False), ("组织架构", True), ("权限管理", False), ("系统设置", False)]
    nav_x = 100
    for item, active in nav_items:
        color = (24, 144, 255) if active else (89, 89, 89)
        draw.text((nav_x, 22), item, fill=color, font=font_label)
        nav_x += 100
    
    # 页面标题和新建按钮
    draw.text((24, 84), "部门管理", fill=(38, 38, 38), font=font_title)
    btn_color = hex_to_rgb("#1890FF")
    draw_rounded_rect(draw, [width - 140, 80, width - 24, 112], 4, btn_color)
    draw.text((width - 125, 87), "+ 新建部门", fill=(255, 255, 255), font=font_small)
    
    # 左侧树形结构
    draw_rounded_rect(draw, [24, 130, 400, 800], 8, (255, 255, 255))
    draw.text((40, 145), "组织架构", fill=(38, 38, 38), font=font_label)
    
    tree_items = [
        ("▼", "总公司", 0, True),
        ("▶", "技术部", 1, False),
        ("▼", "产品部", 1, True),
        ("▶", "设计组", 2, False),
        ("▶", "运营组", 2, False),
        ("▶", "市场部", 1, False),
        ("▶", "财务部", 1, False),
    ]
    
    y = 185
    for icon, name, level, expanded in tree_items:
        x = 40 + level * 20
        color = (24, 144, 255) if name == "产品部" else (89, 89, 89)
        draw.text((x, y), icon, fill=(140, 140, 140), font=font_small)
        draw.text((x + 20, y), name, fill=color, font=font_label)
        y += 40
    
    # 右侧详情
    draw_rounded_rect(draw, [424, 130, width - 24, 800], 8, (255, 255, 255))
    draw.text((440, 145), "部门详情", fill=(38, 38, 38), font=font_label)
    draw.text((1200, 145), "产品部", fill=(24, 144, 255), font=font_label)
    
    # 部门信息
    y = 200
    draw.text((440, y), "部门信息", fill=(38, 38, 38), font=font_label)
    draw.line([(440, y + 30), (width - 40, y + 30)], fill=(240, 240, 240), width=1)
    
    info_items = [
        ("部门名称:", "产品部"),
        ("部门编码:", "PRODUCT"),
        ("上级部门:", "总公司"),
        ("负责人:", "王五"),
        ("人员数量:", "15人"),
    ]
    
    y = 250
    for label, value in info_items:
        draw.text((440, y), label, fill=(89, 89, 89), font=font_label)
        draw.text((600, y), value, fill=(38, 38, 38), font=font_label)
        y += 40
    
    # 操作按钮
    y = 480
    draw_rounded_rect(draw, [440, y, 520, y + 32], 4, (255, 255, 255), (217, 217, 217), 1)
    draw.text((460, y + 6), "编辑", fill=(24, 144, 255), font=font_small)
    draw_rounded_rect(draw, [540, y, 620, y + 32], 4, (255, 255, 255), (217, 217, 217), 1)
    draw.text((560, y + 6), "删除", fill=(255, 77, 79), font=font_small)
    
    # 部门成员
    y = 540
    draw.text((440, y), "部门成员", fill=(38, 38, 38), font=font_label)
    draw.line([(440, y + 30), (width - 40, y + 30)], fill=(240, 240, 240), width=1)
    
    # 成员表格
    y = 590
    header_bg = hex_to_rgb("#F5F5F5")
    draw.rectangle([440, y, width - 40, y + 40], fill=header_bg)
    headers = ["☑", "姓名", "岗位", "操作"]
    header_x = [450, 500, 650, 800]
    for i, header in enumerate(headers):
        draw.text((header_x[i], y + 10), header, fill=(38, 38, 38), font=font_label)
    
    members = [
        ("☐", "王五", "产品总监", "移除"),
        ("☐", "赵六", "产品经理", "移除"),
    ]
    
    y += 40
    for member in members:
        for i, cell in enumerate(member):
            color = (255, 77, 79) if i == 3 else (38, 38, 38)
            draw.text((header_x[i], y + 10), cell, fill=color, font=font_label)
        y += 40
    
    return img

def main():
    """主函数"""
    base_path = "d:\\dev\\2026\\1.3 code\\demo\\linsir-demo\\linsir-vue-admin\\apps\\linsir-web-system\\docs\\02-design\\04-ui-ux-design\\04-visual-design-manuscript\\03-mockups-design"
    
    print("生成登录页Mockup...")
    login_img = draw_login_mockup()
    login_img.save(f"{base_path}\\01-login\\login-page.png")
    print("✓ 登录页Mockup已生成")
    
    print("生成首页仪表盘Mockup...")
    dashboard_img = draw_dashboard_mockup()
    dashboard_img.save(f"{base_path}\\02-dashboard\\dashboard-page.png")
    print("✓ 首页仪表盘Mockup已生成")
    
    print("生成用户列表页Mockup...")
    user_list_img = draw_user_list_mockup()
    user_list_img.save(f"{base_path}\\03-user-management\\user-list-page.png")
    print("✓ 用户列表页Mockup已生成")
    
    print("生成用户创建页Mockup...")
    user_create_img = draw_user_create_mockup()
    user_create_img.save(f"{base_path}\\03-user-management\\user-create-page.png")
    print("✓ 用户创建页Mockup已生成")
    
    print("生成部门管理页Mockup...")
    dept_img = draw_department_mockup()
    dept_img.save(f"{base_path}\\05-organization\\department-page.png")
    print("✓ 部门管理页Mockup已生成")
    
    print("\n所有Mockups PNG图片已生成完成！")

if __name__ == "__main__":
    main()
