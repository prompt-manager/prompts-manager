export type PromptType = 'system' | 'user' | 'assistant'

export interface IPrompt {
  id?: number | string
  chain_name: string
  tool_name: string
  llm_name: string
  system_prompt: string
  user_prompt: string
  assistant_prompt?: string | null
  version?: number | string
  is_active?: boolean
}

export interface CreatePromptRes extends IPrompt {
  created_at: string
}

export interface PromptListReq {
  chain_name?: string
  tool_name?: string
  llm_name?: string
}

export interface PromptListRes {
  prompts: IPrompt[]
}

export interface EditPromptReq {
  system_prompt: string
  user_prompt: string
  assistant_prompt: string
}

export interface PromptActionRes {
  success?: boolean
  message?: string
  detail?: string
}

export interface TestData {
  id?: number | string
  question: string
  answer: string
  created_at?: string
}

export interface DatasetsList {
  id: number | string
  name: string
  test_data: TestData[]
  created_at: string
}

export interface ExecutePromptReq {
  prompt_id: number | string
  question: string
}

export interface DatasetsList {
  page: number
  size: number
  total: number
  total_pages: number
  items: DatasetsListItem[]
}

export interface DatasetsListItem {
  id: string | number
  content: string
  name: string
  description: string
  created_at: string
}

export interface DatasetsList {
  id: string | number
  name: string
}

export interface PromptNodes {
  node_name: string
  prompt_count: number
  production_prompt_id: string | null
  latest_version: number
}

export interface PromptsContentItem {
  order: number | null
  prompt: string | null
}

export interface PromptsContent {
  system: PromptsContentItem
  user?: PromptsContentItem
  assistant?: PromptsContentItem
}

export interface Prompts {
  node_name: string
  content: PromptsContent
  message?: string
}

export interface PromptsResponse extends Prompts {
  id: number | string
  production: boolean
  version: number
  created_at: string
  updated_at: string
}

export interface PromptNodeSummary {
  node_name: string
  prompt_count: number
  latest_created_at: number
}

export interface DeleteNodeVersion {
  node_name: string
  version: number
}

export interface DeleteResponse {
  detail: string
}

export interface EvaluationsMetrics {
  key: string
  name: string
  description: string
  unit: string
}

export interface EvaluationParams {
  node_name: string | number
  dataset_id: string | number
  metric_name: string
}

export interface EvaluationResults {
  name: string
  version: number | string
  dataset_name: string
  metric?: string
  score: number
  production?: boolean
  evaluation_id?: string | number
  prompt_id?: string | number
  dateset_id?: string | number
}
