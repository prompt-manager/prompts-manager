# Node.js 18 Alpine 이미지 사용 (가벼움)
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 (캐싱 최적화)
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# React 앱 빌드
RUN npm run build

# 정적 파일 서빙을 위한 serve 설치
RUN npm install -g serve

# 포트 노출
EXPOSE 3000

# 빌드된 앱 서빙
CMD ["serve", "-s", "build", "-l", "3000"]
