#!/bin/bash

echo "🛑 Prompt Manager Docker Compose 중지"
echo "====================================="

echo "🔧 컨테이너 중지 및 정리 중..."
docker compose down

echo "🧹 사용하지 않는 이미지 정리..."
docker image prune -f

echo ""
echo "✅ 모든 서비스가 중지되었습니다."

echo ""
echo "📋 추가 정리 옵션:"
echo "   - 볼륨까지 삭제: docker compose down -v"
echo "   - 모든 이미지 삭제: docker image prune -a"
