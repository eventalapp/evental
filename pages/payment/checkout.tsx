import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { useUser } from '../../hooks/queries/useUser';
import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { Navigation } from '../../components/navigation';
import ElementsForm from '../../components/stripe/ElementsForm';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../../utils/stripe';

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

			<Column variant="halfWidth">
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

				<Elements stripe={getStripe()}>
					<ElementsForm />
				</Elements>
			</Column>
		</PageWrapper>
	);
};

export default EventBillingPage;
