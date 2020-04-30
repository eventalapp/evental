import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { CreateActivityForm } from '../../../../../components/activities/CreateActivityForm';
import { Navigation } from '../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useVenuesQuery } from '../../../../../hooks/queries/useVenuesQuery';
import { useCreateActivityMutation } from '../../../../../hooks/mutations/useCreateActivityMutation';
import React from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { getVenues } from '../../../../api/events/[eid]/venues';

import type Prisma from '@prisma/client';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import Link from 'next/link';
import { ViewNextkitErrorPage } from '../../../../../components/error/ViewNextkitErrorPage';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import user from '../../../../api/auth/user';
import { PasswordlessUser } from '../../../../../utils/api';

type Props = {
	initialOrganizer: boolean;
	initialVenues: Prisma.EventVenue[];
	user: PasswordlessUser | null;
};

const CreateActivityPage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialVenues, user } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid), initialVenues);
	const { createActivityMutation } = useCreateActivityMutation(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialVenues || !venues) {
		return <NotFoundPage message="No venues found." />;
	}

	if (isVenuesLoading || isEventLoading) {
		return <LoadingPage />;
	}

	if (venuesError || eventError) {
		return <ViewNextkitErrorPage errors={[venuesError, eventError]} />;
	}

	if (venues && venues.length === 0) {
		return (
			<PageWrapper>
				<Head>
					<title>Not Found</title>
				</Head>

				<Navigation />

				<Column>
					<Link href={`/events/${eid}/admin/venues/create`}>
						<a className="text-red-600">Before creating an activity, you must create a venue.</a>
					</Link>
				</Column>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Create Activity</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Create Activity</h1>

				<CreateActivityForm
					eid={String(eid)}
					venues={venues}
					venuesError={venuesError}
					isVenuesLoading={isVenuesLoading}
					createActivityMutation={createActivityMutation}
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialOrganizer = await getIsOrganizer(user.id, String(eid));
	const initialVenues = await getVenues(String(eid));

	return {
		props: {
			session,
			initialOrganizer,
			initialVenues
		}
	};
};

export default CreateActivityPage;
