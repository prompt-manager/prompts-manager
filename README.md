# 🤖 AI Prompt Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

AI 프롬프트의 생성, 관리, 평가를 위한 통합 웹 애플리케이션입니다. 프롬프트 엔지니어링 워크플로우를 효율적으로 지원합니다.

![Screenshot](https://img.shields.io/badge/Screenshot-Coming_Soon-lightgrey)

## ✨ 주요 기능

### 🔧 프롬프트 관리
- **버전 관리**: 프롬프트의 여러 버전을 추적하고 관리
- **CRUD 작업**: 프롬프트 생성, 수정, 삭제 기능
- **프로덕션 배포**: 검증된 프롬프트를 프로덕션에 배포

### 📊 데이터셋 관리
- **CSV 업로드**: 평가용 데이터셋을 CSV 형태로 업로드
- **데이터 시각화**: 업로드된 데이터셋의 내용을 테이블 형태로 확인
- **내보내기**: 데이터셋을 다양한 형식으로 내보내기

### 🧪 평가 시스템
- **자동 평가**: 프롬프트와 데이터셋을 매칭하여 자동 평가 실행
- **결과 추적**: 평가 결과를 시간순으로 추적하고 비교
- **성능 메트릭**: 다양한 평가 지표로 프롬프트 성능 측정



## 🛠 기술 스택

### Backend
- **FastAPI**: 고성능 Python 웹 프레임워크
- **PostgreSQL**: 관계형 데이터베이스
- **SQLAlchemy**: ORM (Object Relational Mapping)
- **Alembic**: 데이터베이스 마이그레이션 도구
- **Uvicorn**: ASGI 서버

### Frontend
- **React 19**: UI 라이브러리
- **TypeScript**: 정적 타입 지원
- **Ant Design**: UI 컴포넌트 라이브러리
- **Styled Components**: CSS-in-JS 스타일링
- **React Router**: 클라이언트 사이드 라우팅
- **Axios**: HTTP 클라이언트

### 인프라
- **Docker & Docker Compose**: 컨테이너화


## 🚀 빠른 시작

### 사전 요구사항

- [Docker](https://www.docker.com/) 및 Docker Compose
- [Node.js](https://nodejs.org/) 18+ (로컬 개발시)
- [Python](https://www.python.org/) 3.11+ (로컬 개발시)

### Docker로 실행 (권장)

1. **저장소 클론**
   ```bash
   git clone https://github.com/yourusername/prompts-manager.git
   cd prompts-manager
   ```

2. **서비스 시작**
   ```bash
   docker-compose up -d
   ```

3. **애플리케이션 접속**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:1122
   - API 문서: http://localhost:1122/docs

4. **서비스 중단**
   ```bash
   docker-compose down
   ```

### 로컬 개발 환경

#### Backend 설정

1. **의존성 설치**
   ```bash
   cd backend
   uv sync
   ```

2. **데이터베이스 설정**
   ```bash
   # PostgreSQL 실행 후
   export DATABASE_URL="postgresql://promptuser:promptpass@localhost:5432/promptdb"
   ```

3. **서버 실행**
   ```bash
   uvicorn app.main:app --reload --port 1122
   ```

#### Frontend 설정

1. **의존성 설치**
   ```bash
   cd frontend
   npm install
   ```

2. **환경변수 설정**
   ```bash
   # .env 파일 생성
   REACT_APP_API_URL=http://localhost:1122
   ```

3. **개발 서버 실행**
   ```bash
   npm start
   ```

## 📁 프로젝트 구조

```
prompts-manager/
├── backend/                 # FastAPI 백엔드
│   ├── app/
│   │   ├── core/           # 핵심 로직 (평가 메트릭, 평가자)
│   │   ├── models/         # 데이터베이스 모델
│   │   ├── routers/        # API 라우터
│   │   ├── schemas/        # Pydantic 스키마
│   │   └── utils/          # 유틸리티 함수
│   ├── migrations/         # Alembic 마이그레이션
│   ├── scripts/            # 관리 스크립트
│   └── pyproject.toml      # Python 프로젝트 설정
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── api/           # API 서비스
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── styles/        # 전역 스타일
│   │   ├── types/         # TypeScript 타입 정의
│   │   └── utils/         # 유틸리티 함수
│   └── package.json       # Node.js 프로젝트 설정
├── docker-compose.yml      # Docker 구성
└── README.md
```

## 📖 사용 가이드

### 1. 프롬프트 생성
1. 메인 페이지에서 "프롬프트 관리" 메뉴 클릭
2. "새 프롬프트 생성" 버튼 클릭
3. 프롬프트 내용과 메타데이터 입력
4. 저장하여 첫 번째 버전 생성

### 2. 데이터셋 업로드
1. "데이터셋 관리" 메뉴에서 "데이터셋 업로드" 클릭
2. CSV 파일 선택 및 업로드
3. 열 매핑 확인 및 저장

### 3. 평가 실행
1. "평가 관리" 메뉴에서 "새 평가" 클릭
2. 평가할 프롬프트와 데이터셋 선택
3. 평가 실행 후 결과 확인

## 🔧 개발 정보

### API 문서
백엔드 서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
- Swagger UI: http://localhost:1122/docs
- ReDoc: http://localhost:1122/redoc

### 데이터베이스 마이그레이션
```bash
cd backend
alembic upgrade head  # 최신 마이그레이션 적용
alembic revision --autogenerate -m "설명"  # 새 마이그레이션 생성
```

### 로그 확인
```bash
./view-logs.sh  # 모든 로그 확인
docker-compose logs -f backend  # 백엔드 로그
docker-compose logs -f frontend  # 프론트엔드 로그
```

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.


## ⭐ 프로젝트 지원

이 프로젝트가 유용하다면 ⭐를 눌러서 응원해주세요!

---

<div align="center">
Made with ❤️ by the AI Prompt Manager Team
</div>