import { Stripe } from 'stripe';
import { STRIPE_API } from '../config';

exports.stripeClient = new Stripe(STRIPE_API, {
  apiVersion: '2022-11-15',
});
