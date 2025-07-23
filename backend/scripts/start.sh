#!/bin/bash

# 현재 디렉터리 설정
SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)
BACKEND_DIR="${SCRIPT_DIR}/.."
VENV_DIR="${BACKEND_DIR}/.venv"

# 가상환경 활성화
source "${VENV_DIR}/bin/activate"

# Uvicorn 실행 (절대 경로 사용)
LOG_FILE="${SCRIPT_DIR}/uvicorn.log"
PID_FILE="${SCRIPT_DIR}/server.pid"

echo "Starting server from: ${BACKEND_DIR}"
cd "${BACKEND_DIR}" && nohup "${VENV_DIR}/bin/uvicorn" app.main:app --host 0.0.0.0 --port 1122 > "${LOG_FILE}" 2>&1 & echo $! > "${PID_FILE}"

echo "🚀 FastAPI 서버가 시작되었습니다!"
echo "로그 파일: ${LOG_FILE}"
echo "PID 파일: ${PID_FILE}"