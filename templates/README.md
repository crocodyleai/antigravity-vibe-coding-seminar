# 📁 Templates

Antigravity 프로젝트 설정 템플릿 모음

## 파일 구조

```
templates/
├── gemini-empty.md              # GEMINI.md (빈 버전)
├── gemini-parkchajang.md        # GEMINI.md (박차장 버전)
└── .agent/
    ├── rules/                   # 룰 파일들
    │   ├── korean-style.md
    │   ├── coding-style.md
    │   └── output-format.md
    └── workflows/               # 워크플로우 파일들
        ├── 분석시작.md           # /분석시작
        ├── 주간리포트.md         # /주간리포트
        ├── 시각화.md            # /시각화
        └── 정리.md              # /정리
```

## Antigravity 설정 위치

| 종류 | 위치 | 범위 |
|------|------|------|
| Global Rules | `~/.gemini/GEMINI.md` | 모든 워크스페이스 |
| Workspace Rules | `.agent/rules/*.md` | 현재 워크스페이스 |
| Workflows | `.agent/workflows/*.md` | 현재 워크스페이스 |

## 사용법

### GEMINI.md 비교 데모

1. `gemini-empty.md` → `~/.gemini/GEMINI.md`로 복사
2. AI에게 인사해보기
3. `gemini-parkchajang.md`로 교체
4. 다시 인사해보기 → 차이 확인!

### .agent 설정

`.agent/` 폴더를 프로젝트 루트에 복사하면 룰과 워크플로우가 적용됩니다.

### 워크플로우 실행

채팅창에 `/워크플로우명` 입력:
- `/분석시작` - 데이터 초기 분석
- `/주간리포트` - 주간 판매 리포트 생성
- `/시각화` - 차트 생성
- `/정리` - 결과 요약

---

*필요에 따라 수정해서 사용하세요!*
