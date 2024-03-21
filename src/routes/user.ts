const router = require('express').Router();
import { AuthMiddleware } from '../middlewares/';
import {
  signUp,
  signIn,
  profile,
  passwardReset,
  updateAccount,
  forgotPassword,
  signOut,
} from '../controllers/userController';

const { requireAuth } = AuthMiddleware;
// unprotected
router.route('/signin').post(signIn);
router.route('/signup').post(signUp);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:token').post(passwardReset);
//protected
router.route('/profile').get(requireAuth, profile);
router.route('/signout').get(requireAuth, signOut);
router.route('/update/:id').post(requireAuth, updateAccount);

export default router;
