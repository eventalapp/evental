import React from 'react';
import { formatCurrencyString, useShoppingCart } from 'use-shopping-cart';
import { products } from '../../utils/const';
import Stripe from 'stripe';

type Props = {
	products: Stripe.Product[];
};

const Products: React.FC = () => {
	const { addItem, removeItem } = useShoppingCart();

	return (
		<section className="products">
			{products.map((product, i) => (
				<div key={`${i}-${product.sku}`} className="product">
					<img src={product.image} alt={product.name} />
					<h2>{product.name}</h2>
					<p className="price">
						{formatCurrencyString({
							value: product.price,
							currency: product.currency
						})}
					</p>
					<button className="cart-style-background" onClick={() => addItem(product)}>
						Add to cart
					</button>
					<button className="cart-style-background" onClick={() => removeItem(product.sku)}>
						Remove
					</button>
				</div>
			))}
		</section>
	);
};

export default Products;
