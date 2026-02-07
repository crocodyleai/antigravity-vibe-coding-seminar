# GEMINI.md - 우동 (Udon: 우리 동네 날씨)

> **Ver**: 1.0.0
> **Role**: Elite Frontend Developer & UI/UX Specialist (Apple Design Philosophy)
> **Mission**: "Make weather personal, beautiful, and instantly useful."

---

## 1. Project Identity & Philosophy

**"우동 (Udon)"**은 단순한 날씨 정보 나열이 아닙니다. 사용자의 현재 상황(Context)에 가장 필요한 **'인사이트'**를 던져주는 **라이프스타일 큐레이터**입니다.

### Design Principles (Apple-esque)
1.  **Extreme Minimalism**: 불필요한 선, 색, 텍스트는 모두 제거한다. 컨텐츠가 곧 UI다.
2.  **Context Aware**: "지금 비가 오나요?"보다 "언제 그치나요?"가 더 중요하다. 사용자의 질문을 예측하여 답을 제시한다.
3.  **Fluid Motion**: 모든 상태 변화(로딩, 화면 전환, 데이터 업데이트)는 물 흐르듯 자연스러워야 한다. (Skeleton UI 필수)
4.  **Glassmorphism & Depth**: 깊이감 있는 계층 구조와 블러(Blur) 효과를 사용하여 현대적이고 고급스러운 느낌을 준다.

---

## 2. Technical Stack (Over-engineering 지양)

성능 최적화와 유지보수 편의성을 최우선으로 고려합니다.

-   **Core**: React (Vite), TypeScript
-   **Styling**: **Vanilla CSS (CSS Modules)**
    -   *Why?* Tailwind의 제약 없이, Pixel-perfect한 디자인과 복잡한 애니메이션/그라디언트를 자유롭게 구현하기 위함.
    -   BEM Naming Convention 지향.
-   **State Management**: Zustand (가볍고 직관적) 혹은 React Context.
-   **Data Source**: [Open-Meteo API](https://open-meteo.com/) (Free, No API Key)
    -   Weather Forecast API
    -   Geocoding API (도시 검색)
-   **Persistence**: `localStorage` (사용자 설정 도시 저장 - 간편함 추구)

---

## 3. Core Features & User Scenarios

### A. The "Smart Headline" (핵심 기능)
사용자가 앱을 켜자마자 가장 먼저 봐야 할 정보를 **자연어 문장**으로 크게 노출합니다.
-   **Scenario 1 (Rain/Snow)**: "비, 약 4시간 뒤에 그칠 예정이에요." (Precipitation data 분석)
-   **Scenario 2 (Extreme Temp)**: "어제보다 5°C 더 추워요. 패딩을 챙기세요." (Yesterday comparison)
-   **Scenario 3 (Fine Weather)**: "맑음. 산책하기 딱 좋은 날씨네요."
-   **Logic**: 우선순위 큐(Priority Queue) 로직을 통해 현재 날씨 상태에 따른 가장 높은 가중치의 메시지 선택.

### B. Dashboard Visualization
-   **Main Card**: 현재 온도, 체감 온도, 최저/최고 온도.
-   **Hourly Forecast**: 가로 스크롤 가능한 24시간 예측 (그래프 + 아이콘).
-   **Daily Forecast**: 7일간의 예보 리스트.
-   **Details Grid**: 습도, 자외선(UV), 풍속, 가시거리 등 보조 지표.

### C. City Management (Multi-Location)
-   **Default**: 서울 관악구 (37.4782, 126.9515).
-   **Search**: 도시 이름 검색 및 목록 추가/삭제.
-   **UI**: iOS 날씨 앱과 유사한 카드 형태의 도시 목록 또는 스와이프 전환.

---

## 4. UI/UX Guidelines (Detail)

-   **Typography**:
    -   Font: `Roboto` (English), `Pretendard` (Korean).
    -   *Rationale*: "AI 티어 안 나는, 자연스럽고 전문적인 느낌" (No more Inter).
    -   Hierarchy: Headline(Bold, Large) > Subhead(Medium, Grey) > Body(Regular).
-   **Colors**:
    -   **Dynamic Background**: 시간대(낮/밤)와 날씨(맑음/흐림/비)에 따라 부드럽게 변하는 CSS Gradient Background.
    -   **Text**: White (어두운 배경 위주이므로), 투명도(`opacity`)를 조절하여 위계 구분 (1.0, 0.8, 0.6).
-   **Iconography**:
    -   Filled / Outline 스타일을 상황에 맞게 혼용하되, 통일감 유지. (Lucide React 추천)
    -   날씨 아이콘은 가능한 경우 Lottie 등의 마이크로 인터랙션 적용 고려.

---

## 5. Development Roadmap

1.  **Phase 1: Foundation**: 프로젝트 세팅, 컬러/폰트 시스템 정의, Open-Meteo API 연동 테스트.
2.  **Phase 2: Core Logic**: "Smart Headline" 알고리즘 구현 (날씨 데이터 분석 로직).
3.  **Phase 3: UI Implementation**: 메인 대시보드 퍼블리싱 (Glassmorphism 적용).
4.  **Phase 4: City Management**: 도시 검색 및 저장 기능.
5.  **Phase 5: Polish**: 로딩 스켈레톤, 애니메이션, 반응형 대응.

---

*이 문서는 프로젝트의 '헌법'과 같습니다. 모든 코드는 이 철학을 따릅니다.*
