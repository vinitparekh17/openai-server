import { Router } from 'express';
import { signup, getUser, passwardReset, forgotPassword } from '../controllers/userController';

const router = Router();

router.post('/signup', signup);
router.get('/:id', getUser);
router.post('/forgotpassword', forgotPassword)
router.get('/resetpassword', passwardReset)

export default router;