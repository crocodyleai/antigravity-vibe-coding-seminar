
import pandas as pd
from data_utils import load_and_preprocess_data

INPUT_FILE = 'data/cirius_2026_jan.csv'

def get_key_insights():
    df = load_and_preprocess_data(INPUT_FILE)
    
    print("\n--- Insight Generation ---")
    
    # 1. Top 5 Products by Quantity and Revenue
    print("\n[Top 5 Products by Quantity]")
    print(df.groupby('ProductName')['Quantity'].sum().sort_values(ascending=False).head(5))
    
    print("\n[Top 5 Products by Revenue]")
    print(df.groupby('ProductName')['PaymentAmount'].sum().sort_values(ascending=False).head(5))
    
    # 2. Peak Hour
    peak_hour = df.groupby('Hour')['OrderID'].count().idxmax()
    peak_hour_count = df.groupby('Hour')['OrderID'].count().max()
    print(f"\n[Peak Hour]: {peak_hour}시 ({peak_hour_count} orders)")
    
    # 3. Member vs Non-Member AOV
    if 'MemberStatus' in df.columns:
        aov_stats = df.groupby('MemberStatus').agg({'PaymentAmount': 'sum', 'OrderID': 'nunique'})
        aov_stats['AOV'] = aov_stats['PaymentAmount'] / aov_stats['OrderID']
        print("\n[Member vs Non-Member stats]")
        print(aov_stats)
        
    # 4. Weekday analysis
    print("\n[Weekday Analysis]")
    print(df.groupby('Weekday')['OrderID'].count().sort_values(ascending=False))

if __name__ == "__main__":
    get_key_insights()
