#!/bin/bash

SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

# PID 파일 경로
PID_FILE="${SCRIPT_DIR}/server.pid"

# PID 파일에서 프로세스 종료를 시도하는 함수
stop_by_pidfile() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo "⛔️ FastAPI 서버를 종료합니다. (PID: $PID)"
            
            # 먼저 graceful shutdown 시도 (TERM 시그널)
            echo "🔄 Graceful shutdown을 시도합니다..."
            kill -TERM $PID
            
            # 최대 10초 대기
            for i in {1..10}; do
                if ! ps -p $PID > /dev/null 2>&1; then
                    echo "✅ 서버가 정상적으로 종료되었습니다."
                    rm "$PID_FILE"
                    return 0
                fi
                sleep 1
                echo "⏳ 종료 대기 중... ($i/10)"
            done
            
            # graceful shutdown이 실패한 경우 강제 종료
            echo "⚠️ Graceful shutdown이 실패했습니다. 강제 종료합니다."
            kill -KILL $PID
            
            # 강제 종료 확인
            sleep 1
            if ! ps -p $PID > /dev/null 2>&1; then
                echo "✅ 서버가 강제로 종료되었습니다."
                rm "$PID_FILE"
                return 0
            else
                echo "❌ 서버 종료에 실패했습니다."
                return 1
            fi
        else
            echo "⚠️ PID 파일은 있지만 프로세스가 실행 중이 아닙니다."
            echo "🧹 PID 파일을 정리합니다."
            rm "$PID_FILE"
            return 0
        fi
    else
        return 1
    fi
}

# 포트 기반으로 프로세스를 찾아서 종료하는 함수
stop_by_port() {
    echo "🔍 1122 포트에서 실행 중인 uvicorn 프로세스를 찾습니다..."
    PIDS=$(ps aux | grep "uvicorn.*1122" | grep -v grep | awk '{print $2}')
    
    if [ -z "$PIDS" ]; then
        return 1
    fi
    
    for PID in $PIDS; do
        echo "⛔️ FastAPI 서버를 종료합니다. (PID: $PID)"
        kill -TERM $PID
        
        # 종료 확인
        sleep 2
        if ! ps -p $PID > /dev/null 2>&1; then
            echo "✅ 서버가 종료되었습니다. (PID: $PID)"
        else
            echo "⚠️ 강제 종료합니다. (PID: $PID)"
            kill -KILL $PID
        fi
    done
    
    return 0
}

# 메인 로직
echo "🛑 FastAPI 서버 종료를 시작합니다..."

# 1. PID 파일로 종료 시도
echo "📁 PID 파일 기반 종료를 시도합니다..."
stop_by_pidfile

# 2. 포트 기반으로 종료 시도 (항상 실행)
echo "🔍 포트 기반 종료를 시도합니다..."
stop_by_port

# 3. 최종 확인
echo "🔎 최종 확인 중..."
REMAINING=$(ps aux | grep "uvicorn.*1122" | grep -v grep | wc -l)
if [ "$REMAINING" -eq 0 ]; then
    # PID 파일이 남아있다면 정리
    [ -f "$PID_FILE" ] && rm "$PID_FILE"
    echo "✅ 모든 FastAPI 서버가 완전히 종료되었습니다."
    echo "🎉 작업이 완료되었습니다."
else
    echo "⚠️ 아직 실행 중인 프로세스가 있습니다:"
    ps aux | grep "uvicorn.*1122" | grep -v grep
    echo "💡 수동으로 종료하려면: kill -9 \$(ps aux | grep 'uvicorn.*1122' | grep -v grep | awk '{print \$2}')"
fi

exit 0