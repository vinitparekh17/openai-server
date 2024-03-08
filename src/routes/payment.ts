import { RazorPay, StripeWebhook, CreateStripePaymentIntent } from '../controllers/paymentController';
import { AuthMiddleware } from '../middlewares';

const router = require('express').Router();
const { requireAuth } = AuthMiddleware;

router.route('/razorpay').post(requireAuth, RazorPay);
router.route('/stripe/create').post(requireAuth, CreateStripePaymentIntent);
router.route('/stripe/webhook').post(StripeWebhook);

export default router;
