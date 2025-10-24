import { getToken } from '@adapters/primary/nuxt/utils/keycloak'
import axios from 'axios'

export const axiosWithBearer = axios.create({
  timeout: 30000
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
