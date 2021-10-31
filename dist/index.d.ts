export { tencentSign } from './utils';
export interface QCloudOptions {
    onRequest?: (info: QCloudRequestInfo) => void;
    baseHost?: string;
    path?: string;
    serviceType: string;
    serviceRegion?: string;
    secretId: string;
    secretKey: string;
    params?: Partial<QCloudRequestParams>;
}
export declare type QCloudRequestPayload = Record<string, any>;
export interface QCloudRequestParams {
    action?: string;
    region?: string;
    version?: string;
    token?: string;
    language?: 'zh-CN' | 'en-US';
}
export interface QCloudInstance {
    request: (payload: QCloudRequestPayload, params?: QCloudRequestParams) => Promise<any>;
}
export interface QCloudRequestInfo {
    url: string;
    payload: QCloudRequestPayload;
    headers: Record<string, any>;
}
export interface QCloudResponse {
    Response: {
        RequestId: string;
        Error?: {
            Code: string;
            Message: string;
        };
        [key: string]: any;
    };
}
export declare const DEFAULT_OPTIONS: Partial<QCloudOptions>;
export declare class QCloud implements QCloudInstance {
    private options;
    constructor(options: QCloudOptions);
    request(payload: QCloudRequestPayload, params?: QCloudRequestParams): Promise<QCloudResponse>;
}
