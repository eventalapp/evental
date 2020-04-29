import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { CreateActivityForm } from '../../../../../components/activities/CreateActivityForm';
import { Navigation } from '../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useVenuesQuery } from '../../../../../hooks/queries/useVenuesQuery';
import { useCreateActivityMutation } from '../../../../../hooks/mutations/useCreateActivityMutation';
import React, { useEffect } from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { getVenues } from '../../../../api/events/[eid]/venues';
import { Session } from 'next-auth';
import type Prisma from '@prisma/client';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ViewServerErrorPage } from '../../../../../components/error/ViewServerErrorPage';
import { LoadingPage } from '../../../../../components/error/LoadingPage';

type Props = {
	initialOrganizer: boolean;
	initialVenues: Prisma.EventVenue[];
	session: Session | null;
};

const CreateActivityPage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialVenues, session } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid), initialVenues);
	const { createActivityError, createActivityMutation } = useCreateActivityMutation(String(eid));

	useEffect(() => {
		createActivityError && toast.error(createActivityError.message);
	}, [createActivityError]);

	if (!session?.user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialVenues || !venues) {
		return <NotFoundPage />;
	}

	if (isVenuesLoading) {
		return <LoadingPage />;
	}

	if (venuesError) {
		return <ViewServerErrorPage errors={[venuesError]} />;
	}

	if (venues && venues.length === 0) {
		return (
			<PageWrapper>
				<Link href={`/events/${eid}/admin/venues/create`}>
					<a className="text-red-600">Before creating an activity, you must create a venue.</a>
				</Link>
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
				<h1 className="text-3xl">Create Activity Page</h1>

				<CreateActivityForm
					eid={String(eid)}
					venues={venues}
					venuesError={venuesError}
					isVenuesLoading={isVenuesLoading}
					createActivityError={createActivityError}
					createActivityMutation={createActivityMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialOrganizer = await getIsOrganizer(session?.user.id, String(eid));
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
