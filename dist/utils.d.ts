/// <reference types="node" />
import { QCloudOptions } from './index';
export interface Payload {
    Region?: string;
    SecretId?: string;
    Timestamp?: number | string;
    Nonce?: number;
    [propName: string]: any;
}
export interface HostParams {
    ServiceType: string;
    Region: string;
    host: string | undefined;
    baseHost: string | undefined;
    path?: string;
}
export interface TencentSignResult {
    url: string;
    payload: Payload;
    Host: string;
    Authorization: string;
    Timestamp: string;
}
export declare const getHost: ({ host, ServiceType, Region, baseHost }: HostParams, isV1?: boolean) => string;
export declare const getUnixTime: (date: Date) => number;
export declare const getDate: (date: Date) => string;
export declare const getUrl: (opts: HostParams, isV1?: boolean) => string;
export declare const sign: (str: string, secretKey: Buffer, algorithm?: string) => Buffer;
export declare const tencentSign: (payload: Payload, options: QCloudOptions) => TencentSignResult;
