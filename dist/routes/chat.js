"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const messageController_1 = require("../controllers/messageController");
router.route('/chat/:id').post(messageController_1.generateResponse);
exports.default = router;
//# sourceMappingURL=chat.js.map