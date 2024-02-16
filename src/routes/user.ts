const router = require('express').Router();
import { AuthMiddleware } from '../middlewares/';
import {
  signUp,
  signIn,
  profile,
  passwardReset,
  forgotPassword,
  signOut,
} from '../controllers/userController';

const { requireAuth } = AuthMiddleware;
// unprotected
router.route('/signin').post(signIn);
router.route('/signup').post(signUp);
router.route('/forgotpassword').post(forgotPassword);
//protected
router.route('/:id').post(requireAuth, profile);
router.route('/signout').get(requireAuth, signOut);
router.route('/resetpassword').get(requireAuth, passwardReset);

export default router;
