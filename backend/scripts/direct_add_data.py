#!/usr/bin/env python3
"""
평가 결과 데이터 직접 추가 (Raw SQL 사용)
"""

import asyncio
import sys
import os
from datetime import datetime, timezone

# 백엔드 프로젝트 경로 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import database


async def add_data_raw_sql():
    """Raw SQL로 직접 데이터 추가"""
    print("🚀 Raw SQL로 평가 결과 데이터 추가")
    
    try:
        await database.connect()
        print("✅ 데이터베이스 연결 성공")
        
        # 현재 시간
        now = datetime.now(timezone.utc).isoformat()
        
        # Raw SQL 실행 (따옴표와 파라미터 없이)
        sql_commands = [
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (7, 1, 'response_time', 0.87, '{now}');",
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (8, 1, 'completeness', 0.92, '{now}');",
        ]
        
        added_count = 0
        for i, sql in enumerate(sql_commands, 1):
            try:
                # Raw SQL 직접 실행
                result = await database.execute(sql)
                print(f"✅ 데이터 {i} 추가 성공: {sql[:50]}...")
                added_count += 1
            except Exception as e:
                print(f"❌ 데이터 {i} 추가 실패: {e}")
        
        print(f"\n🎉 {added_count}개의 평가 결과 데이터가 추가되었습니다!")
        
        # 전체 데이터 확인
        check_sql = """
            SELECT 
                er.id, er.prompt_id, er.dataset_id, er.metric_name, er.score,
                p.node_name, p.version, p.production,
                d.name as dataset_name
            FROM evaluation_results er
            JOIN prompts p ON er.prompt_id = p.id
            JOIN datasets d ON er.dataset_id = d.id
            ORDER BY er.created_at DESC
        """
        
        results = await database.fetch_all(check_sql)
        
        print(f"\n📊 전체 평가 결과 데이터 ({len(results)}개):")
        for result in results:
            print(f"""   📈 ID: {result['id']}
      노드: {result['node_name']} (v{result['version']}, 프로덕션: {result['production']})
      데이터셋: {result['dataset_name']}
      메트릭: {result['metric_name']}, 점수: {result['score']}
      ---""")
        
        print(f"\n✅ 총 {len(results)}개의 평가 결과 데이터가 있습니다!")
        print("🎯 이제 UI에서 프로덕션 지정 테스트를 진행하세요.")
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        
    finally:
        await database.disconnect()
        print("🔌 데이터베이스 연결 종료")


if __name__ == "__main__":
    asyncio.run(add_data_raw_sql())