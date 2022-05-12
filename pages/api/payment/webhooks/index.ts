import { buffer } from 'micro';
import Cors from 'micro-cors';
import Stripe from 'stripe';
import { api } from '../../../../utils/api';
import { NextkitError } from 'nextkit';
import { prisma } from '../../../../prisma/client';
import { priceToAttendees } from '../../../../utils/price';

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
	async POST({ ctx, req }) {
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
			const { metadata } = event.data.object as Record<string, unknown>;
			const { eventId } = metadata as Record<string, string>;

			if (eventId) {
				await prisma.event.update({
					where: {
						id: eventId
					},
					data: {
						level: 'PRO',
						maxAttendees: priceToAttendees(charge.amount / 100)
					}
				});
			} else {
				throw new NextkitError(400, 'Event id not found');
			}
		} else {
			console.warn(`Unhandled event type: ${event.type}`);
		}

		// Return a response to acknowledge receipt of the event.
		return { received: true };
	}
});

export default cors(handler as any);
