import type { Request, Response } from 'express';
import { stripeClient } from '../lib/payment/Stripe';
import { AsyncHandler } from '../handlers';
import { RazorpayClient } from '../lib/payment/Razorpay';
import { Err, Success } from '../utils';
import { STRIPE_ACCOUNT_ID, STRIPE_SECRET } from '../config';

export const CreateStripePaymentIntent = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { amount } = req.body;
    
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: parseInt(amount) * 100,
      currency: 'inr',
      payment_method_types: ["card"],
      setup_future_usage: 'off_session'
    }, {
      apiKey: STRIPE_SECRET,
      stripeAccount: STRIPE_ACCOUNT_ID
    })
    return Success.send(res, 200, paymentIntent.client_secret);
  },
);

export const StripePay = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    let { customerId, priceId } = req.body;
    let subscription = await stripeClient.subscriptions.create({
      customer: customerId,
      collection_method: 'send_invoice',
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice'],
    });

    if (subscription) {
      return Success.send(res, 200, {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice,
      });
    }
    return Err.send(res, 401, 'Stipe Error occured');
  },
);

export const RazorPay = AsyncHandler(async (req: Request, res: Response) => {
  const { amount } = req.body;

  RazorpayClient.orders.create({
    amount: parseInt(amount),
    currency: 'INR',
    method: 'upi',
    payment_capture: true,
    receipt: new Date().getMilliseconds().toString(),
  },
    (err, order) => {
      if (err) {
        return Err.send(res, 500, err.error.reason);
      }
      return Success.send(res, 201, order);
    },
  );
});
