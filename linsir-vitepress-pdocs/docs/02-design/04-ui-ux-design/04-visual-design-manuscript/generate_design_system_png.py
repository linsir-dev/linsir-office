#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
设计系统PNG生成器
根据设计系统文档生成对应的PNG图片
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 设置中文字体
def get_font(size=14):
    """获取字体"""
    font_paths = [
        "C:/Windows/Fonts/msyh.ttc",  # 微软雅黑
        "C:/Windows/Fonts/simhei.ttf",  # 黑体
        "C:/Windows/Fonts/simsun.ttc",  # 宋体
    ]
    for path in font_paths:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()

# 颜色定义
COLORS = {
    # 品牌色
    "brand": {
        50: "#E6F7FF", 100: "#BAE7FF", 200: "#91D5FF", 300: "#69C0FF",
        400: "#40A9FF", 500: "#1890FF", 600: "#096DD9", 700: "#0050B3",
        800: "#003A8C", 900: "#002766"
    },
    # 中性色
    "gray": {
        50: "#F5F5F5", 100: "#F0F0F0", 200: "#D9D9D9", 300: "#BFBFBF",
        400: "#8C8C8C", 500: "#595959", 600: "#434343", 700: "#262626",
        800: "#1F1F1F", 900: "#141414"
    },
    # 功能色
    "success": {50: "#F6FFED", 100: "#D9F7BE", 500: "#52C41A", 600: "#389E0D"},
    "warning": {50: "#FFFBE6", 100: "#FFF1B8", 500: "#FAAD14", 600: "#D48806"},
    "error": {50: "#FFF2F0", 100: "#FFCCC7", 500: "#FF4D4F", 600: "#CF1322"},
    "info": {50: "#E6F7FF", 100: "#BAE7FF", 500: "#1890FF", 600: "#096DD9"},
}

