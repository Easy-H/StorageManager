# StorageManager (재고 관리 시스템)

**StorageManager**는 React Native와 Firebase를 기반으로 구축된 효율적인 재고 및 조직 관리 솔루션입니다. 여러 조직이 독립적으로 제품을 관리하고, 실시간으로 입출고를 추적하며, 재고 부족 알림 및 실사 확인 기능을 통해 정확한 자산 관리를 지원합니다.

## 🚀 주요 기능

### 1. 조직 관리 (Organization Management)
- **멤버 권한 관리**: 관리자(ADMIN)와 멤버(MEMBER) 권한으로 구분된 사용자 관리.
- **조직 설정**: 조직 이름 변경 및 고유 설정을 통한 맞춤형 환경 구축.
- **실시간 협업**: Firestore의 실시간 구독 기능을 통해 멤버 간 데이터 동기화.

### 2. 제품 및 재고 관리 (Inventory Control)
- **제품 CRUD**: 제품 등록, 수정, 삭제 및 초기 재고 설정.
- **입출고 트랜잭션**: 입고(IN), 출고(OUT) 및 직접 수량 수정을 지원하며, Firebase Transaction을 통해 데이터 무결성 보장.
- **재고 실사(Audit)**: 실제 재고와 시스템 수량을 대조하는 실사 확인 기능 및 최근 실사일 추적.
- **재고 부족 알림**: 안전 재고(Safety Stock) 기준 미달 품목에 대한 대시보드 알림.

### 3. 입출고 로그 및 이력 (Inventory Logs)
- **활동 로깅**: 모든 재고 변동 내역(누가, 언제, 어떤 제품을, 얼마나)을 자동으로 기록.
- **작업 취소(Undo)**: 실수로 기록된 입출고 내역을 안전하게 취소하고 재고를 원복하는 기능.

### 4. 스마트 검색 및 스캐닝
- **바코드 스캔**: 카메라를 통한 바코드 인식으로 빠른 제품 검색 및 추가.
- **한글 초성 검색**: `hangul-js`를 활용하여 한국어 환경에 최적화된 검색 경험 제공.
- **디바운싱(Debounce)**: 최적화된 검색 성능을 위해 입력 지연 처리 적용.

## 🛠 기술 스택

- **Frontend**: React Native, TypeScript
- **Backend/Database**: Firebase Firestore, Firebase Auth
- **State Management**: React Hooks (Custom Hooks: `useProductActions`, `useOrgManage` 등)
- **UI Components**: Styled Custom Components (`Box`, `H2`, `LinkButton` 등)
- **Library**: `hangul-js` (한글 처리), `react-native-vision-camera` (추정)

## 📂 프로젝트 구조

```text
src/
├── common/             # 공통 컴포넌트, API 설정 및 유틸리티
├── features/
│   ├── org/            # 조직 관리 기능 (API, Hooks, Types)
│   ├── product/        # 제품 및 재고 관리 기능
│   ├── todo/           # 입출고 작업(Todo) 연동 기능
├── pages/              # 주요 페이지 구성 (ShopPage 등)
└── styles/             # 전역 스타일 및 테마 정의
```

## 📏 코딩 컨벤션

이 프로젝트는 지속 가능한 코드 품질을 위해 다음 규칙을 준수합니다.

- **파일 분리**: 한 파일이 200줄을 초과할 경우 기능별로 파일을 분리합니다. (`GEMINI.md` 가이드라인)
- **데이터 무결성**: 모든 재고 변경 로직은 `runTransaction` 내에서 처리하여 동시성 문제를 방지합니다.
- **비정규화**: 검색 성능 및 UI 렌더링 최적화를 위해 로그 데이터에 제품 이름을 포함하는 등의 비정규화 전략을 사용합니다.

## ⚙️ 시작하기

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **Firebase 설정**
   - `src/common/api/firebase/firebase.ts` (또는 해당 경로)에 Firebase 프로젝트 설정을 추가합니다.

3. **앱 실행**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

---
*이 문서는 프로젝트의 현재 소스 코드를 분석하여 자동으로 요약된 가이드입니다.*