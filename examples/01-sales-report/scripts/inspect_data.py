
import pandas as pd
import sys

def inspect_csv(file_path):
    try:
        df = pd.read_csv(file_path)
        print("--- Column Names ---")
        for col in df.columns:
            print(col)
        print("\n--- First Row Sample ---")
        print(df.iloc[0].to_dict())
        print("\n--- Basic Info ---")
        print(df.info())
    except Exception as e:
        print(f"Error reading CSV: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        inspect_csv(sys.argv[1])
    else:
        print("Please provide a file path.")
