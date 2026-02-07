
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os
from data_utils import load_and_preprocess_data, setup_plotting

# Configuration
# Usage: python step2_visualization.py [INPUT_FILE] [OUTPUT_DIR]
import sys

DEFAULT_INPUT = 'data/cirius_2026_jan.csv'
DEFAULT_OUTPUT = 'report_assets'

INPUT_FILE = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_INPUT
OUTPUT_DIR = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_OUTPUT

os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. Setup Korean Font and Styles
setup_plotting()

# 2. Load and Preprocess Data
df = load_and_preprocess_data(INPUT_FILE)

# 3. Exploratory Data Analysis & Visualization

# --- Figure 1: Daily Sales Trend (Line Chart) ---
plt.figure(figsize=(12, 6))
daily_sales = df.groupby('Date')['PaymentAmount'].sum()
sns.lineplot(x=daily_sales.index, y=daily_sales.values, marker='o', color='royalblue')
plt.title('2026년 1월 일별 매출 추이 (Daily Sales Trend)')
plt.ylabel('매출액 (KRW)')
plt.xlabel('날짜')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/daily_sales_trend.png')
plt.show() # In non-interactive environments, this might not show but saves.

# --- Figure 2: Top Selling Products (Bar Chart, Quantity) ---
# Group by ProductName, clean some names if necessary (e.g., remove option details if they are in ProductName)
# Assuming 'ProductName' is the base name. 
plt.figure(figsize=(12, 8))
top_products_qty = df.groupby('ProductName')['Quantity'].sum().sort_values(ascending=False).head(10)
sns.barplot(x=top_products_qty.values, y=top_products_qty.index, palette='viridis')
plt.title('판매 수량 기준 Top 10 인기 상품 (Top Products by Quantity)')
plt.xlabel('판매 수량')
plt.ylabel('상품명')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/top_products_qty.png')

# --- Figure 3: Revenue Share by Category (Pie/Donut Chart) ---
# Use 'Category' but highlight the issue if 'Main Screen' dominates
plt.figure(figsize=(8, 8))
category_share = df.groupby('Category')['PaymentAmount'].sum().sort_values(ascending=False).head(7) # Top 7 + Others
plt.pie(category_share, labels=category_share.index, autopct='%1.1f%%', startangle=140, colors=sns.color_palette('pastel'))
plt.title('카테고리별 매출 비중 (Revenue Share by Category)')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/category_share.png')

# --- Figure 4: Hourly Order Distribution (Heatmap/Bar) ---
plt.figure(figsize=(10, 5))
hourly_orders = df.groupby('Hour')['OrderID'].count() # Count orders
sns.barplot(x=hourly_orders.index, y=hourly_orders.values, color='salmon')
plt.title('시간대별 주문량 분포 (Hourly Order Distribution)')
plt.xlabel('시간 (Hour)')
plt.ylabel('주문 건수')
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/hourly_orders.png')

# --- Figure 5: Member vs Non-Member Contribution (Bar Chart) ---
plt.figure(figsize=(8, 6))
member_stats = df.groupby('MemberStatus').agg({'PaymentAmount': 'sum', 'OrderID': 'nunique'}).reset_index()
# Melt for easier plotting with hue
# Or just plot AOV comparison
member_stats['AOV'] = member_stats['PaymentAmount'] / member_stats['OrderID']

# Create subplots for Sales Share and AOV
fig, ax = plt.subplots(1, 2, figsize=(14, 6))

# Sales Share
sns.barplot(data=member_stats, x='MemberStatus', y='PaymentAmount', ax=ax[0], palette='coolwarm')
ax[0].set_title('회원 vs 비회원 총 매출 비교')
ax[0].set_ylabel('총 매출액 (KRW)')

# AOV Comparison
sns.barplot(data=member_stats, x='MemberStatus', y='AOV', ax=ax[1], palette='coolwarm')
ax[1].set_title('회원 vs 비회원 객단가(AOV) 비교')
ax[1].set_ylabel('객단가 (KRW)')

plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/member_comparison.png')

print("Step 2 Visualization Complete. Images saved to report_assets/")
