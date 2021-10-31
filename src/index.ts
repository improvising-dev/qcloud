import { tencentSign } from './utils'
import axios from 'axios'

export { tencentSign } from './utils'

export interface QCloudOptions {
  onRequest?: (info: QCloudRequestInfo) => void
  baseHost?: string
  path?: string
  serviceType: string
  serviceRegion?: string
  secretId: string
  secretKey: string
  params?: Partial<QCloudRequestParams>
}

export type QCloudRequestPayload = Record<string, any>

export interface QCloudRequestParams {
  action?: string
  region?: string
  version?: string
  token?: string
  language?: 'zh-CN' | 'en-US'
}

export interface QCloudInstance {
  request: (
    payload: QCloudRequestPayload,
    params?: QCloudRequestParams,
  ) => Promise<any>
}

export interface QCloudRequestInfo {
  url: string
  payload: QCloudRequestPayload
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

export const DEFAULT_OPTIONS: Partial<QCloudOptions> = {
  path: '/',
  baseHost: 'tencentcloudapi.com',
}

export class QCloud implements QCloudInstance {
  private options: QCloudOptions

  constructor(options: QCloudOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  async request(
    payload: QCloudRequestPayload,
    params: QCloudRequestParams = {},
  ) {
    const { url, host, authorization, timestamp } = tencentSign(
      payload,
      this.options,
    )

    const { action, version, region, token, language } = {
      ...this.options.params,
      ...params,
    }

    if (!action) {
      throw new Error('[action] is required')
    }

    if (!version) {
      throw new Error('[version] is required')
    }

    const headers = {
      authorization,
      host,
      'X-TC-Timestamp': timestamp,
      'X-TC-Action': action,
      'X-TC-Version': version,
      ...(region && { 'X-TC-Region': region }),
      ...(token && { 'X-TC-Token': token }),
      ...(language && { 'X-TC-Language': language }),
    }

    this.options.onRequest?.({ url, payload, headers })

    const { data } = await axios.post<QCloudResponse>(url, payload, { headers })
    return data
  }
}
