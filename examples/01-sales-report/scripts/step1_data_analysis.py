
import pandas as pd
import numpy as np
import os

import sys
# Configuration
INPUT_FILE = sys.argv[1] if len(sys.argv) > 1 else 'data/cirius_2026_jan.csv'
OUTPUT_FILE = 'data/processed_orders.csv'

def load_and_preprocess():
    print(f"Loading data from {INPUT_FILE}...")
    
    # 1. Load Data
    try:
        df = pd.read_csv(INPUT_FILE)
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return None

    # 2. Clean Column Names
    df.columns = df.columns.astype(str).str.strip().str.replace('\n', '')
    print("Columns cleaned.")
    
    # 3. Column Mapping Check
    required_columns = {
        'Order ID': '주문번호',
        'Time': '주문일시',
        'Customer ID': '주문자ID',
        'Customer Name': '주문자명',
        'Product': '상품명(한국어 쇼핑몰)',
        'Category': '메인카테고리 이름',
        'Price': '총 결제금액(KRW)',
        'Quantity': '수 량' # Note the space in original if present, but we stripped
    }
    
    # Handle '수 량' being stripped to '수 량' or '수량'? 
    # The inspect showed '수 량'. strip() handles leading/trailing, not internal. 
    # Let's check if '수량' exists or '수 량'.
    if '수 량' in df.columns:
        required_columns['Quantity'] = '수 량'
    elif '수량' in df.columns:
        required_columns['Quantity'] = '수량'
    
    missing_cols = [col for col in required_columns.values() if col not in df.columns]
    if missing_cols:
        print(f"Warning: Missing columns: {missing_cols}")
        # Try to find alternatives or just warn
    
    # 4. Preprocessing
    # Date conversion
    df['주문일시'] = pd.to_datetime(df['주문일시'], errors='coerce')
    df['Year'] = df['주문일시'].dt.year
    df['Month'] = df['주문일시'].dt.month
    df['Day'] = df['주문일시'].dt.day
    df['Hour'] = df['주문일시'].dt.hour
    df['Weekday'] = df['주문일시'].dt.day_name()
    
    # Numeric conversion
    numeric_cols = ['총 결제금액(KRW)', '총 주문금액(KRW)', '판매가', '옵션+판매가', required_columns.get('Quantity')]
    for col in numeric_cols:
        if col in df.columns:
            # Remove comma and convert
            if df[col].dtype == object:
                df[col] = df[col].astype(str).str.replace(',', '').apply(pd.to_numeric, errors='coerce')
            else:
                df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # 5. Basic Statistics
    print("\n--- Data Analysis Summary ---")
    total_orders = df['주문번호'].nunique()
    total_sales = df['총 결제금액(KRW)'].sum()
    start_date = df['주문일시'].min()
    end_date = df['주문일시'].max()
    
    print(f"Period: {start_date} ~ {end_date}")
    print(f"Total Orders: {total_orders}")
    print(f"Total Sales: {total_sales:,.0f} KRW")
    
    if '주문자ID' in df.columns:
        total_customers = df['주문자ID'].nunique()
        print(f"Total Members (ID): {total_customers}")
    
    print("\n--- Top 5 Categories ---")
    if '메인카테고리 이름' in df.columns:
        print(df['메인카테고리 이름'].value_counts().head(5))

    print("\n--- Null Values ---")
    print(df.isnull().sum()[df.isnull().sum() > 0])
    
    return df

if __name__ == "__main__":
    df = load_and_preprocess()
    if df is not None:
        # Save processed data for next steps if needed, or just keep it in memory usage
        # For now, just analysis.
        print("\nStep 1 Analysis Complete.")
