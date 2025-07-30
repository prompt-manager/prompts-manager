const BASE_URL = process.env.REACT_APP_DEV_PROXY_SERVER
export const PROMPT_ENDPOINT = `${BASE_URL}/prompts`
export const PROMPT_NODE = `${PROMPT_ENDPOINT}/node`
export const PROMPT_NODES = `${PROMPT_ENDPOINT}/nodes`
export const PROMPT_NODES_SUMMARY = `${PROMPT_ENDPOINT}/nodes-summary`
export const PROMPTS_DELETE_ALL = `${PROMPT_ENDPOINT}/delete-all`

export const DATASETS_ENDPOINT = `${BASE_URL}/datasets/`
export const DATASETS_LIST = `${DATASETS_ENDPOINT}list`
export const DATASETS_SEARCH = `${DATASETS_ENDPOINT}search/`

export const CHAINS_ENDPOINT = `${BASE_URL}/chains`
export const INFO_ENDPOINT = `${BASE_URL}/info`

export const EVALUATIONS_ENDPOINT = `${BASE_URL}/evaluations`
export const EVALUATIONS_METRIC = `${EVALUATIONS_ENDPOINT}/metrics`
export const EVALUATIONS_RUN = `${EVALUATIONS_ENDPOINT}/run`
export const EVALUATIONS_RESULTS_TABLE = `${EVALUATIONS_ENDPOINT}/results/table`
export const EVALUATIONS_REQUEST = `${EVALUATIONS_ENDPOINT}/request`
