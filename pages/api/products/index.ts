import { api } from '../../../utils/api';

export default api({
	async GET({ ctx, req }) {
		const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

		return await stripe.products.list();
	}
});