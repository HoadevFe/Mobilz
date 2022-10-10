import axios, { AxiosError, AxiosResponse } from 'axios'
import { default as queryString } from 'query-string'
import { DispatchNotification } from '../store'
import { getCookie, removeCookie } from '../util'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

axios.defaults.headers.common['Authorization'] = `Bearer ${getCookie('access')}`

axios.interceptors.request.use(function (config) {
  config.baseURL = (process.env.BASE_URL || '') + '/api'
  return config
})

axios.interceptors.response.use(
  (resp) => resp,
  function (error: AxiosError) {
    if (error.response?.status === 401) {
      removeCookie('access')
      location.replace('/login?redirectUrl=' + location.pathname + location.search)
    }
    return error
  }
)

export const ApiCore = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete
}

export const handleError = (err: AxiosError, dispatchNotification?: DispatchNotification) => {
  const statusErr = err.response?.status
  if (statusErr === 401) {
    location.replace('/login')
  } else if (statusErr === 403) {
    location.replace('/not-found')
  } else if (statusErr === 400) {
    const { message } = err.response?.data as { message: string }
    dispatchNotification && dispatchNotification('error', 'API request failed', message)
  } else {
    dispatchNotification && dispatchNotification('error', 'API request failed')
  }
}

export type RequestProps = {
  baseURL: string
  onSuccess: (data: any) => void
  onError?: DispatchNotification
  method?: HttpMethod
  params?: unknown
}

export const onUpdateQuery = (url = '', query = {}) => {
  const currentQuery = queryString.parse(location.search, { parseNumbers: true })
  return (
    url +
    '?' +
    queryString.stringify(Object.assign(currentQuery, query), {
      skipEmptyString: true,
      skipNull: true
    })
  )
}

export const invokeRequest = async (options: RequestProps) => {
  const { baseURL, params, method = HttpMethod.GET, onSuccess, onError } = options
  const endpointRequest = baseURL

  try {
    let response: AxiosResponse
    if (method === HttpMethod.DELETE) response = await ApiCore.delete(endpointRequest)
    else if (method === HttpMethod.PATCH) response = await ApiCore.patch(endpointRequest, params)
    else if (method === HttpMethod.POST) response = await ApiCore.post(endpointRequest, params)
    else response = await ApiCore.get(endpointRequest)

    if (response instanceof AxiosError) {
      handleError(response, onError)
    } else onSuccess(response.data)
  } catch (error) {
    handleError(error as AxiosError, onError)
  }
}
