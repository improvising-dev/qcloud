"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tencentSign = exports.sign = exports.getUrl = exports.getDate = exports.getUnixTime = exports.getHost = void 0;
const crypto_1 = require("crypto");
const getHost = ({ host, ServiceType, Region, baseHost }, isV1 = false) => {
    host !== null && host !== void 0 ? host : (host = `${ServiceType}${isV1 ? '' : `.${Region}`}.${baseHost}`);
    return host;
};
exports.getHost = getHost;
const getUnixTime = (date) => {
    const val = date.getTime();
    return Math.ceil(val / 1000);
};
exports.getUnixTime = getUnixTime;
const getDate = (date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
};
exports.getDate = getDate;
const getUrl = (opts, isV1 = false) => {
    const host = (0, exports.getHost)(opts, isV1);
    const path = opts.path || '/';
    return `https://${host}${path}`;
};
exports.getUrl = getUrl;
const sign = (str, secretKey, algorithm = 'sha256') => {
    const hmac = (0, crypto_1.createHmac)(algorithm, secretKey);
    return hmac.update(Buffer.from(str, 'utf8')).digest();
};
exports.sign = sign;
const tencentSign = (payload, options) => {
    const hostParams = {
        host: options.host,
        path: options.path,
        baseHost: options.baseHost,
        ServiceType: options.ServiceType,
        Region: options.Region,
    };
    const url = (0, exports.getUrl)(hostParams);
    const Host = (0, exports.getHost)(hostParams);
    const d = new Date();
    const Timestamp = String((0, exports.getUnixTime)(d));
    const date = (0, exports.getDate)(d);
    const Algorithm = 'TC3-HMAC-SHA256';
    // 1. create Canonical request string
    const HTTPRequestMethod = 'POST';
    const CanonicalURI = '/';
    const CanonicalQueryString = '';
    const CanonicalHeaders = `content-type:application/json\nhost:${Host}\n`;
    const SignedHeaders = 'content-type;host';
    const HashedRequestPayload = (0, crypto_1.createHash)('sha256')
        .update(JSON.stringify(payload))
        .digest('hex');
    const CanonicalRequest = `${HTTPRequestMethod}\n${CanonicalURI}\n${CanonicalQueryString}\n${CanonicalHeaders}\n${SignedHeaders}\n${HashedRequestPayload}`;
    // 2. create string to sign
    const CredentialScope = `${date}/${options.ServiceType}/tc3_request`;
    const HashedCanonicalRequest = (0, crypto_1.createHash)('sha256')
        .update(CanonicalRequest)
        .digest('hex');
    const StringToSign = `${Algorithm}\n${Timestamp}\n${CredentialScope}\n${HashedCanonicalRequest}`;
    // 3. calculate signature
    const SecretDate = (0, exports.sign)(date, Buffer.from(`TC3${options.SecretKey}`, 'utf8'));
    const SecretService = (0, exports.sign)(options.ServiceType, SecretDate);
    const SecretSigning = (0, exports.sign)('tc3_request', SecretService);
    const Signature = (0, crypto_1.createHmac)('sha256', SecretSigning)
        .update(Buffer.from(StringToSign, 'utf8'))
        .digest('hex');
    // 4. create authorization
    const Authorization = `${Algorithm} Credential=${options.SecretId}/${CredentialScope}, SignedHeaders=${SignedHeaders}, Signature=${Signature}`;
    return {
        url,
        payload,
        Host,
        Authorization,
        Timestamp,
    };
};
exports.tencentSign = tencentSign;
