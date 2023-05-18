const router = require('express').Router();
import { generateResponse } from '../controllers/messageController';

router.route('/chat').post(generateResponse);

export default router;
