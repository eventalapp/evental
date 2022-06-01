import Stripe from 'stripe';

import { api } from '../../../../utils/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2020-08-27'
});

export default api({
	async POST({ req }) {
		const { id } = req.query;

		if (!String(id).startsWith('cs_')) {
			throw Error('Incorrect CheckoutSession ID.');
		}
		const checkout_session: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(
			String(id),
			{
				expand: ['payment_intent']
			}
		);

		return checkout_session;
	}
});
