const router = require('express').Router();
import { getConversation } from '../controllers/messageController';

router.route('/:uid').get(getConversation);

export default router;
