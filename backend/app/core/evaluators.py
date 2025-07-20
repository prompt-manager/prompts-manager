from abc import ABC, abstractmethod

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

# 평가 지표 이름과 로직 연결
evaluator_mapping = {
    "accuracy": AccuracyEvaluator(),
    "response_time": ResponseTimeEvaluator(),
    "completeness": CompletenessEvaluator(),
}

# 평가 실행 함수
def run_evaluation(metric_name: str, prompt_content: str, dataset_content: str):
    evaluator = evaluator_mapping.get(metric_name)
    if evaluator is None:
        raise ValueError(f"Unsupported evaluation metric: {metric_name}")
    return evaluator.evaluate(prompt_content, dataset_content)