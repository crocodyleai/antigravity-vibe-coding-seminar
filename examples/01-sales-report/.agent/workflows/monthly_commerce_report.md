
# Monthly Commerce Analysis Workflow

이 워크플로우를 실행하여 매월의 커머스 데이터를 분석하고 체계적으로 보고서를 생성합니다.

1.  **초기 설정 (Setup)**
    -   분석할 연월(YYYY_MM)을 결정합니다. (예: `2026_02`)
    -   해당 월의 보고서 폴더를 생성합니다: `mkdir -p reports/YYYY_MM/assets`
    -   분석할 데이터 파일 경로를 확인합니다. (예: `data/cirius_YYYY_MMM.csv`)

2.  **데이터 분석 (Data Analysis)**
    -   `pandas`를 사용하여 데이터 파일을 로드하고 기본 KPI를 분석합니다.
    -   스크립트 실행: `python scripts/step1_data_analysis.py data/cirius_YYYY_MMM.csv`

3.  **인사이트 탐색 및 시각화 (Visualization)**
    -   시각화 스크립트를 실행하여 차트를 생성하고, **월별 assets 폴더**에 저장합니다.
    -   스크립트 실행: `python scripts/step2_visualization.py data/cirius_YYYY_MMM.csv reports/YYYY_MM/assets`
    -   생성된 차트(`daily_sales_trend.png`, `top_products.png` 등)가 `reports/YYYY_MM/assets/`에 잘 들어갔는지 확인합니다.

4.  **보고서 기획 (Report Planning)**
    -   분석 결과와 시각화 자료를 바탕으로 핵심 인사이트를 도출합니다.
    -   기획안을 작성하여 저장합니다: `reports/YYYY_MM/plan.md`
    -   보고서의 논리적 흐름(Storyline)을 구성합니다.

5.  **최종 보고서 작성 (Final Report Writing)**
    -   Markdown 보고서를 작성합니다: `reports/YYYY_MM/report.md`
    -   이미지 경로는 상대 경로 `assets/이미지명.png`를 사용하여 삽입합니다.
    -   핵심 요약(Executive Summary)과 액션 아이템(Action Item)을 포함합니다.
    -   (옵션) HTML 변환이 필요하면 `report.html`도 같은 폴더에 생성합니다.
