import { QCloudOptions } from './index';
export interface HostParams {
    serviceType: string;
    serviceRegion?: string;
    baseHost: string | undefined;
    path?: string;
}
export interface TencentSignResult {
    url: string;
    host: string;
    authorization: string;
    timestamp: string;
}
export declare const tencentSign: (payload: Record<string, any>, { path, baseHost, serviceType, serviceRegion, secretId, secretKey, }: QCloudOptions) => TencentSignResult;
