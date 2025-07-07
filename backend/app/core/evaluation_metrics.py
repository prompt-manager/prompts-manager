from enum import Enum

class EvaluationMetric(str, Enum):
    accuracy = "accuracy"
    response_time = "response_time"
    completeness = "completeness"
    