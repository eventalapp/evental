import { NextkitError } from 'nextkit';
import Stripe from 'stripe';

import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '../../../../config';
import { api } from '../../../../utils/api';
import { proAttendeePricing } from '../../../../utils/const';
import { PurchaseProSchema } from '../../../../utils/schemas';
import { formatAmountForStripe } from '../../../../utils/stripeHelpers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2020-08-27'
});

export default api({
	async POST({ req }) {
		const body = PurchaseProSchema.parse(req.body);
		const product = proAttendeePricing[body.attendees];

		if (!product) {
			throw new NextkitError(400, 'Invalid attendee amount');
		}

		if (!(product.price >= MIN_AMOUNT && product.price <= MAX_AMOUNT)) {
			throw new NextkitError(400, 'Invalid amount.');
		}

		const params: Stripe.Checkout.SessionCreateParams = {
			payment_method_types: ['card'],
			mode: 'payment',
			success_url: `${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'}/events/${
				body.eventId
			}/admin`,
			cancel_url: `${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'}/events/${
				body.eventId
			}/admin/billing`,
			metadata: {
				eventId: body.eventId,
				level: product.level,
				attendees: product.attendees
			},
			line_items: [
				{
					quantity: 1,
					price_data: {
						product_data: {
							images: [product.image],
							name: product.name,
							description: product.description
						},
						unit_amount: formatAmountForStripe(product.price, CURRENCY),
						currency: CURRENCY
					}
				}
			]
		};
		const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);

		return checkoutSession;
	}
});
