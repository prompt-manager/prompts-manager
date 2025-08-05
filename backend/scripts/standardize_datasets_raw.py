#!/usr/bin/env python3
"""
데이터셋 컬럼명 표준화 (Raw SQL 사용)
"""

import asyncio
import sys
import os
from datetime import datetime, timezone

# 백엔드 프로젝트 경로 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import database


async def standardize_datasets_raw():
    """Raw SQL로 데이터셋 컬럼명 표준화"""
    print("🚀 Raw SQL로 데이터셋 컬럼명 표준화")
    
    try:
        await database.connect()
        print("✅ 데이터베이스 연결 성공")
        
        # 현재 시간
        now = datetime.now(timezone.utc).isoformat()
        
        # 각 데이터셋별 업데이트 SQL
        update_queries = [
            # ID 2: 질문답변_기본셋
            f"""UPDATE datasets 
               SET content = 'Question,Answer
한국의 수도는?,서울
파이썬은 어떤 언어인가?,프로그래밍 언어
1+1은?,2
지구에서 가장 높은 산은?,에베레스트
바다에서 가장 큰 동물은?,고래
태양계에서 가장 큰 행성은?,목성
한글을 만든 사람은?,세종대왕
컴퓨터의 뇌 역할을 하는 부품은?,CPU',
                   updated_at = '{now}'
               WHERE id = 2;""",
            
            # ID 3: 요약_뉴스셋
            f"""UPDATE datasets 
               SET content = 'Question,Answer
AI 발전으로 산업 자동화 가속화,인공지능 기술로 자동화 확산
규칙적 운동이 뇌 건강에 긍정적 영향,운동이 기억력과 집중력 향상
친환경 에너지 투자 급증,재생에너지 투자 40% 증가 전망',
                   updated_at = '{now}'
               WHERE id = 3;""",
            
            # ID 4: 번역_한영셋
            f"""UPDATE datasets 
               SET content = 'Question,Answer
안녕하세요,Hello
감사합니다,Thank you
죄송합니다,I am sorry
도움이 필요해요,I need help
오늘 날씨가 좋네요,The weather is nice today
한국 음식을 좋아해요,I like Korean food',
                   updated_at = '{now}'
               WHERE id = 4;""",
            
            # ID 5: 감정분석_리뷰셋
            f"""UPDATE datasets 
               SET content = 'Question,Answer
이 제품 정말 좋아요! 추천합니다.,긍정
배송이 너무 늦었어요. 실망스럽네요.,부정
가격 대비 품질이 훌륭합니다.,긍정
설명과 다른 제품이 왔어요.,부정
포장도 깔끔하고 만족스러워요.,긍정
다시는 주문하지 않을 것 같아요.,부정',
                   updated_at = '{now}'
               WHERE id = 5;""",
            
            # ID 6: 추천_영화셋
            f"""UPDATE datasets 
               SET content = 'Question,Answer
액션 영화를 좋아해요,어벤져스: 엔드게임
로맨틱 코미디 장르 선호,러브 액츄얼리
공포 영화 팬입니다,컨저링
SF 영화에 관심이 많아요,인터스텔라
애니메이션을 즐겨봐요,토이 스토리',
                   updated_at = '{now}'
               WHERE id = 6;""",
            
            # ID 7: 코딩_문제셋
            f"""UPDATE datasets 
               SET content = 'Question,Answer
두 수를 더하는 함수를 작성하세요,def add(a b): return a + b
리스트에서 최댓값을 찾는 함수,def find_max(lst): return max(lst)
문자열을 뒤집는 함수,def reverse_string(s): return s[::-1]
팩토리얼을 계산하는 함수,def factorial(n): return 1 if n <= 1 else n * factorial(n-1)',
                   updated_at = '{now}'
               WHERE id = 7;"""
        ]
        
        dataset_names = [
            "질문답변_기본셋", "요약_뉴스셋", "번역_한영셋", 
            "감정분석_리뷰셋", "추천_영화셋", "코딩_문제셋"
        ]
        
        print(f"📈 {len(update_queries)}개 데이터셋 업데이트 중...")
        
        updated_count = 0
        for i, (sql, name) in enumerate(zip(update_queries, dataset_names), 2):
            try:
                await database.execute(sql)
                print(f"✅ 데이터셋 {i} 업데이트 성공: {name}")
                updated_count += 1
            except Exception as e:
                print(f"❌ 데이터셋 {i} 업데이트 실패: {e}")
        
        print(f"\n🎉 {updated_count}개 데이터셋이 표준화되었습니다!")
        
        # 결과 확인
        check_sql = """
            SELECT id, name, 
                   SUBSTRING(content, 1, 30) as content_preview
            FROM datasets 
            ORDER BY id
        """
        results = await database.fetch_all(check_sql)
        
        print(f"\n📊 표준화 결과 확인:")
        for result in results:
            preview = result['content_preview']
            status = "✅ 표준화됨" if preview.startswith("Question,Answer") else "⚠️  미완료"
            print(f"   ID {result['id']}: {result['name']} - {status}")
            print(f"      컬럼: {preview}...")
            print()
        
        print("🎯 모든 데이터셋이 Question,Answer 형태로 표준화되었습니다!")
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        
    finally:
        await database.disconnect()
        print("🔌 데이터베이스 연결 종료")


if __name__ == "__main__":
    asyncio.run(standardize_datasets_raw())