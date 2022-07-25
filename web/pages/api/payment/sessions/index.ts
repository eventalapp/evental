import * as Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';
import Stripe from 'stripe';

import { prisma } from '@eventalapp/shared/db/client';
import { PurchaseProSchema } from '@eventalapp/shared/utils';
import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '@eventalapp/shared/utils/config';

import { api } from '../../../../utils/api';
import { proAttendeePricing, sale } from '../../../../utils/price';
import { formatAmountForStripe } from '../../../../utils/stripe';
import { getEvent } from '../../events/[eid]';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2020-08-27'
});

export type UpgradeResponsePayload = {
	upgraded: boolean;
};

export type UpgradeResponse = UpgradeResponsePayload | Stripe.Checkout.Session;

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

		let finalPrice = product.price;

		if (sale.flatAmount > 0) {
			finalPrice -= sale.flatAmount;
		}

		if (sale.percentage > 0) {
			finalPrice *= 1 - sale.percentage / 100;
		}

		if (finalPrice <= 1) {
			const eventFound = await getEvent(String(body.eventId));

			if (!eventFound) {
				console.error('Event not found');
				throw new NextkitError(500, 'An error has occurred. Please email support@evental.app');
			}

			if (eventFound && body.eventId) {
				await prisma.event.update({
					where: {
						id: eventFound.id
					},
					data: {
						level:
							Prisma.EventLevel[product.level as keyof typeof Prisma.EventLevel] ??
							Prisma.EventLevel.PRO,
						maxAttendees: Number(product.attendees) ?? 250
					}
				});

				const response: UpgradeResponse = { upgraded: true };

				return response;
			} else {
				throw new NextkitError(500, 'An error has occurred. Please email support@evental.app');
			}
		}

		const params: Stripe.Checkout.SessionCreateParams = {
			payment_method_types: ['card'],
			mode: 'payment',
			success_url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'evental.app'}/events/${
				body.eventId
			}/admin`,
			cancel_url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'evental.app'}/events/${
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
						unit_amount: formatAmountForStripe(finalPrice, CURRENCY),
						currency: CURRENCY
					}
				}
			]
		};

		const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);

		return checkoutSession;
	}
});
