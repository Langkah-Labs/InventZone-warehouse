import axios, { AxiosInstance } from 'axios'

export class Monolith {
  host: string | undefined
  paths: Record<string, string>
  api: AxiosInstance
  
  constructor(host = process.env.NEXT_PUBLIC_BACKEND_HOST) {
    this.host = host
    
    // please add more path here
    this.paths = {
      createUser: '/api/users/create'
    }

    this.api = axios.create({
      baseURL: this.host,
    })
  }

  async createUser(data = {}) {
    const url = this.paths.createUser

    try {
      const response = await this.api.post(url, data)
      
      return response
    } catch (err) {
      return {}
    }
  }
}

export default Monolith