
import pandas as pd
import sys

def inspect_csv(file_path):
    try:
        df = pd.read_csv(file_path)
        print("COLUMNS:")
        print(list(df.columns))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        inspect_csv(sys.argv[1])
