import { Stripe } from 'stripe';
import { STRIPE_SECRET } from '../../config';

export const stripeClient = new Stripe(STRIPE_SECRET, {
  apiVersion: '2022-11-15',
  typescript: true,
});
