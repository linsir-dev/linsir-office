#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
视觉稿PNG生成器
根据视觉稿设计文档生成对应的PNG图片
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 设置中文字体
def get_font(size=14, bold=False):
    """获取字体"""
    font_paths = [
        ("C:/Windows/Fonts/msyh.ttc", "C:/Windows/Fonts/msyhbd.ttc"),  # 微软雅黑
        ("C:/Windows/Fonts/simhei.ttf", "C:/Windows/Fonts/simhei.ttf"),  # 黑体
        ("C:/Windows/Fonts/simsun.ttc", "C:/Windows/Fonts/simsun.ttc"),  # 宋体
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

def draw_login_page():
    """绘制登录页"""
    width, height = 1440, 900
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # 渐变背景 (简化处理，使用纯色)
    for y in range(height):
        ratio = y / height
        r = int(24 + (9 - 24) * ratio)
        g = int(144 + (109 - 144) * ratio)
        b = int(255 + (217 - 255) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    font_title = get_font(24, bold=True)
    font_label = get_font(14)
    font_small = get_font(12)
    
    # 卡片
    card_x, card_y = 520, 150
    card_w, card_h = 400, 500
    draw.rectangle([card_x, card_y, card_x + card_w, card_y + card_h], 
                   fill=(255, 255, 255), outline=(200, 200, 200))
    
    # Logo区域
    draw.text((card_x + 150, card_y + 40), "系统Logo", fill=(100, 100, 100), font=font_label)
    
    # 标题
    draw.text((card_x + 140, card_y + 100), "用户登录", fill=(38, 38, 38), font=font_title)
    
    # 用户名输入框
    input_y = card_y + 180
    draw.rectangle([card_x + 40, input_y, card_x + 360, input_y + 40], 
                   fill=(255, 255, 255), outline=(217, 217, 217))
    draw.text((card_x + 50, input_y + 10), "用户名", fill=(140, 140, 140), font=font_label)
    
    # 密码输入框
    input_y = card_y + 240
    draw.rectangle([card_x + 40, input_y, card_x + 360, input_y + 40], 
                   fill=(255, 255, 255), outline=(217, 217, 217))
    draw.text((card_x + 50, input_y + 10), "密码", fill=(140, 140, 140), font=font_label)
    
    # 记住我
    draw.rectangle([card_x + 40, card_y + 300, card_x + 55, card_y + 315], 
                   fill=(255, 255, 255), outline=(140, 140, 140))
    draw.text((card_x + 65, card_y + 300), "记住我", fill=(89, 89, 89), font=font_small)
    
    # 登录按钮
    btn_color = hex_to_rgb("#1890FF")
    draw.rectangle([card_x + 40, card_y + 350, card_x + 360, card_y + 390], 
                   fill=btn_color)
    draw.text((card_x + 160, card_y + 360), "登 录", fill=(255, 255, 255), font=font_label)
    
    # 忘记密码
    draw.text((card_x + 160, card_y + 420), "忘记密码?", fill=(24, 144, 255), font=font_small)
    
    # 底部版权
    draw.text((width//2 - 80, height - 50), "© 2026 公司名称", fill=(255, 255, 255), font=font_small)
    
    return img

def draw_dashboard():
    """绘制首页仪表盘"""
    width, height = 1440, 900
    img = Image.new('RGB', (width, height), (245, 245, 245))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(20, bold=True)
    font_label = get_font(14)
    font_small = get_font(12)
    font_number = get_font(32, bold=True)
    
    # 顶部导航栏
    draw.rectangle([0, 0, width, 64], fill=(255, 255, 255))
    draw.text((20, 20), "Logo", fill=(24, 144, 255), font=font_label)
    draw.text((100, 20), "首页", fill=(24, 144, 255), font=font_label)
    draw.text((180, 20), "用户管理", fill=(89, 89, 89), font=font_label)
    draw.text((280, 20), "组织架构", fill=(89, 89, 89), font=font_label)
    draw.text((380, 20), "权限管理", fill=(89, 89, 89), font=font_label)
    draw.text((480, 20), "系统设置", fill=(89, 89, 89), font=font_label)
    draw.text((width - 60, 20), "👤", fill=(89, 89, 89), font=font_label)
    
    # 页面标题
    draw.text((24, 84), "首页", fill=(38, 38, 38), font=font_title)
    
    # 统计卡片
    stats = [
        ("总用户数", "1,234", "较昨日 +12%"),
        ("今日新增", "+56", "较昨日 +8%"),
        ("活跃用户", "892", "较昨日 +5%"),
        ("部门数", "12", "较昨日 0"),
    ]
    
    card_x = 24
    for title, number, trend in stats:
        draw.rectangle([card_x, 120, card_x + 336, 220], fill=(255, 255, 255))
        draw.text((card_x + 20, 135), title, fill=(89, 89, 89), font=font_label)
        draw.text((card_x + 20, 160), number, fill=(24, 144, 255), font=font_number)
        trend_color = (82, 196, 26) if "+" in trend else (140, 140, 140)
        draw.text((card_x + 20, 200), trend, fill=trend_color, font=font_small)
        card_x += 352
    
    # 图表区域
    draw.rectangle([24, 240, 700, 500], fill=(255, 255, 255))
    draw.text((40, 255), "用户增长趋势", fill=(38, 38, 38), font=font_label)
    draw.text((300, 350), "📈 折线图", fill=(200, 200, 200), font=font_title)
    
    draw.rectangle([724, 240, 1400, 500], fill=(255, 255, 255))
    draw.text((740, 255), "部门人员分布", fill=(38, 38, 38), font=font_label)
    draw.text((1000, 350), "🥧 饼图", fill=(200, 200, 200), font=font_title)
    
    # 最近活动
    draw.rectangle([24, 520, 1400, 700], fill=(255, 255, 255))
    draw.text((40, 535), "最近活动", fill=(38, 38, 38), font=font_label)
    
    activities = [
        "• 张三 创建了用户 李四 - 10分钟前",
        "• 王五 修改了部门 技术部 - 30分钟前",
        "• 赵六 分配了权限 管理员 - 1小时前",
    ]
    y = 570
    for activity in activities:
        draw.text((40, y), activity, fill=(89, 89, 89), font=font_label)
        y += 30
    
    return img

def draw_user_list():
    """绘制用户列表页"""
    width, height = 1440, 900
    img = Image.new('RGB', (width, height), (245, 245, 245))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(20, bold=True)
    font_label = get_font(14)
    font_small = get_font(12)
    
    # 顶部导航栏
    draw.rectangle([0, 0, width, 64], fill=(255, 255, 255))
    draw.text((20, 20), "Logo", fill=(24, 144, 255), font=font_label)
    draw.text((100, 20), "首页", fill=(89, 89, 89), font=font_label)
    draw.text((180, 20), "用户管理", fill=(24, 144, 255), font=font_label)
    draw.text((280, 20), "组织架构", fill=(89, 89, 89), font=font_label)
    draw.text((380, 20), "权限管理", fill=(89, 89, 89), font=font_label)
    draw.text((480, 20), "系统设置", fill=(89, 89, 89), font=font_label)
    
    # 页面标题和新建按钮
    draw.text((24, 84), "用户管理", fill=(38, 38, 38), font=font_title)
    btn_color = hex_to_rgb("#1890FF")
    draw.rectangle([width - 140, 80, width - 24, 110], fill=btn_color)
    draw.text((width - 125, 85), "+ 新建用户", fill=(255, 255, 255), font=font_small)
    
    # 筛选栏
    draw.rectangle([24, 130, width - 24, 180], fill=(255, 255, 255))
    draw.text((40, 145), "🔍 搜索用户名...", fill=(140, 140, 140), font=font_label)
    draw.rectangle([300, 140, 400, 170], fill=(245, 245, 245), outline=(217, 217, 217))
    draw.text((310, 147), "部门 ▼", fill=(89, 89, 89), font=font_small)
    draw.rectangle([420, 140, 520, 170], fill=(245, 245, 245), outline=(217, 217, 217))
    draw.text((430, 147), "状态 ▼", fill=(89, 89, 89), font=font_small)
    draw.rectangle([width - 100, 140, width - 40, 170], fill=btn_color)
    draw.text((width - 85, 147), "查询", fill=(255, 255, 255), font=font_small)
    
    # 操作按钮
    y = 200
    buttons = ["批量启用", "批量禁用", "批量删除", "📥 导入", "📤 导出"]
    x = 24
    for btn in buttons:
        draw.rectangle([x, y, x + 80, y + 30], fill=(255, 255, 255), outline=(217, 217, 217))
        draw.text((x + 10, y + 5), btn, fill=(89, 89, 89), font=font_small)
        x += 90
    
    # 表格
    y = 250
    draw.rectangle([24, y, width - 24, y + 400], fill=(255, 255, 255))
    
    # 表头
    header_bg = hex_to_rgb("#F5F5F5")
    draw.rectangle([24, y, width - 24, y + 48], fill=header_bg)
    headers = ["☑", "用户名", "姓名", "部门", "手机号", "状态", "操作"]
    header_x = [30, 80, 200, 300, 420, 580, 700]
    for i, header in enumerate(headers):
        draw.text((header_x[i], y + 15), header, fill=(38, 38, 38), font=font_label)
    
    # 表格行
    rows = [
        ("☐", "zhangs", "张三", "技术部", "138****", "🟢启用", "编辑 删除"),
        ("☐", "lis", "李四", "产品部", "139****", "🟢启用", "编辑 删除"),
        ("☐", "wangw", "王五", "测试部", "137****", "🔴禁用", "编辑 删除"),
        ("☐", "zhaol", "赵六", "设计部", "136****", "🟢启用", "编辑 删除"),
    ]
    
    y += 48
    for row in rows:
        for i, cell in enumerate(row):
            color = (38, 38, 38)
            if i == 5:
                color = (82, 196, 26) if "启用" in cell else (255, 77, 79)
            elif i == 6:
                color = (24, 144, 255)
            draw.text((header_x[i], y + 15), cell, fill=color, font=font_label)
        y += 48
        if y < 600:
            draw.line([(24, y), (width - 24, y)], fill=(217, 217, 217))
    
    # 分页
    draw.text((24, 670), "共 128 条记录", fill=(89, 89, 89), font=font_small)
    draw.text((width - 300, 670), "[< 1 2 3 4 5 ... 13 >]  10条/页", fill=(89, 89, 89), font=font_small)
    
    return img

def draw_user_create():
    """绘制用户创建页"""
    width, height = 1440, 900
    img = Image.new('RGB', (width, height), (245, 245, 245))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(20, bold=True)
    font_label = get_font(14)
    font_small = get_font(12)
    
    # 顶部导航栏
    draw.rectangle([0, 0, width, 64], fill=(255, 255, 255))
    draw.text((20, 20), "Logo", fill=(24, 144, 255), font=font_label)
    draw.text((100, 20), "首页", fill=(89, 89, 89), font=font_label)
    draw.text((180, 20), "用户管理", fill=(24, 144, 255), font=font_label)
    draw.text((280, 20), "组织架构", fill=(89, 89, 89), font=font_label)
    
    # 面包屑
    draw.text((24, 84), "首页 > 用户管理 > 新建用户", fill=(140, 140, 140), font=font_label)
    
    # 表单卡片
    draw.rectangle([300, 130, 1140, 750], fill=(255, 255, 255))
    
    # 标题
    draw.text((340, 150), "新建用户", fill=(38, 38, 38), font=font_title)
    
    # 步骤条
    steps = ["1 基本信息", "2 部门岗位", "3 确认提交"]
    step_x = 340
    for i, step in enumerate(steps):
        color = (24, 144, 255) if i == 0 else (217, 217, 217)
        draw.text((step_x, 190), step, fill=color, font=font_label)
        if i < 2:
            draw.text((step_x + 80, 190), "—", fill=(217, 217, 217), font=font_label)
        step_x += 120
    
    # 分隔线
    draw.line([(340, 230), (1100, 230)], fill=(217, 217, 217))
    
    # 表单字段
    y = 260
    fields = [
        ("用户名 *", "请输入用户名"),
        ("姓名 *", "请输入姓名"),
        ("手机号 *", "请输入手机号"),
        ("邮箱", "请输入邮箱"),
    ]
    
    for label, placeholder in fields:
        draw.text((340, y), label, fill=(38, 38, 38), font=font_label)
        y += 30
        draw.rectangle([340, y, 1100, y + 40], fill=(255, 255, 255), outline=(217, 217, 217))
        draw.text((350, y + 10), placeholder, fill=(140, 140, 140), font=font_label)
        y += 60
    
    # 状态选择
    draw.text((340, y), "状态", fill=(38, 38, 38), font=font_label)
    y += 30
    draw.ellipse([340, y + 5, 355, y + 20], fill=(24, 144, 255))
    draw.text((365, y), "启用", fill=(38, 38, 38), font=font_label)
    draw.ellipse([440, y + 5, 455, y + 20], outline=(140, 140, 140))
    draw.text((465, y), "禁用", fill=(89, 89, 89), font=font_label)
    
    # 按钮
    y = 680
    draw.rectangle([800, y, 900, y + 40], fill=(255, 255, 255), outline=(217, 217, 217))
    draw.text((830, y + 10), "取消", fill=(89, 89, 89), font=font_label)
    
    btn_color = hex_to_rgb("#1890FF")
    draw.rectangle([920, y, 1100, y + 40], fill=btn_color)
    draw.text((990, y + 10), "下一步", fill=(255, 255, 255), font=font_label)
    
    return img

def draw_department_management():
    """绘制部门管理页"""
    width, height = 1440, 900
    img = Image.new('RGB', (width, height), (245, 245, 245))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(20, bold=True)
    font_label = get_font(14)
    font_small = get_font(12)
    
    # 顶部导航栏
    draw.rectangle([0, 0, width, 64], fill=(255, 255, 255))
    draw.text((20, 20), "Logo", fill=(24, 144, 255), font=font_label)
    draw.text((100, 20), "首页", fill=(89, 89, 89), font=font_label)
    draw.text((180, 20), "用户管理", fill=(89, 89, 89), font=font_label)
    draw.text((280, 20), "组织架构", fill=(24, 144, 255), font=font_label)
    
    # 页面标题和新建按钮
    draw.text((24, 84), "部门管理", fill=(38, 38, 38), font=font_title)
    btn_color = hex_to_rgb("#1890FF")
    draw.rectangle([width - 140, 80, width - 24, 110], fill=btn_color)
    draw.text((width - 125, 85), "+ 新建部门", fill=(255, 255, 255), font=font_small)
    
    # 左侧树形结构
    draw.rectangle([24, 130, 400, 700], fill=(255, 255, 255))
    draw.text((40, 145), "组织架构", fill=(38, 38, 38), font=font_label)
    
    tree_items = [
        ("▼ 总公司", 0),
        ("  ▶ 技术部", 1),
        ("  ▼ 产品部", 1),
        ("    ▶ 设计组", 2),
        ("    ▶ 运营组", 2),
        ("  ▶ 市场部", 1),
        ("  ▶ 财务部", 1),
    ]
    
    y = 180
    for item, level in tree_items:
        x = 40 + level * 20
        draw.text((x, y), item, fill=(89, 89, 89), font=font_label)
        y += 35
    
    # 右侧详情
    draw.rectangle([424, 130, width - 24, 700], fill=(255, 255, 255))
    draw.text((440, 145), "部门详情", fill=(38, 38, 38), font=font_label)
    draw.text((1200, 145), "技术部", fill=(24, 144, 255), font=font_label)
    
    # 部门信息
    y = 200
    draw.text((440, y), "部门信息", fill=(38, 38, 38), font=font_label)
    draw.line([(440, y + 30), (width - 40, y + 30)], fill=(217, 217, 217))
    
    info_items = [
        ("部门名称:", "技术部"),
        ("部门编码:", "TECH"),
        ("上级部门:", "总公司"),
        ("负责人:", "张三"),
        ("人员数量:", "25人"),
    ]
    
    y = 250
    for label, value in info_items:
        draw.text((440, y), label, fill=(89, 89, 89), font=font_label)
        draw.text((600, y), value, fill=(38, 38, 38), font=font_label)
        y += 35
    
    # 操作按钮
    y = 450
    draw.rectangle([440, y, 520, y + 30], fill=(255, 255, 255), outline=(217, 217, 217))
    draw.text((455, y + 5), "编辑", fill=(24, 144, 255), font=font_small)
    draw.rectangle([540, y, 620, y + 30], fill=(255, 255, 255), outline=(217, 217, 217))
    draw.text((555, y + 5), "删除", fill=(255, 77, 79), font=font_small)
    
    # 部门成员
    y = 500
    draw.text((440, y), "部门成员", fill=(38, 38, 38), font=font_label)
    draw.line([(440, y + 30), (width - 40, y + 30)], fill=(217, 217, 217))
    
    # 成员表格
    y = 550
    header_bg = hex_to_rgb("#F5F5F5")
    draw.rectangle([440, y, width - 40, y + 40], fill=header_bg)
    headers = ["☑", "姓名", "岗位", "操作"]
    header_x = [450, 500, 650, 800]
    for i, header in enumerate(headers):
        draw.text((header_x[i], y + 10), header, fill=(38, 38, 38), font=font_label)
    
    members = [
        ("☐", "张三", "经理", "移除"),
        ("☐", "李四", "开发", "移除"),
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
    base_path = "d:\\dev\\2026\\1.3 code\\demo\\linsir-demo\\linsir-vue-admin\\apps\\linsir-web-system\\docs\\02-design\\04-ui-ux-design\\04-visual-design-manuscript\\02-visual-design"
    
    print("生成登录页...")
    login_img = draw_login_page()
    login_img.save(f"{base_path}\\01-login-page.png")
    print("✓ 登录页已生成")
    
    print("生成首页仪表盘...")
    dashboard_img = draw_dashboard()
    dashboard_img.save(f"{base_path}\\02-dashboard.png")
    print("✓ 首页仪表盘已生成")
    
    print("生成用户列表页...")
    user_list_img = draw_user_list()
    user_list_img.save(f"{base_path}\\03-user-list.png")
    print("✓ 用户列表页已生成")
    
    print("生成用户创建页...")
    user_create_img = draw_user_create()
    user_create_img.save(f"{base_path}\\04-user-create.png")
    print("✓ 用户创建页已生成")
    
    print("生成部门管理页...")
    dept_img = draw_department_management()
    dept_img.save(f"{base_path}\\05-department-management.png")
    print("✓ 部门管理页已生成")
    
    print("\n所有视觉稿PNG图片已生成完成！")

if __name__ == "__main__":
    main()
