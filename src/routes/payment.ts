import { RazorPay, StripePay } from '../controllers/paymentController';
import { AuthMiddleware } from '../middlewares';

const router = require('express').Router();
const { requireAuth } = AuthMiddleware;

router.route('/razorpay').post(requireAuth, RazorPay);
router.route('/stripe').post(requireAuth, StripePay);

export default router;
