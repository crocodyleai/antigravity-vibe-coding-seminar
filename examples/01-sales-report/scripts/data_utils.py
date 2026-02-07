
import pandas as pd
import os
import matplotlib.pyplot as plt
import seaborn as sns
import platform

def get_font_family():
    """
    Return the appropriate font family for Korean characters based on the OS.
    """
    system_name = platform.system()
    if system_name == "Darwin":  # macOS
        return "AppleGothic"
    elif system_name == "Windows":
        return "Malgun Gothic"
    else:  # Linux
        # Try to find a common Korean font or fallback
        return "NanumGothic"

def load_and_preprocess_data(file_path):
    """
    Loads order data and performs necessary preprocessing and cleaning.
    
    Improvements based on initial analysis:
    1. Handles missing 'Customer ID' by filling with 'NON_MEMBER'.
    2. Converts date columns to datetime objects.
    3. Cleans numeric columns (removes commas).
    4. Extracts time-based features (Year, Month, Day, Hour, Weekday).
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    print(f"Loading data from {file_path}...")
    df = pd.read_csv(file_path)

    # 1. Clean Column Names (strip whitespace, newlines)
    df.columns = df.columns.astype(str).str.strip().str.replace('\n', '')
    
    # 2. Key Column Mapping
    # Adjust these based on your specific CSV headers from Step 1
    col_map = {
        '주문일시': 'OrderDate',
        '주문번호': 'OrderID',
        '주문자ID': 'CustomerID',
        '주문자명': 'CustomerName',
        '총 결제금액(KRW)': 'PaymentAmount',
        '총 주문금액(KRW)': 'OrderAmount',
        '상품명(한국어 쇼핑몰)': 'ProductName',
        '수 량': 'Quantity',
        '메인카테고리 이름': 'Category',
        '주문 상태': 'OrderStatus'
    }
    
    # Handle '수 량' variation
    if '수 량' not in df.columns and '수량' in df.columns:
        col_map['수량'] = 'Quantity'
    else:
         col_map['수 량'] = 'Quantity'

    # Check for missing columns and rename
    missing_cols = [k for k in col_map.keys() if k not in df.columns]
    if missing_cols:
        print(f"Warning: The following expected columns are missing: {missing_cols}")
    
    df = df.rename(columns=col_map)
    
    # 3. Data Cleaning & Type Conversion
    
    # Date Conversion
    if 'OrderDate' in df.columns:
        df['OrderDate'] = pd.to_datetime(df['OrderDate'], errors='coerce')
        df['Year'] = df['OrderDate'].dt.year
        df['Month'] = df['OrderDate'].dt.month
        df['Day'] = df['OrderDate'].dt.day
        df['Hour'] = df['OrderDate'].dt.hour
        df['Weekday'] = df['OrderDate'].dt.day_name()
        df['Date'] = df['OrderDate'].dt.date # For daily grouping

    # Numeric Conversion (Remove commas)
    numeric_cols = ['PaymentAmount', 'OrderAmount', 'Quantity']
    for col in numeric_cols:
        if col in df.columns:
            if df[col].dtype == object:
                df[col] = df[col].astype(str).str.replace(',', '').apply(pd.to_numeric, errors='coerce')
            else:
                df[col] = pd.to_numeric(df[col], errors='coerce')

    # 4. Handle Missing Values / Anomalies (Feedback Implementation)
    
    # Customer ID: Fill NaNs with 'NON_MEMBER' (or check if it's Naver Pay)
    if 'CustomerID' in df.columns:
        # If CustomerID is missing, we treat them as Non-Member
        # We can also check '매출경로' if available to see if it's Naver Pay
        filled_count = df['CustomerID'].isnull().sum()
        df['CustomerID'] = df['CustomerID'].fillna('NON_MEMBER')
        print(f"  -> Filled {filled_count} missing CustomerIDs with 'NON_MEMBER'")
        
        # Create a simplified 'MemberStatus' column
        df['MemberStatus'] = df['CustomerID'].apply(lambda x: 'Non-Member' if x == 'NON_MEMBER' else 'Member')

    # Category Cleaning: 'Main Screen' etc. are not useful. 
    # We will rely on ProductName for analysis, but let's flag these rows.
    if 'Category' in df.columns:
        invalid_categories = ['메인화면', '구매하기', '네이버쇼핑검색 제외']
        # We won't delete them, but we might create a 'CleanedCategory' or just be aware.
        # For now, let's just print stats.
        print(f"  -> Category Distribution (Raw):\n{df['Category'].value_counts().head(5)}")

    print("Data loading and preprocessing complete.")
    return df

def setup_plotting():
    """Confingure matplotlib for Korean support and better aesthetics"""
    font_family = get_font_family()
    plt.rcParams['font.family'] = font_family
    plt.rcParams['axes.unicode_minus'] = False
    sns.set_theme(style="whitegrid", font=font_family)
