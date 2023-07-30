const router = require('express').Router();
import { RazorPay } from '../controllers/paymentController';

router.route('/ping').post((req, res) => {
  res.json({ message: 'Pong' });
});
router.route('/razorpay').post(RazorPay);

export default router;
