import { tencentSign } from './utils'
import axios from 'axios'

export { tencentSign } from './utils'

export interface QCloudOptions {
  onRequest?: (info: RequestInfo) => void
  host?: string
  baseHost?: string
  path?: string
  ServiceType: string
  Version?: string
  Region: string
  SecretId: string
  SecretKey: string
  Token?: string
  RequestClient?: string
}

export interface RequestParams {
  Action: string
  Version?: string
  [propName: string]: any
}

export interface RequestOptions {
  onRequest?: (info: RequestInfo) => void
  host?: string
  baseHost?: string
  path?: string
  RequestClient?: string
}

export interface QCloudInstance {
  request: (params: RequestParams, opts?: RequestOptions) => Promise<any>
}

export interface RequestInfo {
  url: string
  payload: any
  headers: Record<string, any>
}

export interface QCloudResponse {
  Response: {
    RequestId: string
    Error?: {
      Code: string
      Message: string
    }
    [key: string]: any
  }
}

export const DEFAULT_CLIENT = 'TENCENT_SDK_QCloud'
export const DEFAULT_OPTIONS: Partial<QCloudOptions> = {
  path: '/',
  baseHost: 'tencentcloudapi.com',
}

export class QCloud implements QCloudInstance {
  private options: QCloudOptions

  constructor(options: QCloudOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  async request(params: RequestParams, opts?: RequestOptions) {
    const options = { ...this.options, ...opts }
    const { Action, Version = options.Version, ...restParams } = params
    const { onRequest, Region, RequestClient, Token } = options
    const { url, payload, Authorization, Timestamp, Host } = tencentSign(
      restParams,
      options,
    )

    const headers = {
      Authorization,
      Host,
      'X-TC-Action': Action,
      'X-TC-Timestamp': Timestamp,
      'X-TC-Region': Region,
      ...(Version && { 'X-TC-Version': Version }),
      ...(Token && { 'X-TC-Token': Token }),
      ...(RequestClient && { 'X-TC-RequestClient': RequestClient }),
    }

    if (onRequest) {
      onRequest({ url, payload, headers })
    }

    const { data } = await axios.post<QCloudResponse>(url, payload, { headers })
    return data
  }
}
