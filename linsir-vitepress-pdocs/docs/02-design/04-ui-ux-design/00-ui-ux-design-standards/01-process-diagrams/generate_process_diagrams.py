#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UI/UX设计流程图生成脚本
基于 Mermaid 语法生成流程图 PNG
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_overall_process():
    """生成UI/UX整体设计流程图"""
    # 创建画布
    width, height = 1400, 900
    img = Image.new('RGB', (width, height), '#FAFBFC')
    draw = ImageDraw.Draw(img)
    
    # 尝试加载字体
    try:
        font_title = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 24)
        font_stage = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 16)
        font_text = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 12)
    except:
        font_title = ImageFont.load_default()
        font_stage = ImageFont.load_default()
        font_text = ImageFont.load_default()
    
    # 绘制标题
    draw.text((width//2 - 200, 20), "UI/UX设计整体流程", fill='#1A1A1A', font=font_title)
    
    # 定义阶段配置
    stages = [
        {"name": "开始", "color": "#E3F2FD", "x": 100, "y": 100, "docs": 0},
        {"name": "用户研究", "color": "#FFF3E0", "x": 250, "y": 100, "docs": 7},
        {"name": "信息架构", "color": "#FFF3E0", "x": 450, "y": 100, "docs": 4},
        {"name": "交互设计", "color": "#FFF3E0", "x": 650, "y": 100, "docs": 4},
        {"name": "视觉设计", "color": "#FFF3E0", "x": 850, "y": 100, "docs": 4},
        {"name": "原型设计", "color": "#FFF3E0", "x": 1050, "y": 100, "docs": 3},
        {"name": "模块设计", "color": "#FFF3E0", "x": 1250, "y": 100, "docs": 5},
        {"name": "结束", "color": "#E8F5E9", "x": 1250, "y": 750, "docs": 0},
    ]
    
    # 绘制阶段框
    box_width, box_height = 140, 80
    for stage in stages:
        # 绘制圆角矩形
        x, y = stage["x"], stage["y"]
        draw.rounded_rectangle(
            [x - box_width//2, y - box_height//2, x + box_width//2, y + box_height//2],
            radius=10,
            fill=stage["color"],
            outline='#BDBDBD',
            width=2
        )
        
        # 绘制阶段名称
        text_bbox = draw.textbbox((0, 0), stage["name"], font=font_stage)
        text_width = text_bbox[2] - text_bbox[0]
        draw.text((x - text_width//2, y - 15), stage["name"], fill='#1A1A1A', font=font_stage)
        
        # 绘制文档数量
        if stage["docs"] > 0:
            docs_text = f"{stage['docs']}个文档"
            text_bbox = draw.textbbox((0, 0), docs_text, font=font_text)
            text_width = text_bbox[2] - text_bbox[0]
            draw.text((x - text_width//2, y + 15), docs_text, fill='#666666', font=font_text)
    
    # 绘制连接线
    line_y_start = 140
    line_y_end = 710
    
    # 水平主线
    draw.line([(170, line_y_start), (1180, line_y_start)], fill='#9E9E9E', width=2)
    
    # 垂直线到结束
    draw.line([(1180, line_y_start), (1180, line_y_end)], fill='#9E9E9E', width=2)
    
    # 绘制箭头
    arrow_points = [
        (230, line_y_start),  # 开始到用户研究
        (430, line_y_start),  # 用户研究到信息架构
        (630, line_y_start),  # 信息架构到交互设计
        (830, line_y_start),  # 交互设计到视觉设计
        (1030, line_y_start), # 视觉设计到原型设计
        (1180, line_y_start), # 原型设计到模块设计
        (1180, 710),          # 模块设计到结束
    ]
    
    for i, point in enumerate(arrow_points[:-1]):
        if i < 5:
            # 水平箭头
            draw.polygon([
                (point[0] + 15, point[1] - 5),
                (point[0] + 25, point[1]),
                (point[0] + 15, point[1] + 5)
            ], fill='#9E9E9E')
        else:
            # 垂直箭头
            draw.polygon([
                (point[0] - 5, point[1] + 15),
                (point[0], point[1] + 25),
                (point[0] + 5, point[1] + 15)
            ], fill='#9E9E9E')
    
    # 绘制评审节点
    review_positions = [
        (350, 250, "评审"),
        (550, 250, "评审"),
        (750, 250, "评审"),
        (950, 250, "评审"),
        (1150, 250, "评审"),
        (1150, 450, "评审"),
    ]
    
    for x, y, text in review_positions:
        # 绘制菱形评审框
        diamond_size = 50
        draw.polygon([
            (x, y - diamond_size),
            (x + diamond_size, y),
            (x, y + diamond_size),
            (x - diamond_size, y)
        ], fill='#FFEBEE', outline='#EF5350', width=2)
        
        # 绘制评审文字
        text_bbox = draw.textbbox((0, 0), text, font=font_text)
        text_width = text_bbox[2] - text_bbox[0]
        draw.text((x - text_width//2, y - 6), text, fill='#C62828', font=font_text)
    
    # 绘制评审连接线
    review_lines = [
        (350, 140, 350, 200),   # 用户研究评审
        (550, 140, 550, 200),   # 信息架构评审
        (750, 140, 750, 200),   # 交互设计评审
        (950, 140, 950, 200),   # 视觉设计评审
        (1150, 140, 1150, 200), # 原型设计评审
        (1150, 300, 1150, 400), # 模块设计评审
    ]
    
    for x1, y1, x2, y2 in review_lines:
        # 绘制虚线
        draw.line([(x1, y1), (x2, y2)], fill='#9E9E9E', width=1)
    
    # 绘制图例
    legend_y = 550
    draw.text((50, legend_y), "图例:", fill='#1A1A1A', font=font_stage)
    
    # 开始/结束
    draw.rounded_rectangle([50, legend_y + 30, 150, legend_y + 60], radius=5, fill='#E3F2FD', outline='#BDBDBD')
    draw.text((160, legend_y + 37), "开始/结束", fill='#666666', font=font_text)
    
    # 设计阶段
    draw.rounded_rectangle([50, legend_y + 70, 150, legend_y + 100], radius=5, fill='#FFF3E0', outline='#BDBDBD')
    draw.text((160, legend_y + 77), "设计阶段", fill='#666666', font=font_text)
    
    # 评审节点
    draw.polygon([(100, legend_y + 130), (130, legend_y + 145), (100, legend_y + 160), (70, legend_y + 145)], 
                 fill='#FFEBEE', outline='#EF5350')
    draw.text((140, legend_y + 140), "评审节点", fill='#666666', font=font_text)
    
    # 添加统计信息
    stats_y = 650
    draw.text((50, stats_y), "交付物统计:", fill='#1A1A1A', font=font_stage)
    draw.text((50, stats_y + 25), "• 设计文档: 27个", fill='#666666', font=font_text)
    draw.text((50, stats_y + 45), "• PNG资源: 14个", fill='#666666', font=font_text)
    draw.text((50, stats_y + 65), "• 评审次数: 6次", fill='#666666', font=font_text)
    
    return img

def create_stage_process(stage_name, steps, docs_count):
    """生成单个阶段的详细流程图"""
    width, height = 1000, 600
    img = Image.new('RGB', (width, height), '#FAFBFC')
    draw = ImageDraw.Draw(img)
    
    try:
        font_title = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 20)
        font_step = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 14)
        font_text = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 12)
    except:
        font_title = ImageFont.load_default()
        font_step = ImageFont.load_default()
        font_text = ImageFont.load_default()
    
    # 标题
    draw.text((width//2 - 150, 20), f"{stage_name}阶段流程", fill='#1A1A1A', font=font_title)
    
    # 绘制步骤
    box_width, box_height = 160, 70
    start_x = 120
    start_y = 120
    spacing_x = 200
    
    for i, step in enumerate(steps):
        x = start_x + (i % 4) * spacing_x
        y = start_y + (i // 4) * 150
        
        # 绘制步骤框
        draw.rounded_rectangle(
            [x - box_width//2, y - box_height//2, x + box_width//2, y + box_height//2],
            radius=8,
            fill='#E3F2FD',
            outline='#1976D2',
            width=2
        )
        
        # 步骤编号
        draw.ellipse([x - box_width//2 - 15, y - box_height//2 - 15, 
                      x - box_width//2 + 5, y - box_height//2 + 5], 
                     fill='#1976D2')
        draw.text((x - box_width//2 - 8, y - box_height//2 - 12), str(i+1), 
                  fill='white', font=font_text)
        
        # 步骤名称
        text_bbox = draw.textbbox((0, 0), step, font=font_step)
        text_width = text_bbox[2] - text_bbox[0]
        draw.text((x - text_width//2, y - 10), step, fill='#1A1A1A', font=font_step)
        
        # 绘制连接线
        if i < len(steps) - 1:
            if i % 4 < 3:  # 同行连接
                next_x = start_x + ((i + 1) % 4) * spacing_x
                next_y = y
                draw.line([(x + box_width//2, y), (next_x - box_width//2, next_y)], 
                         fill='#9E9E9E', width=2)
                # 箭头
                draw.polygon([
                    (next_x - box_width//2 - 10, next_y - 5),
                    (next_x - box_width//2, next_y),
                    (next_x - box_width//2 - 10, next_y + 5)
                ], fill='#9E9E9E')
            else:  # 换行连接
                next_x = start_x
                next_y = start_y + ((i + 1) // 4) * 150
                draw.line([(x, y + box_height//2), (x, next_y - box_height//2)], 
                         fill='#9E9E9E', width=2)
                draw.line([(x, next_y - box_height//2), (next_x - box_width//2, next_y - box_height//2)], 
                         fill='#9E9E9E', width=2)
    
    # 绘制评审节点
    review_x = width - 150
    review_y = height // 2
    
    # 菱形
    draw.polygon([
        (review_x, review_y - 50),
        (review_x + 50, review_y),
        (review_x, review_y + 50),
        (review_x - 50, review_y)
    ], fill='#FFEBEE', outline='#EF5350', width=2)
    
    text_bbox = draw.textbbox((0, 0), "评审", font=font_step)
    text_width = text_bbox[2] - text_bbox[0]
    draw.text((review_x - text_width//2, review_y - 8), "评审", fill='#C62828', font=font_step)
    
    # 绘制输出框
    output_x = width - 150
    output_y = height - 100
    
    draw.rounded_rectangle(
        [output_x - 80, output_y - 40, output_x + 80, output_y + 40],
        radius=8,
        fill='#C8E6C9',
        outline='#388E3C',
        width=2
    )
    
    output_text = f"{docs_count}个文档"
    text_bbox = draw.textbbox((0, 0), output_text, font=font_step)
    text_width = text_bbox[2] - text_bbox[0]
    draw.text((output_x - text_width//2, output_y - 8), output_text, fill='#1B5E20', font=font_step)
    
    # 连接线到评审
    last_step_x = start_x + ((len(steps) - 1) % 4) * spacing_x
    last_step_y = start_y + ((len(steps) - 1) // 4) * 150
    
    draw.line([(last_step_x + box_width//2, last_step_y), (review_x - 50, review_y)], 
             fill='#9E9E9E', width=2)
    
    # 评审到输出
    draw.line([(review_x, review_y + 50), (review_x, output_y - 40)], 
             fill='#9E9E9E', width=2)
    
    # 不通过返回线（虚线）
    draw.line([(review_x - 50, review_y), (review_x - 150, review_y), 
               (review_x - 150, start_y), (start_x - box_width//2 - 20, start_y)], 
             fill='#EF5350', width=1)
    draw.text((review_x - 140, review_y - 20), "不通过", fill='#EF5350', font=font_text)
    
    return img

def main():
    """主函数：生成所有流程图"""
    output_dir = "d:\\dev\\2026\\1.3 code\\demo\\linsir-demo\\linsir-vue-admin\\apps\\linsir-web-system\\docs\\02-design\\04-ui-ux-design\\00-ui-ux-design-standards\\01-process-diagrams"
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    print("开始生成UI/UX设计流程图...")
    
    # 1. 生成整体流程图
    print("生成整体流程图...")
    overall_img = create_overall_process()
    overall_img.save(os.path.join(output_dir, "01-ui-ux-overall-process.png"))
    print("✓ 01-ui-ux-overall-process.png")
    
    # 2. 生成各阶段流程图
    stages = [
        ("02-user-research-process", "用户研究", 
         ["分析用户画像", "研究行为模式", "调研交互习惯", "收集视觉偏好", "细化设计场景", "识别设计机会", "编写研究报告"], 7),
        ("03-information-architecture-process", "信息架构", 
         ["设计站点地图", "规划导航结构", "建立内容分类", "编写架构文档"], 4),
        ("04-interaction-design-process", "交互设计", 
         ["设计任务流程", "绘制线框图", "编写交互说明", "整理设计文档"], 4),
        ("05-visual-design-process", "视觉设计", 
         ["建立设计系统", "设计视觉稿", "制作Mockups", "生成PNG资源"], 4),
        ("06-prototype-design-process", "原型设计", 
         ["制定原型规范", "制作可交互原型", "编写原型说明"], 3),
        ("07-module-design-process", "模块设计", 
         ["用户管理模块", "组织架构模块", "权限管理模块", "系统配置模块", "编写评审记录"], 5),
    ]
    
    for filename, stage_name, steps, docs_count in stages:
        print(f"生成{stage_name}流程图...")
        img = create_stage_process(stage_name, steps, docs_count)
        img.save(os.path.join(output_dir, f"{filename}.png"))
        print(f"✓ {filename}.png")
    
    print("\n所有流程图生成完成！")
    print(f"输出目录: {output_dir}")

if __name__ == "__main__":
    main()