def hex_to_rgb(hex_color):
    """将十六进制颜色转换为RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_color_palette():
    """绘制颜色色板"""
    width, height = 1200, 800
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(24)
    font_label = get_font(14)
    font_small = get_font(12)
    
    y_offset = 30
    
    # 标题
    draw.text((width//2 - 100, y_offset), "设计系统 - 颜色色板", fill=(0, 0, 0), font=font_title)
    y_offset += 60
    
    # 品牌色
    draw.text((50, y_offset), "品牌色 Brand Colors", fill=(0, 0, 0), font=font_label)
    y_offset += 40
    
    x_start = 50
    for level, color in COLORS["brand"].items():
        x = x_start + (level // 100) * 110
        rgb = hex_to_rgb(color)
        draw.rectangle([x, y_offset, x + 100, y_offset + 80], fill=rgb, outline=(200, 200, 200))
        draw.text((x + 5, y_offset + 85), f"Brand-{level}", fill=(100, 100, 100), font=font_small)
        draw.text((x + 5, y_offset + 100), color, fill=(100, 100, 100), font=font_small)
    
    y_offset += 140
    
    # 中性色
    draw.text((50, y_offset), "中性色 Gray Colors", fill=(0, 0, 0), font=font_label)
    y_offset += 40
    
    for level, color in COLORS["gray"].items():
        x = x_start + (level // 100 if level >= 100 else 0) * 110
        rgb = hex_to_rgb(color)
        draw.rectangle([x, y_offset, x + 100, y_offset + 80], fill=rgb, outline=(200, 200, 200))
        text_color = (255, 255, 255) if level >= 600 else (100, 100, 100)
        draw.text((x + 5, y_offset + 85), f"Gray-{level}", fill=(100, 100, 100), font=font_small)
        draw.text((x + 5, y_offset + 100), color, fill=(100, 100, 100), font=font_small)
    
    y_offset += 140
    
    # 功能色
    draw.text((50, y_offset), "功能色 Functional Colors", fill=(0, 0, 0), font=font_label)
    y_offset += 40
    
    func_colors = [
        ("Success", COLORS["success"]),
        ("Warning", COLORS["warning"]),
        ("Error", COLORS["error"]),
        ("Info", COLORS["info"]),
    ]
    
    for name, colors in func_colors:
        draw.text((50, y_offset), name, fill=(0, 0, 0), font=font_small)
        x = 150
        for level, color in colors.items():
            rgb = hex_to_rgb(color)
            draw.rectangle([x, y_offset, x + 80, y_offset + 60], fill=rgb, outline=(200, 200, 200))
            draw.text((x + 5, y_offset + 65), f"{level}", fill=(100, 100, 100), font=font_small)
            x += 90
        y_offset += 100
    
    return img

def draw_typography():
    """绘制字体系统"""
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(24)
    font_label = get_font(14)
    
    y_offset = 30
    
    # 标题
    draw.text((width//2 - 100, y_offset), "设计系统 - 字体系统", fill=(0, 0, 0), font=font_title)
    y_offset += 60
    
    # 字体大小展示
    font_sizes = [
        ("H1", 38, 600),
        ("H2", 30, 600),
        ("H3", 24, 600),
        ("H4", 20, 600),
        ("H5", 16, 600),
        ("Body", 14, 400),
        ("Small", 12, 400),
    ]
    
    for name, size, weight in font_sizes:
        try:
            font = get_font(size)
        except:
            font = get_font(14)
        
        draw.text((50, y_offset), f"{name} ({size}px)", fill=(100, 100, 100), font=font_label)
        draw.text((200, y_offset), f"这是一段示例文字 {name}", fill=(0, 0, 0), font=font)
        y_offset += size + 20
    
    # 字重展示
    y_offset += 30
    draw.text((50, y_offset), "字重 Weight", fill=(0, 0, 0), font=font_label)
    y_offset += 40
    
    weights = [("Regular", 400), ("Medium", 500), ("Semibold", 600), ("Bold", 700)]
    for name, weight in weights:
        draw.text((50, y_offset), name, fill=(100, 100, 100), font=font_label)
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc" if weight >= 600 else "C:/Windows/Fonts/msyh.ttc", 16)
        except:
            font = get_font(16)
        draw.text((200, y_offset), "这是一段示例文字", fill=(0, 0, 0), font=font)
        y_offset += 40
    
    return img

def draw_components():
    """绘制组件规范"""
    width, height = 1200, 900
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(24)
    font_label = get_font(14)
    font_small = get_font(12)
    
    y_offset = 30
    
    # 标题
    draw.text((width//2 - 100, y_offset), "设计系统 - 组件规范", fill=(0, 0, 0), font=font_title)
    y_offset += 60
    
    # 按钮展示
    draw.text((50, y_offset), "按钮 Buttons", fill=(0, 0, 0), font=font_label)
    y_offset += 50
    
    buttons = [
        ("主要按钮", "#1890FF", "#FFFFFF", "#1890FF"),
        ("次要按钮", "#FFFFFF", "#262626", "#D9D9D9"),
        ("文字按钮", "#FFFFFF", "#1890FF", "#FFFFFF"),
        ("危险按钮", "#FF4D4F", "#FFFFFF", "#FF4D4F"),
    ]
    
    x_offset = 50
    for name, bg, fg, border in buttons:
        bg_rgb = hex_to_rgb(bg)
        fg_rgb = hex_to_rgb(fg)
        border_rgb = hex_to_rgb(border)
        
        draw.rectangle([x_offset, y_offset, x_offset + 120, y_offset + 40], 
                      fill=bg_rgb, outline=border_rgb, width=1)
        draw.text((x_offset + 20, y_offset + 10), name, fill=fg_rgb, font=font_small)
        x_offset += 140
    
    y_offset += 80
    
    # 输入框展示
    draw.text((50, y_offset), "输入框 Input", fill=(0, 0, 0), font=font_label)
    y_offset += 50
    
    input_states = [
        ("默认", "#FFFFFF", "#D9D9D9"),
        ("悬停", "#FFFFFF", "#40A9FF"),
        ("聚焦", "#FFFFFF", "#1890FF"),
        ("错误", "#FFFFFF", "#FF4D4F"),
    ]
    
    x_offset = 50
    for name, bg, border in input_states:
        bg_rgb = hex_to_rgb(bg)
        border_rgb = hex_to_rgb(border)
        
        draw.rectangle([x_offset, y_offset, x_offset + 150, y_offset + 40], 
                      fill=bg_rgb, outline=border_rgb, width=2)
        draw.text((x_offset + 10, y_offset + 50), name, fill=(100, 100, 100), font=font_small)
        x_offset += 170
    
    y_offset += 100
    
    # 标签展示
    draw.text((50, y_offset), "标签 Tags", fill=(0, 0, 0), font=font_label)
    y_offset += 50
    
    tags = [
        ("默认", "#F5F5F5", "#262626"),
        ("主色", "#E6F7FF", "#1890FF"),
        ("成功", "#F6FFED", "#52C41A"),
        ("警告", "#FFFBE6", "#FAAD14"),
        ("错误", "#FFF2F0", "#FF4D4F"),
    ]
    
    x_offset = 50
    for name, bg, fg in tags:
        bg_rgb = hex_to_rgb(bg)
        fg_rgb = hex_to_rgb(fg)
        
        draw.rectangle([x_offset, y_offset, x_offset + 80, y_offset + 30], 
                      fill=bg_rgb, outline=bg_rgb)
        draw.text((x_offset + 20, y_offset + 5), name, fill=fg_rgb, font=font_small)
        x_offset += 100
    
    y_offset += 80
    
    # 表格展示
    draw.text((50, y_offset), "表格 Table", fill=(0, 0, 0), font=font_label)
    y_offset += 50
    
    # 表头
    header_rgb = hex_to_rgb("#F5F5F5")
    draw.rectangle([50, y_offset, 750, y_offset + 40], fill=header_rgb, outline=(217, 217, 217))
    headers = ["用户名", "姓名", "部门", "状态"]
    x = 60
    for header in headers:
        draw.text((x, y_offset + 10), header, fill=(0, 0, 0), font=font_small)
        x += 150
    
    y_offset += 40
    
    # 表格行
    for i in range(3):
        bg_rgb = (255, 255, 255) if i % 2 == 0 else hex_to_rgb("#F5F5F5")
        draw.rectangle([50, y_offset, 750, y_offset + 40], fill=bg_rgb, outline=(217, 217, 217))
        y_offset += 40
    
    return img

def draw_spacing_shadow():
    """绘制间距和阴影"""
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(24)
    font_label = get_font(14)
    font_small = get_font(12)
    
    y_offset = 30
    
    # 标题
    draw.text((width//2 - 120, y_offset), "设计系统 - 间距与阴影", fill=(0, 0, 0), font=font_title)
    y_offset += 60
    
    # 间距展示
    draw.text((50, y_offset), "间距 Spacing", fill=(0, 0, 0), font=font_label)
    y_offset += 50
    
    spacings = [("xs", 4), ("sm", 8), ("md", 16), ("lg", 24), ("xl", 32), ("2xl", 48)]
    
    for name, size in spacings:
        draw.rectangle([50, y_offset, 50 + size, y_offset + 30], fill=(24, 144, 255))
        draw.text((50 + size + 10, y_offset + 5), f"{name} = {size}px", fill=(0, 0, 0), font=font_small)
        y_offset += 50
    
    y_offset += 30
    
    # 阴影展示
    draw.text((50, y_offset), "阴影 Shadow", fill=(0, 0, 0), font=font_label)
    y_offset += 50
    
    shadows = [
        ("Shadow-1", "卡片默认"),
        ("Shadow-2", "悬停状态"),
        ("Shadow-3", "下拉菜单"),
        ("Shadow-4", "弹窗"),
    ]
    
    x_offset = 50
    for name, desc in shadows:
        # 绘制带阴影效果的矩形（简化表示）
        gray = 240 - shadows.index((name, desc)) * 20
        draw.rectangle([x_offset, y_offset, x_offset + 150, y_offset + 100], 
                      fill=(gray, gray, gray), outline=(200, 200, 200))
        draw.text((x_offset + 10, y_offset + 110), name, fill=(0, 0, 0), font=font_small)
        draw.text((x_offset + 10, y_offset + 125), desc, fill=(100, 100, 100), font=font_small)
        x_offset += 180
    
    return img

def main():
    """主函数"""
    base_path = "d:\\dev\\2026\\1.3 code\\demo\\linsir-demo\\linsir-vue-admin\\apps\\linsir-web-system\\docs\\02-design\\04-ui-ux-design\\04-visual-design"
    
    # 生成颜色色板
    print("生成颜色色板...")
    color_img = draw_color_palette()
    color_img.save(f"{base_path}\\01-color-palette\\color-palette.png")
    print("✓ 颜色色板已生成")
    
    # 生成字体系统
    print("生成字体系统...")
    typo_img = draw_typography()
    typo_img.save(f"{base_path}\\02-typography\\typography-system.png")
    print("✓ 字体系统已生成")
    
    # 生成组件规范
    print("生成组件规范...")
    comp_img = draw_components()
    comp_img.save(f"{base_path}\\03-components\\component-specs.png")
    print("✓ 组件规范已生成")
    
    # 生成间距和阴影
    print("生成间距和阴影...")
    space_img = draw_spacing_shadow()
    space_img.save(f"{base_path}\\04-spacing-shadow\\spacing-shadow.png")
    print("✓ 间距和阴影已生成")
    
    print("\n所有PNG图片已生成完成！")

if __name__ == "__main__":
    main()
