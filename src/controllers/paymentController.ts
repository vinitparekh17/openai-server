import type { Request, Response } from 'express';
import { stripeClient } from '../lib/Stripe';
import { AsyncHandler } from '../handlers';
import { RazorpayClient } from '../lib/Razorpay';
import { Err, Success } from '../utils';

export const StripePay = AsyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    let { plan, price } = req.body
    let subscriptionObj = stripeClient.subscriptions.create({
      currency: "INR",
      customer: "",
      collection_method: "charge_automatically",
      payment_behavior: "default_incomplete",
      items: [
        {
          plan: plan,
          price: price,
        }
      ],
    })
    if(subscriptionObj) {
      return Success.send(res, 200, subscriptionObj)
    }
    return Err.send(res, 401, "Stipe Error occured")
  }
);

export const RazorPay = AsyncHandler(
  async (req: Request, res: Response) => {
    const { plan } = req.body;
    let options = {
      amount: 0,
      currency: 'INR',
      receipt: new Date().getMilliseconds().toString()
    }

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
    RazorpayClient.orders.create({
      method: 'upi',
      ...options
    }, (err, order) => {
      if (err) {
        return Err.send(res, 500, err.error.reason);
      }
      return Success.send(res, 201, order);
    });
  }
);
