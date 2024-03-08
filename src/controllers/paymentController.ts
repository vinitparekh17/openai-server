import type { Request, Response } from 'express';
import { stripeClient } from '../lib/payment/Stripe';
import { AsyncHandler } from '../handlers';
import { RazorpayClient } from '../lib/payment/Razorpay';
import { Err, Logger, Success } from '../utils';
import { STRIPE_ACCOUNT_ID, STRIPE_SECRET } from '../config';

export const CreateStripePaymentIntent = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { amount } = req.body;

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: parseInt(amount) * 100,
      currency: 'inr',
      payment_method_types: ["card"],
      setup_future_usage: 'off_session',
      receipt_email: req.user.email,
    }, {
      apiKey: STRIPE_SECRET,
      stripeAccount: STRIPE_ACCOUNT_ID
    })
    return Success.send(res, 200, paymentIntent.client_secret);
  },
);

export const StripeWebhook = AsyncHandler((req: Request, res: Response) => {
  const event = req.body
  if (event.type == 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log(paymentIntent);
  }
})

export const RazorPay = AsyncHandler((req: Request, res: Response) => {
  const { amount } = req.body;
console.log(req.body)
  RazorpayClient.orders.create({
    amount: parseInt(amount) * 100,
    currency: 'INR',
    method: 'upi',
    payment_capture: true,
    receipt: new Date().getMilliseconds().toString(),
  },
    (err, order) => {
      if (err) {
        Logger.error(err.error.reason)
        return Err.send(res, 500, err.error.reason);
      }
      return Success.send(res, 201, order);
    },
  );
});
