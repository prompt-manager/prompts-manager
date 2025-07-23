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
    id: string | number
    content: string
    name: string
    description: string
    created_at: string
}