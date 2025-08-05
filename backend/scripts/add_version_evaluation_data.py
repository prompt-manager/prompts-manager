#!/usr/bin/env python3
"""
같은 노드의 여러 버전에 대한 평가 결과 데이터 추가

프로덕션 지정 테스트를 위해 한 노드의 여러 버전별로 평가 결과를 생성합니다.
"""

import asyncio
import sys
import os
from datetime import datetime, timezone

# 백엔드 프로젝트 경로 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import database
from sqlalchemy import text


async def add_version_evaluation_data():
    """같은 노드의 여러 버전에 대한 평가 결과 추가"""
    print("🚀 노드별 버전 평가 결과 데이터 추가 시작")
    
    try:
        await database.connect()
        print("✅ 데이터베이스 연결 성공")
        
        # 현재 시간
        now = datetime.now(timezone.utc).isoformat()
        
        # 검색노드의 여러 버전에 대한 평가 결과 데이터
        search_node_evaluations = [
            # 검색노드 버전별 accuracy 메트릭
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (1, 1, 'accuracy', 0.85, '{now}');",  # 검색노드 v1
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (3, 1, 'accuracy', 0.92, '{now}');",  # 검색노드 v2 (프로덕션)
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (12, 1, 'accuracy', 0.88, '{now}');", # 검색노드 v3
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (13, 1, 'accuracy', 0.95, '{now}');", # 검색노드 v4
            
            # 검색노드 버전별 response_time 메트릭
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (1, 1, 'response_time', 0.75, '{now}');",  # 검색노드 v1
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (3, 1, 'response_time', 0.82, '{now}');",  # 검색노드 v2
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (12, 1, 'response_time', 0.89, '{now}');", # 검색노드 v3
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (13, 1, 'response_time', 0.91, '{now}');", # 검색노드 v4
        ]
        
        # 요약노드의 여러 버전에 대한 평가 결과 데이터 
        summary_node_evaluations = [
            # 요약노드 버전별 completeness 메트릭
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (2, 1, 'completeness', 0.78, '{now}');",  # 요약노드 v1
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (7, 1, 'completeness', 0.84, '{now}');",  # 요약노드 v2
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (14, 1, 'completeness', 0.87, '{now}');", # 요약노드 v3
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (16, 1, 'completeness', 0.93, '{now}');", # 요약노드 v5 (프로덕션)
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (17, 1, 'completeness', 0.89, '{now}');", # 요약노드 v6
            f"INSERT INTO evaluation_results (prompt_id, dataset_id, metric_name, score, created_at) VALUES (20, 1, 'completeness', 0.91, '{now}');", # 요약노드 v7
        ]
        
        all_evaluations = search_node_evaluations + summary_node_evaluations
        
        print(f"📈 {len(all_evaluations)}개의 평가 결과 데이터 추가 중...")
        
        added_count = 0
        for i, sql in enumerate(all_evaluations, 1):
            try:
                await database.execute(sql)
                # 간략하게 표시
                if "검색노드" in sql or i <= 8:
                    node_type = "검색노드" if i <= 8 else "요약노드"
                    version = ((i-1) % 4) + 1 if i <= 8 else [1,2,3,5,6,7][(i-9) % 6]
                    metric = "accuracy/response_time" if i <= 8 else "completeness"
                    print(f"✅ {node_type} v{version} ({metric}) 추가 성공")
                added_count += 1
            except Exception as e:
                print(f"❌ 데이터 {i} 추가 실패: {e}")
        
        print(f"\n🎉 총 {added_count}개의 평가 결과 데이터가 추가되었습니다!")
        
        # 추가된 데이터 검증 - 검색노드 accuracy 기준
        print(f"\n🔍 검색노드 accuracy 메트릭 결과 확인:")
        verify_sql = """
            SELECT 
                er.id, er.score, p.node_name, p.version, p.production,
                d.name as dataset_name, er.metric_name
            FROM evaluation_results er
            JOIN prompts p ON er.prompt_id = p.id
            JOIN datasets d ON er.dataset_id = d.id
            WHERE p.node_name = '검색노드' AND er.metric_name = 'accuracy'
            ORDER BY p.version
        """
        
        results = await database.fetch_all(text(verify_sql))
        
        print("📊 검색노드 버전별 accuracy 점수:")
        for result in results:
            production_mark = " 🔥(프로덕션)" if result['production'] else ""
            print(f"   📈 버전 {result['version']}: 점수 {result['score']}{production_mark}")
        
        # 요약노드 completeness 결과도 확인
        print(f"\n🔍 요약노드 completeness 메트릭 결과 확인:")
        verify_sql2 = """
            SELECT 
                er.id, er.score, p.node_name, p.version, p.production,
                d.name as dataset_name, er.metric_name
            FROM evaluation_results er
            JOIN prompts p ON er.prompt_id = p.id
            JOIN datasets d ON er.dataset_id = d.id
            WHERE p.node_name = '요약노드' AND er.metric_name = 'completeness'
            ORDER BY p.version
        """
        
        results2 = await database.fetch_all(text(verify_sql2))
        
        print("📊 요약노드 버전별 completeness 점수:")
        for result in results2:
            production_mark = " 🔥(프로덕션)" if result['production'] else ""
            print(f"   📈 버전 {result['version']}: 점수 {result['score']}{production_mark}")
        
        print(f"\n✅ 완료! 이제 UI에서 같은 노드의 여러 버전 중 프로덕션을 선택하는 테스트를 할 수 있습니다!")
        print("🎯 테스트 시나리오:")
        print("   1. 검색노드 - accuracy 메트릭으로 v1~v4 중 프로덕션 변경")
        print("   2. 요약노드 - completeness 메트릭으로 v1~v7 중 프로덕션 변경") 
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        
    finally:
        await database.disconnect()
        print("🔌 데이터베이스 연결 종료")


if __name__ == "__main__":
    asyncio.run(add_version_evaluation_data())