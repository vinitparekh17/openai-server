import { Router } from 'express';
import { signUp, signIn, getUser, passwardReset, forgotPassword } from '../controllers/userController';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/:id', getUser);
router.post('/forgotpassword', forgotPassword)
router.get('/resetpassword', passwardReset)

export default router;