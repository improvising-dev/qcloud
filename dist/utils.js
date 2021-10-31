"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tencentSign = void 0;
const crypto_1 = require("crypto");
const getHost = ({ serviceType, serviceRegion, baseHost }) => `${serviceType}${serviceRegion ? `.${serviceRegion}` : ''}.${baseHost}`;
const getUrl = (opts) => {
    var _a;
    const host = getHost(opts);
    const path = (_a = opts.path) !== null && _a !== void 0 ? _a : '/';
    return `https://${host}${path}`;
};
const getUnixTime = (date) => {
    return Math.ceil(date.getTime() / 1000);
};
const getDate = (date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
};
const sign = (str, secretKey, algorithm = 'sha256') => {
    const hmac = (0, crypto_1.createHmac)(algorithm, secretKey);
    return hmac.update(Buffer.from(str, 'utf8')).digest();
};
const tencentSign = (payload, { path, baseHost, serviceType, serviceRegion, secretId, secretKey, }) => {
    const hostParams = {
        path,
        baseHost,
        serviceType,
        serviceRegion,
    };
    const url = getUrl(hostParams);
    const host = getHost(hostParams);
    const d = new Date();
    const timestamp = String(getUnixTime(d));
    const date = getDate(d);
    const algorithm = 'TC3-HMAC-SHA256';
    // Create Canonical request string
    const httpRequestMethod = 'POST';
    const canonicalURI = '/';
    const canonicalQueryString = '';
    const canonicalHeaders = `content-type:application/json\nhost:${host}\n`;
    const signedHeaders = 'content-type;host';
    const hashedRequestPayload = (0, crypto_1.createHash)('sha256')
        .update(JSON.stringify(payload))
        .digest('hex');
    const canonicalRequest = `${httpRequestMethod}\n${canonicalURI}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedRequestPayload}`;
    // Create string to sign
    const credentialScope = `${date}/${serviceType}/tc3_request`;
    const hashedCanonicalRequest = (0, crypto_1.createHash)('sha256')
        .update(canonicalRequest)
        .digest('hex');
    const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`;
    // Calculate signature
    const secretDate = sign(date, Buffer.from(`TC3${secretKey}`, 'utf8'));
    const secretService = sign(serviceType, secretDate);
    const secretSigning = sign('tc3_request', secretService);
    const signature = (0, crypto_1.createHmac)('sha256', secretSigning)
        .update(Buffer.from(stringToSign, 'utf8'))
        .digest('hex');
    // Create authorization
    const authorization = `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    return {
        url,
        host,
        authorization,
        timestamp,
    };
};
exports.tencentSign = tencentSign;
