'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.openai = void 0;
const openai_1 = require('openai');
const config_1 = require('../config');
// openai initialization
const configOpenai = new openai_1.Configuration({
  apiKey: config_1.OPENAI_API_KEY,
  basePath: 'https://api.openai.com/v1',
});
exports.openai = new openai_1.OpenAIApi(configOpenai);
//# sourceMappingURL=Openai.js.map
