import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import Column from '../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { useFounderQuery } from '../../../../../hooks/queries/useFounderQuery';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../../../../../utils/stripe';
import { PurchaseProPlan } from '../../../../../components/billing/PurchaseProForm';

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
		</Elements>
	);
};

export default EventBillingPage;
