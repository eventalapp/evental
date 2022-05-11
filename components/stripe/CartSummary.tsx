import React, { useEffect, useState } from 'react';
import StripeTestCards from './StripeTestCards';
import { useShoppingCart } from 'use-shopping-cart';
import axios from 'axios';

const CartSummary = () => {
	const [loading, setLoading] = useState(false);
	const [cartEmpty, setCartEmpty] = useState(true);
	const { formattedTotalPrice, cartCount, clearCart, cartDetails, redirectToCheckout } =
		useShoppingCart();

	useEffect(() => setCartEmpty(!cartCount), [cartCount]);

	const handleCheckout: React.FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		setLoading(true);

		const response = await axios.post('/api/checkout_sessions/cart', cartDetails);

		if (response.status === 500) {
			console.error(response.data);
			return;
		}

		redirectToCheckout({ sessionId: response.data.id });
	};

	return (
		<form onSubmit={handleCheckout}>
			<h2>Cart summary</h2>
			{/* This is where we'll render our cart */}
			<p suppressHydrationWarning>
				<strong>Number of Items:</strong> {cartCount}
			</p>
			<p suppressHydrationWarning>
				<strong>Total:</strong> {formattedTotalPrice}
			</p>

			{/* Redirects the user to Stripe */}
			<StripeTestCards />
			<button className="cart-style-background" type="submit" disabled={cartEmpty || loading}>
				Checkout
			</button>
			<button className="cart-style-background" type="button" onClick={clearCart}>
				Clear Cart
			</button>
		</form>
	);
};

export default CartSummary;
