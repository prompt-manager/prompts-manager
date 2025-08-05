#!/usr/bin/env python3
"""
데이터셋을 CSV 파일로 추출하는 스크립트

UI 개발자가 데이터셋 예시를 확인할 수 있도록 각 데이터셋을 개별 CSV 파일로 저장합니다.
"""

import asyncio
import sys
import os
from datetime import datetime

# 백엔드 프로젝트 경로 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import database
from sqlalchemy import text


async def export_datasets_to_csv():
    """데이터베이스의 모든 데이터셋을 CSV 파일로 추출"""
    print("🚀 데이터셋 CSV 파일 추출 시작")
    
    try:
        await database.connect()
        print("✅ 데이터베이스 연결 성공")
        
        # CSV 파일 저장할 디렉토리 생성
        csv_dir = "exported_datasets"
        if not os.path.exists(csv_dir):
            os.makedirs(csv_dir)
            print(f"📁 '{csv_dir}' 디렉토리 생성됨")
        
        # 모든 데이터셋 조회
        query = text("SELECT id, name, description, content FROM datasets ORDER BY id")
        datasets = await database.fetch_all(query)
        
        print(f"📊 총 {len(datasets)}개 데이터셋 발견")
        
        exported_count = 0
        file_list = []
        
        for dataset in datasets:
            try:
                # 파일명 생성 (특수문자 제거)
                safe_name = dataset['name'].replace('_', '-').replace(' ', '-')
                filename = f"{dataset['id']:02d}_{safe_name}.csv"
                filepath = os.path.join(csv_dir, filename)
                
                # CSV 내용 저장
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(dataset['content'])
                
                print(f"✅ CSV 파일 생성: {filename}")
                print(f"   ID: {dataset['id']}, 이름: {dataset['name']}")
                print(f"   설명: {dataset['description']}")
                
                file_list.append({
                    'id': dataset['id'],
                    'name': dataset['name'],
                    'filename': filename,
                    'description': dataset['description']
                })
                
                exported_count += 1
                
            except Exception as e:
                print(f"❌ 데이터셋 '{dataset['name']}' 추출 실패: {e}")
        
        print(f"\n🎉 총 {exported_count}개의 CSV 파일이 생성되었습니다!")
        
        # 요약 정보 생성
        print(f"\n📋 생성된 CSV 파일 목록:")
        print("=" * 80)
        for file_info in file_list:
            print(f"📁 {file_info['filename']}")
            print(f"   📊 데이터셋: {file_info['name']} (ID: {file_info['id']})")
            print(f"   📝 설명: {file_info['description']}")
            print()
        
        # README 파일도 생성
        readme_path = os.path.join(csv_dir, "README.md")
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write("# 데이터셋 CSV 파일 모음\n\n")
            f.write(f"생성일시: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write("## 📊 데이터셋 목록\n\n")
            
            for file_info in file_list:
                f.write(f"### {file_info['id']}. {file_info['name']}\n")
                f.write(f"- **파일명**: `{file_info['filename']}`\n")
                f.write(f"- **설명**: {file_info['description']}\n")
                f.write(f"- **용도**: UI 개발 및 테스트용 샘플 데이터\n\n")
            
            f.write("## 🎯 사용 방법\n\n")
            f.write("각 CSV 파일은 다음과 같은 용도로 사용할 수 있습니다:\n\n")
            f.write("1. **UI 개발**: 데이터 구조 확인 및 화면 레이아웃 테스트\n")
            f.write("2. **평가 테스트**: 프롬프트 성능 평가 시 샘플 데이터로 활용\n")
            f.write("3. **데이터 검증**: 실제 데이터 형식과 내용 확인\n\n")
            f.write("## 📁 파일 구조\n\n")
            f.write("모든 CSV 파일은 UTF-8 인코딩으로 저장되어 있으며,\n")
            f.write("첫 번째 행은 헤더(컬럼명)입니다.\n")
        
        print(f"📄 README.md 파일도 생성되었습니다!")
        print(f"\n✅ 모든 파일이 '{csv_dir}' 폴더에 저장되었습니다.")
        print("🎯 UI 개발자가 이제 각 데이터셋의 구조와 내용을 확인할 수 있습니다!")
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        
    finally:
        await database.disconnect()
        print("🔌 데이터베이스 연결 종료")


if __name__ == "__main__":
    asyncio.run(export_datasets_to_csv())