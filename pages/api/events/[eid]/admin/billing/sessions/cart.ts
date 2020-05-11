/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */
import { validateCartItems } from 'use-shopping-cart/src/serverUtil';
import Stripe from 'stripe';
import { api } from '../../../../../../../utils/api';

const inventory = [
	{
		name: 'Bananas',
		description: 'Yummy yellow fruit',
		sku: 'sku_GBJ2Ep8246qeeT',
		price: 400,
		image:
			'https://images.unsplash.com/photo-1574226516831-e1dff420e562?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=225&q=80',
		attribution: 'Photo by Priscilla Du Preez on Unsplash',
		currency: 'USD'
	},
	{
		name: 'Tangerines',
		sku: 'sku_GBJ2WWfMaGNC2Z',
		price: 100,
		image:
			'https://images.unsplash.com/photo-1482012792084-a0c3725f289f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=225&q=80',
		attribution: 'Photo by Jonathan Pielmayer on Unsplash',
		currency: 'USD'
	}
];

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2020-08-27'
});

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid } = req.query;

		// Validate the cart details that were sent from the client.
		const cartItems = req.body;
		const line_items = validateCartItems(inventory, cartItems);
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
