import { NextkitError } from 'nextkit';
import Stripe from 'stripe';

import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '@eventalapp/shared/utils/config';

import { api } from '../../../../utils/api';
import { formatAmountForStripe } from '../../../../utils/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2020-08-27'
});

export default api({
	async POST({ req }) {
		const { amount, metadata }: { amount: number; metadata: Record<string, string> } = req.body;

		if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
			throw new NextkitError(400, 'Invalid amount.');
		}

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
