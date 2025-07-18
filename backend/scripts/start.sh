#!/bin/bash

# 현재 디렉터리 설정
SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)
BACKEND_DIR="${SCRIPT_DIR}/.."

# 가상환경 활성화
source "${SCRIPT_DIR}/../.venv/bin/activate"

# backend 디렉토리로 이동한 후 Uvicorn 실행 (pid 저장)
cd "${BACKEND_DIR}" && nohup uvicorn app.main:app --host 0.0.0.0 --port 1122 > "${SCRIPT_DIR}/uvicorn.log" 2>&1 & echo $! > "${SCRIPT_DIR}/server.pid"

echo "🚀 FastAPI 서버가 시작되었습니다!"