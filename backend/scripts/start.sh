#!/bin/bash

# 현재 디렉터리 설정
SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)
BACKEND_DIR="${SCRIPT_DIR}/.."
VENV_DIR="${BACKEND_DIR}/.venv"

# 가상환경 활성화 확인
if [ ! -d "$VENV_DIR" ]; then
    echo "❌ 가상환경을 찾을 수 없습니다: $VENV_DIR"
    exit 1
fi

# 이미 실행 중인 서버가 있는지 확인
PID_FILE="${SCRIPT_DIR}/server.pid"
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "⚠️ 서버가 이미 실행 중입니다. (PID: $PID)"
        echo "종료하려면 ./stop.sh를 실행하세요."
        exit 1
    else
        echo "🧹 이전 PID 파일을 정리합니다."
        rm "$PID_FILE"
    fi
fi

# 가상환경 활성화
source "${VENV_DIR}/bin/activate"

# 로그 파일 설정
LOG_FILE="${SCRIPT_DIR}/uvicorn.log"

echo "🚀 FastAPI 개발 서버를 시작합니다..."
echo "📁 백엔드 디렉터리: ${BACKEND_DIR}"
echo "📝 로그 파일: ${LOG_FILE}"
echo "🔄 리로드 모드: 활성화"

# Uvicorn 실행 (개발용 설정)
cd "${BACKEND_DIR}" && nohup "${VENV_DIR}/bin/uvicorn" app.main:app \
    --host 0.0.0.0 \
    --port 1122 \
    --reload \
    --reload-dir app \
    --log-level info \
    --access-log \
    > "${LOG_FILE}" 2>&1 & echo $! > "${PID_FILE}"

# 서버 시작 확인
sleep 2
PID=$(cat "$PID_FILE" 2>/dev/null)
if ps -p $PID > /dev/null 2>&1; then
    echo "✅ 서버가 성공적으로 시작되었습니다! (PID: $PID)"
    echo "🌐 URL: http://localhost:1122"
    echo "📖 API 문서: http://localhost:1122/docs"
    echo "📋 로그 확인: tail -f ${LOG_FILE}"
else
    echo "❌ 서버 시작에 실패했습니다."
    echo "📋 로그를 확인하세요: cat ${LOG_FILE}"
    exit 1
fi