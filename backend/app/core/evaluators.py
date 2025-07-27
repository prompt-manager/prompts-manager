from abc import ABC, abstractmethod
from typing import Dict, List

# 평가 로직 추상 클래스
class Evaluator(ABC):
    @abstractmethod
    def evaluate(self, prompt_content: str, dataset_content: str):
        pass

# 정확성 평가 클래스
class AccuracyEvaluator(Evaluator):
    def evaluate(self, prompt_content: str, dataset_content: str):
        # 실제 정확성 평가 로직 구현 (예시 로직)
        accuracy_score = 0.95  # 평가 점수 (임시 예시)
        return accuracy_score

# 응답 속도 평가 클래스
class ResponseTimeEvaluator(Evaluator):
    def evaluate(self, prompt_content: str, dataset_content: str):
        # 실제 응답 속도 평가 로직 구현 (예시 로직)
        response_time_score = 0.85  # 평가 점수 (임시 예시)
        return response_time_score

# 완성도 평가 클래스
class CompletenessEvaluator(Evaluator):
    def evaluate(self, prompt_content: str, dataset_content: str):
        # 실제 완성도 평가 로직 구현 (예시 로직)
        completeness_score = 0.90  # 평가 점수 (임시 예시)
        return completeness_score

# 메트릭 메타데이터 정의 (딕셔너리로 직접 정의)
METRIC_METADATA = {
    "accuracy": {
        "key": "accuracy",
        "name": "정확성",
        "description": "예상 결과와 실제 결과의 일치율을 측정합니다",
        "unit": "score"
    },
    "response_time": {
        "key": "response_time", 
        "name": "응답속도",
        "description": "프롬프트 처리 및 응답 생성 시간을 측정합니다",
        "unit": "score"
    },
    "completeness": {
        "key": "completeness",
        "name": "완성도",
        "description": "응답의 완전성과 포괄성을 평가합니다", 
        "unit": "score"
    }
}

# 평가 지표 이름과 로직 연결
evaluator_mapping = {
    "accuracy": AccuracyEvaluator(),
    "response_time": ResponseTimeEvaluator(),
    "completeness": CompletenessEvaluator(),
}

# 사용 가능한 메트릭 목록 반환
def get_available_metrics() -> List[Dict]:
    """시스템에서 지원하는 모든 평가 메트릭의 메타데이터를 반환합니다."""
    return list(METRIC_METADATA.values())

# 특정 메트릭 정보 조회  
def get_metric_info(metric_key: str) -> Dict:
    """특정 메트릭의 메타데이터를 반환합니다."""
    if metric_key not in METRIC_METADATA:
        raise ValueError(f"Unknown metric: {metric_key}")
    return METRIC_METADATA[metric_key]

# 평가 실행 함수
def run_evaluation(metric_name: str, prompt_content: str, dataset_content: str):
    evaluator = evaluator_mapping.get(metric_name)
    if evaluator is None:
        raise ValueError(f"Unsupported evaluation metric: {metric_name}")
    return evaluator.evaluate(prompt_content, dataset_content)