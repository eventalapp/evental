import { Elements } from '@stripe/react-stripe-js';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../components/Footer';
import { PurchaseProPlan } from '../../../../../components/billing/PurchaseProForm';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
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

	if (isEventLoading || isUserLoading || isFounderLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!event) {
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
			<PageWrapper variant="gray">
				<Head>
					<title>Event Billing</title>
				</Head>

				<EventSettingsNavigation event={event} roles={roles} user={user} />

				<Column className="flex flex-col items-center">
					<h3 className="text-xl md:text-2xl font-medium">Single Event Plans & Pricing</h3>
					<PurchaseProPlan eid={String(eid)} />
				</Column>
			</PageWrapper>
			<Footer />
		</Elements>
	);
};

export default EventBillingPage;
