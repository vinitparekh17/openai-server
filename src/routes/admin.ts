import type { IRouter } from 'express';
const router: IRouter = require('express').Router();
import { AuthMiddleware } from '../middlewares/';
import { GetAllUsers, signIn, GetUserById, DeleteUserById } from '../controllers/adminController';

const { requireAuth } = AuthMiddleware;

router.route('/signin').post(signIn);

router.route('/getuser').get(requireAuth, GetAllUsers);
router.route('/getuser/:id').get(requireAuth, GetUserById);
router.route('/delete/user/:id').delete(requireAuth, DeleteUserById);

export default router;