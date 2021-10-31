"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QCloud = exports.DEFAULT_OPTIONS = exports.DEFAULT_CLIENT = exports.tencentSign = void 0;
const utils_1 = require("./utils");
const axios_1 = __importDefault(require("axios"));
var utils_2 = require("./utils");
Object.defineProperty(exports, "tencentSign", { enumerable: true, get: function () { return utils_2.tencentSign; } });
exports.DEFAULT_CLIENT = 'TENCENT_SDK_QCloud';
exports.DEFAULT_OPTIONS = {
    path: '/',
    baseHost: 'tencentcloudapi.com',
};
class QCloud {
    constructor(options) {
        this.options = Object.assign(Object.assign({}, exports.DEFAULT_OPTIONS), options);
    }
    async request(params, opts) {
        const options = Object.assign(Object.assign({}, this.options), opts);
        const { Action, Version = options.Version } = params, restParams = __rest(params, ["Action", "Version"]);
        const { onRequest, Region, RequestClient, Token } = options;
        const { url, payload, Authorization, Timestamp, Host } = (0, utils_1.tencentSign)(restParams, options);
        const headers = Object.assign(Object.assign(Object.assign(Object.assign({ Authorization,
            Host, 'X-TC-Action': Action, 'X-TC-Timestamp': Timestamp }, (Region && { 'X-TC-Region': Region })), (Version && { 'X-TC-Version': Version })), (Token && { 'X-TC-Token': Token })), (RequestClient && { 'X-TC-RequestClient': RequestClient }));
        if (onRequest) {
            onRequest({ url, payload, headers });
        }
        const { data } = await axios_1.default.post(url, payload, { headers });
        return data;
    }
}
exports.QCloud = QCloud;
