import { Elements } from '@stripe/react-stripe-js';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../components/Footer';
import { PurchaseProPlan } from '../../../../../components/billing/PurchaseProForm';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/typography/Heading';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useFounderQuery } from '../../../../../hooks/queries/useFounderQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { getStripe } from '../../../../../utils/stripe';

const EventBillingPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { isFounderLoading, isFounder } = useFounderQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (!isFounder) {
		return <NoAccessPage />;
	}

	return (
		<Elements stripe={getStripe()}>
			<PageWrapper>
				<Head>
					<title>Event Billing</title>
				</Head>

				<EventSettingsNavigation eid={String(eid)} />

				<div className="dark-topography text-white">
					<Column className="flex flex-col items-center">
						<Heading>Single Event Plans &amp; Pricing</Heading>
						<p className="mt-4 max-w-2xl text-center text-base text-gray-100">
							View pricing for single event plans for standard and nonprofit or educational events.
						</p>
					</Column>
				</div>

				<Column>
					<PurchaseProPlan eid={String(eid)} />
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</Elements>
	);
};

export default EventBillingPage;
