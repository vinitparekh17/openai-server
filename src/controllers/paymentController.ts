import type { Request, Response } from 'express';
import { stripeClient } from '../lib/payment/Stripe';
import { AsyncHandler } from '../handlers';
import { RazorpayClient } from '../lib/payment/Razorpay';
import { Err, Success } from '../utils';

export const RetriveSecret = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    return Success.send(res, 200, 'Hello World');
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
  const { plan } = req.body;
  let options = {
    amount: 0,
    currency: 'INR',
    payment_capture: true,
    receipt: new Date().getMilliseconds().toString(),
  };

  switch (parseInt(plan)) {
    case 1:
      options['amount'] = 99 * 100;
      break;
    case 2:
      options['amount'] = 249 * 100;
      break;
    case 3:
      options['amount'] = 299 * 100;
      break;
    default:
      options['amount'] = 99 * 100;
  }
  RazorpayClient.orders.create(
    {
      method: 'upi',
      ...options,
    },
    (err, order) => {
      if (err) {
        return Err.send(res, 500, err.error.reason);
      }
      return Success.send(res, 201, order);
    },
  );
});
