const router = require('express').Router();
import { generateResponse } from '../controllers/messageController';

router.route('/stream').post(generateResponse);

export default router;
