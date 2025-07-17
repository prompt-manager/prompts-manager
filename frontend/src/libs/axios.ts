import axios from 'axios'

const axiosCreate = axios.create({
    baseURL: process.env.REACT_APP_DEV_PROXY_SERVER,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 응답 에러
axiosCreate.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error)
        return Promise.reject(error)
    },
)

export default axiosCreate
