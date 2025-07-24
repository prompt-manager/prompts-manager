const BASE_URL = process.env.REACT_APP_DEV_PROXY_SERVER
export const PROMPT_ENDPOINT = `${BASE_URL}/prompts`
export const PROMPT_NODE = `${PROMPT_ENDPOINT}/node`
export const PROMPT_NODES = `${PROMPT_ENDPOINT}/nodes`
export const PROMPT_NODES_SUMMARY = `${PROMPT_ENDPOINT}/nodes-summary`
export const PROMPTS_DELETE_ALL = `${PROMPT_ENDPOINT}/delete-all`

export const DATASETS_ENDPOINT = `${BASE_URL}/datasets/`
export const CHAINS_ENDPOINT = `${BASE_URL}/chains`
export const INFO_ENDPOINT = `${BASE_URL}/info`
