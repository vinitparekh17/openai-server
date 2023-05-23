const router = require('express').Router();
import { AuthMiddleware } from '../middlewares/';
import {
  signUp,
  signIn,
  getUser,
  passwardReset,
  forgotPassword,
  Protected,
  signOut,
} from '../controllers/userController';

const { requireAuth } = AuthMiddleware;
router.route('/signin').post(signIn);
router.route('/signup').post(signUp);
router.route('/:id').post(requireAuth, getUser);
router.route('/user/').get(requireAuth, Protected);
router.route('/signout').get(requireAuth, signOut);
router.route('/resetpassword').get(requireAuth, passwardReset);
router.route('/forgotpassword').post(requireAuth, forgotPassword);

export default router;
