import { Router } from 'express';
import { signup, getUser } from '../controllers/userController';

const router = Router();

router.post('/signpu', signup);
router.get('/user/:id', getUser);

export default router;