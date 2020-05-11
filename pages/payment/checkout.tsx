import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { useUser } from '../../hooks/queries/useUser';
import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import Products from '../../components/stripe/Products';
import { Navigation } from '../../components/navigation';
import { formatCurrencyString, useShoppingCart } from 'use-shopping-cart';
import { CartActions, CartEntry as ICartEntry } from 'use-shopping-cart/core';
import ElementsForm from '../../components/stripe/ElementsForm';

function CartEntry({
	entry,
	removeItem
}: {
	entry: ICartEntry;
	removeItem: CartActions['removeItem'];
}) {
	return (
		<div>
			<h3>{entry.name}</h3>
			{entry.image ? <img width={100} src={entry.image} alt={entry.description} /> : null}
			<p>
				{entry.quantity} x {formatCurrencyString({ value: entry.price, currency: 'USD' })} ={' '}
				{entry.formattedValue}
			</p>
			<button onClick={() => removeItem(entry.id)}>Remove</button>
		</div>
	);
}

function Cart() {
	const cart = useShoppingCart();
	const { removeItem, cartDetails, clearCart, formattedTotalPrice } = cart;

	const cartEntries = Object.values(cartDetails ?? {}).map((entry) => (
		// @ts-ignore
		<CartEntry key={entry.id} entry={entry} removeItem={removeItem} />
	));

	return (
		<div>
			<h2>Cart</h2>
			<p>Total: {formattedTotalPrice}</p>
			{cartEntries.length === 0 ? <p>Cart is empty.</p> : null}
			{cartEntries.length > 0 ? (
				<>
					<button onClick={() => clearCart()}>Clear cart</button>
					{cartEntries}
				</>
			) : null}
		</div>
	);
}

const EventBillingPage: NextPage = () => {
	const router = useRouter();
	const { user, isUserLoading } = useUser();

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Plan Checkout</title>
			</Head>

			<Navigation />

			<Column>
				<div className="flex flex-col items-center">
					<h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
					<div className="flex flex-row items-center">
						<strong
							className="text-2xl tracking-tight font-bold font-display mr-2"
							aria-label="evental homepage"
						>
							Evental
						</strong>
						<span className="bg-primary text-white px-2 py-1 font-medium text-xs rounded">PRO</span>
					</div>
				</div>

				<Cart />

				<Products />

				<ElementsForm />
			</Column>
		</PageWrapper>
	);
};

export default EventBillingPage;
