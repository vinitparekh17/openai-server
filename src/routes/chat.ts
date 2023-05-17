const router = require('express').Router();
import { generateResponse } from '../controllers/messageController';

router.route('/chat/:id').post(generateResponse);

export default router;
