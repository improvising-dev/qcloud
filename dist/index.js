"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QCloud = exports.DEFAULT_OPTIONS = exports.tencentSign = void 0;
const utils_1 = require("./utils");
const axios_1 = __importDefault(require("axios"));
var utils_2 = require("./utils");
Object.defineProperty(exports, "tencentSign", { enumerable: true, get: function () { return utils_2.tencentSign; } });
exports.DEFAULT_OPTIONS = {
    path: '/',
    baseHost: 'tencentcloudapi.com',
};
class QCloud {
    constructor(options) {
        this.options = Object.assign(Object.assign({}, exports.DEFAULT_OPTIONS), options);
    }
    async request(payload, params = {}) {
        var _a, _b;
        const { url, host, authorization, timestamp } = (0, utils_1.tencentSign)(payload, this.options);
        const { action, version, region, token, language } = Object.assign(Object.assign({}, this.options.params), params);
        if (!action) {
            throw new Error('[action] is required');
        }
        if (!version) {
            throw new Error('[version] is required');
        }
        const headers = Object.assign(Object.assign(Object.assign({ authorization,
            host, 'X-TC-Timestamp': timestamp, 'X-TC-Action': action, 'X-TC-Version': version }, (region && { 'X-TC-Region': region })), (token && { 'X-TC-Token': token })), (language && { 'X-TC-Language': language }));
        (_b = (_a = this.options).onRequest) === null || _b === void 0 ? void 0 : _b.call(_a, { url, payload, headers });
        const { data } = await axios_1.default.post(url, payload, { headers });
        return data;
    }
}
exports.QCloud = QCloud;
