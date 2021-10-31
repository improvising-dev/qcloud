import { createHash, createHmac } from 'crypto'
import { QCloudOptions } from './index'

export interface Payload {
  Region?: string
  SecretId?: string
  Timestamp?: number | string
  Nonce?: number
  [propName: string]: any
}

export interface HostParams {
  ServiceType: string
  Region?: string
  host: string | undefined
  baseHost: string | undefined
  path?: string
}

export interface TencentSignResult {
  url: string
  payload: Payload
  Host: string
  Authorization: string
  Timestamp: string
}

export const getHost = ({
  host,
  ServiceType,
  Region,
  baseHost,
}: HostParams) => {
  host ??= `${ServiceType}${Region ? `.${Region}` : ''}.${baseHost}`
  return host
}

export const getUnixTime = (date: Date) => {
  const val = date.getTime()
  return Math.ceil(val / 1000)
}

export const getDate = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()

  return `${year}-${month > 9 ? month : `0${month}`}-${
    day > 9 ? day : `0${day}`
  }`
}

export const getUrl = (opts: HostParams) => {
  const host = getHost(opts)
  const path = opts.path || '/'

  return `https://${host}${path}`
}

export const sign = (
  str: string,
  secretKey: Buffer,
  algorithm: string = 'sha256',
): Buffer => {
  const hmac = createHmac(algorithm, secretKey)
  return hmac.update(Buffer.from(str, 'utf8')).digest()
}

export const tencentSign = (
  payload: Payload,
  options: QCloudOptions,
): TencentSignResult => {
  const hostParams: HostParams = {
    host: options.host,
    path: options.path,
    baseHost: options.baseHost,
    ServiceType: options.ServiceType,
    Region: options.Region,
  }

  const url = getUrl(hostParams)
  const Host = getHost(hostParams)
  const d = new Date()
  const Timestamp = String(getUnixTime(d))
  const date = getDate(d)
  const Algorithm = 'TC3-HMAC-SHA256'

  // 1. create Canonical request string
  const HTTPRequestMethod = 'POST'
  const CanonicalURI = '/'
  const CanonicalQueryString = ''
  const CanonicalHeaders = `content-type:application/json\nhost:${Host}\n`
  const SignedHeaders = 'content-type;host'
  const HashedRequestPayload = createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex')

  const CanonicalRequest = `${HTTPRequestMethod}\n${CanonicalURI}\n${CanonicalQueryString}\n${CanonicalHeaders}\n${SignedHeaders}\n${HashedRequestPayload}`

  // 2. create string to sign
  const CredentialScope = `${date}/${options.ServiceType}/tc3_request`
  const HashedCanonicalRequest = createHash('sha256')
    .update(CanonicalRequest)
    .digest('hex')

  const StringToSign = `${Algorithm}\n${Timestamp}\n${CredentialScope}\n${HashedCanonicalRequest}`

  // 3. calculate signature
  const SecretDate = sign(date, Buffer.from(`TC3${options.SecretKey}`, 'utf8'))
  const SecretService = sign(options.ServiceType, SecretDate)
  const SecretSigning = sign('tc3_request', SecretService)
  const Signature = createHmac('sha256', SecretSigning)
    .update(Buffer.from(StringToSign, 'utf8'))
    .digest('hex')

  // 4. create authorization
  const Authorization = `${Algorithm} Credential=${options.SecretId}/${CredentialScope}, SignedHeaders=${SignedHeaders}, Signature=${Signature}`

  return {
    url,
    payload,
    Host,
    Authorization,
    Timestamp,
  }
}
