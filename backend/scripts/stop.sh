#!/bin/bash

SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

# PID 파일 경로
PID_FILE="${SCRIPT_DIR}/server.pid"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    echo "⛔️ FastAPI 서버를 종료합니다. (PID: $PID)"
    kill -9 $PID
    rm "$PID_FILE"
    echo "✅ 종료되었습니다."
else
    echo "⚠️ 실행 중인 FastAPI 서버가 없습니다."
fi