import axios from 'axios'
import { getToken } from '@adapters/primary/nuxt/utils/keycloak'

export const axiosWithBearer = axios.create({
  timeout: 10000
})

axiosWithBearer.interceptors.request.use(
  async (config) => {
    const token = await getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
