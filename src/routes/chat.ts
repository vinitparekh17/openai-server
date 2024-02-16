const router = require('express').Router();
import { getConversation } from '../controllers/messageController';
import { AuthMiddleware } from '../middlewares';

const { requireAuth } = AuthMiddleware;
router.route('/:uid').get(requireAuth, getConversation);

export default router;
