import axiosCreate from '../../libs/axios'
import {
  DATASETS_ENDPOINT,
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

export const postPrompts = (params: Prompts): Promise<AxiosResponse<PromptsResponse>> =>
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

// Datasets
export const getDatasets = (): Promise<AxiosResponse<DatasetsList>> =>
  axiosCreate.get<DatasetsList>(DATASETS_ENDPOINT)
