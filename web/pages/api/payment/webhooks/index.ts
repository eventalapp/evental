import * as Prisma from '@prisma/client';
import { buffer } from 'micro';
import Cors from 'micro-cors';
import { NextkitError } from 'nextkit';
import Stripe from 'stripe';

import { prisma } from '@eventalapp/shared/db/client';

import { api } from '../../../../utils/api';
import { getEvent } from '../../events/[eid]';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2020-08-27'
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body to construct the event.
export const config = {
	api: {
		bodyParser: false
	}
};

const cors = Cors({
	allowMethods: ['POST', 'HEAD']
});

const handler = api({
	async POST({ req }) {
		const buf = await buffer(req);
		const sig = req.headers['stripe-signature']!;

		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
		} catch (err) {
			throw new NextkitError(400, 'Webhook error');
		}

		// Successfully constructed event.
		console.log('Success:', event.id);

		// Cast event data to Stripe object.
		if (event.type === 'payment_intent.succeeded') {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			console.log(`PaymentIntent status: ${paymentIntent.status}`);
		} else if (event.type === 'payment_intent.payment_failed') {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			console.log(`Payment failed: ${paymentIntent.last_payment_error?.message}`);
		} else if (event.type === 'charge.succeeded') {
			const charge = event.data.object as Stripe.Charge;
			console.log(`Charge id: ${charge.id}`);
		} else if (event.type === 'checkout.session.completed') {
			const { metadata } = event.data.object as Record<string, unknown>;
			const { eventId, attendees, level } = metadata as Record<string, unknown>;

			console.log(`Checkout session completed: ${eventId} ${attendees} ${level}`);

			const eventFound = await getEvent(String(eventId));

			if (!eventFound) {
				console.error('Event not found');
				throw new NextkitError(500, 'An error has occurred. Please email support@evental.app');
			}

			if (eventFound && eventId && attendees && level) {
				await prisma.event.update({
					where: {
						id: eventFound.id
					},
					data: {
						level:
							Prisma.EventLevel[level as keyof typeof Prisma.EventLevel] ?? Prisma.EventLevel.PRO,
						maxAttendees: Number(attendees) ?? 250
					}
				});
			} else {
				throw new NextkitError(500, 'An error has occurred. Please email support@evental.app');
			}
		} else {
			console.warn(`Unhandled event type: ${event.type}`);
		}
	}
});

export default cors(handler as any);
