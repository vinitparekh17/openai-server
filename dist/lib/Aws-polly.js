"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollyClient = void 0;
const client_polly_1 = require("@aws-sdk/client-polly");
const config_1 = require("../config");
exports.pollyClient = new client_polly_1.PollyClient({
  region: config_1.REGION,
});
//# sourceMappingURL=Aws-polly.js.map
