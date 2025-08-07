import axiosCreate from '../../libs/axios'
import {
  DATASETS_ENDPOINT,
  DATASETS_LIST,
  DATASETS_SEARCH,
  EVALUATIONS_METRIC,
  EVALUATIONS_RESULTS_TABLE,
  PROMPT_ENDPOINT,
  PROMPT_NODE,
  PROMPT_NODES,
  PROMPT_NODES_SUMMARY,
  PROMPTS_DELETE_ALL,
} from './apiEndpoint'
import {
  ApiResponse,
  CreateDatasets,
  DatasetsList,
  DatasetsListItem,
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
export const getPromptsNodes = (): Promise<ApiResponse<PromptNodes[]>> =>
  axiosCreate.get(PROMPT_NODES)
export const getPromptsNodesSummary = (): Promise<ApiResponse<PromptNodeSummary[]>> =>
  axiosCreate.get(PROMPT_NODES_SUMMARY)
export const getPromptsNode = (nodeName: string): Promise<ApiResponse<PromptsResponse[]>> =>
  axiosCreate.get(`${PROMPT_NODE}/${nodeName}`)

export const postPrompts = (params: {
  node_name: any
  message: string | null
  content: {
    system: { prompt: any; order: number }
    assistant: { prompt: string | null; order: number | null }
    user: { prompt: string | null; order: number | null }
  }
}): Promise<ApiResponse<PromptsResponse>> => axiosCreate.post(PROMPT_ENDPOINT, params)
export const postPromptsProduction = (
  promptIds: string | number
): Promise<ApiResponse<PromptsResponse>> =>
  axiosCreate.post(`${PROMPT_ENDPOINT}/${promptIds}/production`)

export const deletePromptsAllNodeName = (nodeName: string): Promise<ApiResponse<DeleteResponse>> =>
  axiosCreate.delete(`${PROMPTS_DELETE_ALL}/${nodeName}`)
export const deletePromptsNodeVersion = (
  params: DeleteNodeVersion
): Promise<ApiResponse<DeleteResponse>> =>
  axiosCreate.delete(`${PROMPT_NODE}/${params.node_name}/version/${params.version}`)

// Evaluation
export const getEvaluationsMetrics = (): Promise<ApiResponse<EvaluationsMetrics[]>> =>
  axiosCreate.get(EVALUATIONS_METRIC)
export const getEvaluationsResultsTable = (
  params: EvaluationParams
): Promise<ApiResponse<EvaluationResults[]>> =>
  axiosCreate.get(
    `${EVALUATIONS_RESULTS_TABLE}?node_name=${params.node_name}&dataset_id=${params.dataset_id}&metric_name=${params.metric_name}`
  )

// Datasets
export const getDatasets = (): Promise<ApiResponse<DatasetsList>> =>
  axiosCreate.get(DATASETS_ENDPOINT)
export const getDatasetsList = (): Promise<ApiResponse<DatasetsList[]>> =>
  axiosCreate.get(DATASETS_LIST)
export const getDatasetsSearch = (keyword: string): Promise<ApiResponse<DatasetsListItem[]>> =>
  axiosCreate.get(`${DATASETS_SEARCH}?query=${keyword}`)

export const postDatasets = (params: CreateDatasets): Promise<ApiResponse<string>> => {
  const formData = new FormData()
  formData.append('name', params.name)
  if (params.description) formData.append('description', params.description)
  formData.append('file', params.file)

  return axiosCreate.post(DATASETS_ENDPOINT, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const putDatasets = (params: DatasetsListItem): Promise<ApiResponse<string>> =>
  axiosCreate.put(`${DATASETS_ENDPOINT}${params.id}`, {
    name: params.name,
    description: params.description,
  })

export const deleteDatasets = (id: string | number): Promise<ApiResponse<DeleteResponse>> =>
  axiosCreate.delete(`${DATASETS_ENDPOINT}${id}`)
