import axiosCreate from '../../libs/axios'
import {
  DATASETS_ENDPOINT,
  DATASETS_LIST,
  EVALUATIONS_METRIC,
  EVALUATIONS_RESULTS_TABLE,
  EVALUATIONS_RUN,
  PROMPT_ENDPOINT,
  PROMPT_NODE,
  PROMPT_NODES,
  PROMPT_NODES_SUMMARY,
  PROMPTS_DELETE_ALL,
} from './apiEndpoint'
import {
  DatasetsList,
  DeleteNodeVersion,
  DeleteResponse,
  EvaluationParams,
  EvaluationResults,
  EvaluationsMetrics,
  PromptNodes,
  PromptNodeSummary,
  Prompts,
  PromptsResponse,
} from '../../types/api'
import { AxiosResponse } from 'axios'

// Prompt
export const getPromptsNodes = (): Promise<AxiosResponse<PromptNodes[]>> =>
  axiosCreate.get<PromptNodes[]>(PROMPT_NODES)
export const getPromptsNodesSummary = (): Promise<AxiosResponse<PromptNodeSummary[]>> =>
  axiosCreate.get<PromptNodeSummary[]>(PROMPT_NODES_SUMMARY)
export const getPromptsNode = (nodeName: string): Promise<AxiosResponse<PromptsResponse[]>> =>
  axiosCreate.get<PromptsResponse[]>(`${PROMPT_NODE}/${nodeName}`)

export const postPrompts = (params: {
  node_name: any
  message: string | null
  content: {
    system: { prompt: any; order: number }
    assistant: { prompt: string | null; order: number | null }
    user: { prompt: string | null; order: number | null }
  }
}): Promise<AxiosResponse<PromptsResponse>> =>
  axiosCreate.post<PromptsResponse>(PROMPT_ENDPOINT, params)
export const postPromptsProduction = (
  promptIds: string | number
): Promise<AxiosResponse<PromptsResponse>> =>
  axiosCreate.post<PromptsResponse>(`${PROMPT_ENDPOINT}/${promptIds}/production`)

export const deletePromptsAllNodeName = (nodeName: string) =>
  axiosCreate.delete(`${PROMPTS_DELETE_ALL}/${nodeName}`)
export const deletePromptsNodeVersion = (
  params: DeleteNodeVersion
): Promise<AxiosResponse<DeleteResponse>> =>
  axiosCreate.delete<DeleteResponse>(`${PROMPT_NODE}/${params.node_name}/version/${params.version}`)

// Evaluation
export const getEvaluationsMetrics = (): Promise<AxiosResponse<EvaluationsMetrics[]>> =>
  axiosCreate.get<EvaluationsMetrics[]>(EVALUATIONS_METRIC)
export const getEvaluationsResultsTable = (
  params: EvaluationParams
): Promise<AxiosResponse<EvaluationResults[]>> =>
  axiosCreate.get<EvaluationResults[]>(
    `${EVALUATIONS_RESULTS_TABLE}?node_name=${params.node_name}&dataset_id=${params.dataset_id}&metric_name=${params.metric_name}`
  )

// Datasets
export const getDatasets = (): Promise<AxiosResponse<DatasetsList>> =>
  axiosCreate.get<DatasetsList>(DATASETS_ENDPOINT)
export const getDatasetsList = (): Promise<AxiosResponse<DatasetsList[]>> =>
  axiosCreate.get<DatasetsList[]>(DATASETS_LIST)
