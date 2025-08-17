#!/bin/bash

echo "📋 Prompt Manager 로그 뷰어"
echo "=================================="

show_help() {
    echo "사용법: ./view-logs.sh [옵션]"
    echo ""
    echo "옵션:"
    echo "  -h, --help          도움말 출력"
    echo "  -f, --follow        실시간 로그 확인"
    echo "  -t, --tail [숫자]   최근 N줄만 확인 (기본: 50)"
    echo "  -s, --service [이름] 특정 서비스만 확인 (backend|frontend|db|all)"
    echo ""
    echo "예시:"
    echo "  ./view-logs.sh -f                    # 모든 서비스 실시간 로그"
    echo "  ./view-logs.sh -s backend -t 100     # 백엔드 최근 100줄"
    echo "  ./view-logs.sh -s backend -f         # 백엔드 실시간 로그"
}

# 기본값 설정
FOLLOW=false
TAIL_LINES=50
SERVICE="all"

# 인수 파싱
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -f|--follow)
            FOLLOW=true
            shift
            ;;
        -t|--tail)
            TAIL_LINES="$2"
            shift 2
            ;;
        -s|--service)
            SERVICE="$2"
            shift 2
            ;;
        *)
            echo "알 수 없는 옵션: $1"
            show_help
            exit 1
            ;;
    esac
done

# Docker Compose 로그 확인
if [ "$SERVICE" = "all" ]; then
    echo "📊 모든 서비스 로그 확인 중..."
    if [ "$FOLLOW" = true ]; then
        sudo docker compose logs -f
    else
        sudo docker compose logs --tail=$TAIL_LINES
    fi
else
    echo "📊 $SERVICE 서비스 로그 확인 중..."
    if [ "$FOLLOW" = true ]; then
        sudo docker compose logs -f $SERVICE
    else
        sudo docker compose logs --tail=$TAIL_LINES $SERVICE
    fi
fi

echo ""
echo "📁 파일 로그 위치:"
echo "  - 백엔드: ./logs/backend/"
echo "  - 프론트엔드: ./logs/frontend/"  
echo "  - Docker 로그: docker compose logs [서비스명]"
