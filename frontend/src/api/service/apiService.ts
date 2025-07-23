import axiosCreate from '../../libs/axios'
import { DATASETS_ENDPOINT, PROMPT_ENDPOINT, PROMPT_NODE } from './apiEndpoint'
import { DatasetsList, PromptNodes, Prompts, PromptsResponse } from '../../types/api'
import { AxiosResponse } from 'axios'

// Prompt
export const getPromptsNodes = (): Promise<AxiosResponse<PromptNodes[]>> =>
  axiosCreate.get<PromptNodes[]>(PROMPT_NODE)
export const postPrompts = (params: Prompts): Promise<AxiosResponse<PromptsResponse>> =>
  axiosCreate.post<PromptsResponse>(PROMPT_ENDPOINT)

// Evaluation

// Datasets
export const getDatasets = (): Promise<AxiosResponse<DatasetsList>> =>
  axiosCreate.get<DatasetsList>(DATASETS_ENDPOINT)
