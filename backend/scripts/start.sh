#!/bin/bash

# 현재 디렉터리 설정
SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

# 가상환경 활성화
source "${SCRIPT_DIR}/../.venv/bin/activate"

# 백그라운드에서 Uvicorn 실행 (pid 저장)
nohup uvicorn app.main:app --host 0.0.0.0 --port 1122 > "${SCRIPT_DIR}/uvicorn.log" 2>&1 & echo $! > "${SCRIPT_DIR}/server.pid"

echo "🚀 FastAPI 서버가 시작되었습니다!"