# Prompt Manager

## 📌 개요
Prompt Manager는 프롬프트 작성, 관리, 평가, 데이터셋 관리 등을 지원하는 통합 웹 애플리케이션입니다.  
이 문서는 **Backend**와 **Frontend** 개발 환경을 함께 안내합니다.

---

# Prompt Manager - Frontend

## 📌 개요
Prompt Manager 프로젝트의 프론트엔드 저장소입니다.  
이 저장소는 `prompts-manager` 레포지토리 내 `frontend` 폴더에 위치하며,  
UI 개발 및 프론트엔드 로직을 담당합니다.

---

## 🚀 주요 기능
- 프롬프트 생성 / 수정 / 관리 UI
- 데이터셋 및 평가 페이지
- Ant Design 기반 UI 컴포넌트
- React Router 기반 페이지 라우팅
- 상태 관리 (React 상태 훅)

---

## 🛠 기술 스택
- **React** (CRA 또는 Vite 기반)
- **TypeScript**
- **Ant Design**
- **styled-components**
- **React Router**
- **npm** (패키지 매니저)

---

## 📂 폴더 구조 예시

```
frontend/
├── public/ # 정적 파일
├── src/
│ ├── assets/ # 이미지, 아이콘
│ ├── components/ # 재사용 컴포넌트
│ ├── pages/ # 라우팅 페이지
│ ├── styles/ # 전역 스타일, SCSS, CSS 변수
│ ├── utils/ # 유틸리티 함수
│ ├── App.tsx # 진입 컴포넌트
│ ├── index.tsx # 엔트리 포인트
│ └── ...
├── package.json
└── README.md
```


## ⚙️ 환경 변수 설정
프로젝트 실행 전 `.env` 파일을 생성하고 필요한 변수를 설정하세요.

```env
REACT_APP_DEV_PROXY_SERVER=http://192.168.230.104:1122

# 패키지 설치
npm install

# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build

---

# Backend

## 📌 개요
(백엔드 개요 작성 — 예: Node.js/Express 기반 API 서버, DB 등)

## 🛠 기술 스택
- Node.js
- Express
- MongoDB (예시)
- npm

## ⚙️ 실행 방법
```bash
cd backend
npm install
npm run dev
