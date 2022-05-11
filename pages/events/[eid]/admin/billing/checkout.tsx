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
import { useForm } from 'react-hook-form';

const EventBillingPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { isFounderLoading, isFounder } = useFounderQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	const { control, watch } = useForm({ defaultValues: { attendees: 250 } });

	const attendees = watch('attendees');
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
		<PageWrapper variant="gray">
			<Head>
				<title>Plan Checkout</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

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
			</Column>
		</PageWrapper>
	);
};

export default EventBillingPage;
