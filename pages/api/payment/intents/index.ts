import Stripe from 'stripe';
import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '../../../../config';
import { formatAmountForStripe } from '../../../../utils/stripeHelpers';
import { api } from '../../../../utils/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2020-08-27'
});

export default api({
	async POST({ ctx, req }) {
		const { amount, metadata }: { amount: number; metadata: Record<string, string> } = req.body;

		// Validate the amount that was passed from the client.
		if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
			throw new Error('Invalid amount.');
		}
		// Create PaymentIntent from body params.
		const params: Stripe.PaymentIntentCreateParams = {
			payment_method_types: ['card'],
			amount: formatAmountForStripe(amount, CURRENCY),
			currency: CURRENCY,
			metadata
		};
		const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.create(params);

		return payment_intent;
	}
});
