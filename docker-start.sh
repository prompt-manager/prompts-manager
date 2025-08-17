#!/bin/bash

echo "🐳 Prompt Manager Docker Compose 시작"
echo "======================================"

# Docker 및 Docker Compose 설치 확인
if ! command -v docker &> /dev/null; then
    echo "❌ Docker가 설치되지 않았습니다."
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose가 설치되지 않았습니다."
    exit 1
fi

# Docker 데몬 실행 확인
if ! docker info &> /dev/null; then
    echo "❌ Docker 데몬이 실행되지 않고 있습니다."
    echo "   sudo systemctl start docker 를 실행하세요."
    exit 1
fi

echo "🔧 기존 컨테이너 정리 중..."
docker compose down

echo "🏗️  이미지 빌드 및 컨테이너 시작..."
docker compose up --build -d

echo ""
echo "⏳ 서비스 시작 대기 중..."
sleep 10

# 서비스 상태 확인
echo ""
echo "📊 서비스 상태:"
docker compose ps

echo ""
echo "✅ 시작 완료! 다음 URL에서 접속 가능합니다:"
echo "🌐 프론트엔드: http://localhost:3000"
echo "🔗 백엔드 API: http://localhost:1122"
echo "📖 API 문서: http://localhost:1122/docs"
echo "🗄️  데이터베이스: localhost:5432"

echo ""
echo "📋 유용한 명령어:"
echo "   - 로그 확인: docker compose logs -f"
echo "   - 서비스 중지: docker compose down"
echo "   - 컨테이너 상태: docker compose ps"
