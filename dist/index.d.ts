export { tencentSign } from './utils';
export interface QCloudOptions {
    onRequest?: (info: RequestInfo) => void;
    host?: string;
    baseHost?: string;
    path?: string;
    ServiceType: string;
    Version?: string;
    Region: string;
    SecretId: string;
    SecretKey: string;
    Token?: string;
    RequestClient?: string;
}
export interface RequestParams {
    Action: string;
    Version?: string;
    [propName: string]: any;
}
export interface RequestOptions {
    onRequest?: (info: RequestInfo) => void;
    host?: string;
    baseHost?: string;
    path?: string;
    RequestClient?: string;
}
export interface QCloudInstance {
    request: (params: RequestParams, opts?: RequestOptions) => Promise<any>;
}
export interface RequestInfo {
    url: string;
    payload: any;
    headers: Record<string, any>;
}
export declare const DEFAULT_CLIENT = "TENCENT_SDK_QCloud";
export declare const DEFAULT_OPTIONS: Partial<QCloudOptions>;
export declare class QCloud implements QCloudInstance {
    private options;
    constructor(options: QCloudOptions);
    request(params: RequestParams, opts?: RequestOptions): Promise<any>;
}
