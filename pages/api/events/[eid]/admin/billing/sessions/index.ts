import Stripe from 'stripe';
import { api } from '../../../../../../../utils/api';
import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '../../../../../../../config';
import { formatAmountForStripe } from '../../../../../../../utils/stripeHelpers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2020-08-27'
});

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid } = req.query;
		const amount: number = req.body.amount;

		// Validate the amount that was passed from the client.
		if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
			throw new Error('Invalid amount.');
		}
		// Create Checkout Sessions from body params.
		const params: Stripe.Checkout.SessionCreateParams = {
			submit_type: 'donate',
			payment_method_types: ['card'],
			line_items: [
				{
					name: 'Custom amount donation',
					amount: formatAmountForStripe(amount, CURRENCY),
					currency: CURRENCY,
					quantity: 1
				}
			],
			success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${req.headers.origin}/donate-with-checkout`
		};
		const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);

		return checkoutSession;
	}
});
