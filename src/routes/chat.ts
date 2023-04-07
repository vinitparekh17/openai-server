import { Router } from 'express';
import { generateResponse } from '../controllers/messageController'
const router = Router();

router.post('/chat/:id', generateResponse)

export default router;