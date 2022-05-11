/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */

import Stripe from 'stripe';
import { api } from '../../../../utils/api';
import { validateCartItems } from 'use-shopping-cart/utilities/serverless';
import { products } from '../../../../utils/const';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2020-08-27'
});

export default api({
	async POST({ ctx, req }) {
		// Validate the cart details that were sent from the client.
		const cartItems = req.body;
		const line_items = validateCartItems(products, cartItems);
		// Create Checkout Sessions from body params.
		const params: Stripe.Checkout.SessionCreateParams = {
			submit_type: 'pay',
			payment_method_types: ['card'],
			billing_address_collection: 'auto',
			shipping_address_collection: {
				allowed_countries: ['US', 'CA']
			},
			line_items,
			success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${req.headers.origin}/use-shopping-cart`
		};
		const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);

		return checkoutSession;
	}
});
