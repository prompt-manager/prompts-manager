const BASE_URL = process.env.REACT_APP_DEV_PROXY_SERVER
export const PROMPT_ENDPOINT = `${BASE_URL}/prompts`
export const PROMPT_NODE = `${PROMPT_ENDPOINT}/nodes`

export const DATASETS_ENDPOINT = `${BASE_URL}/datasets/`
export const CHAINS_ENDPOINT = `${BASE_URL}/chains`
export const INFO_ENDPOINT = `${BASE_URL}/info`
