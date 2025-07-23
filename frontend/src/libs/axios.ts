import axios, { AxiosResponse } from 'axios'

const axiosCreate = axios.create({
  baseURL: process.env.REACT_APP_DEV_PROXY_SERVER,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 응답 에러
axiosCreate.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const original = response.data

    if (
      original &&
      typeof original === 'object' &&
      'data' in original &&
      Object.keys(original).length <= 3
    ) {
      return {
        ...response,
        data: original.data,
        status: original.status ?? response.status,
        message: original.message,
      }
    }

    return response
  },
  (error) => Promise.reject(error)
)

export default axiosCreate
