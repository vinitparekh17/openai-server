import { Stripe } from 'stripe';
import { STRIPE_API } from '../config';

export const stripeClient = new Stripe(STRIPE_API, {
  apiVersion: '2022-11-15',
  typescript: true,
});
