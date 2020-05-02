import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { CreateSessionForm } from '../../../../../components/sessions/CreateSessionForm';
import { Navigation } from '../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useVenuesQuery } from '../../../../../hooks/queries/useVenuesQuery';
import { useCreateSessionMutation } from '../../../../../hooks/mutations/useCreateSessionMutation';
import React from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { getVenues } from '../../../../api/events/[eid]/venues';
import type Prisma from '@prisma/client';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import Link from 'next/link';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { ssrGetUser } from '../../../../../utils/api';
import { useUser } from '../../../../../hooks/queries/useUser';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';

type Props = {
	initialOrganizer: boolean;
	initialVenues: Prisma.EventVenue[];
	initialUser: PasswordlessUser | undefined;
};

const CreateSessionPage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialVenues, initialUser } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid), initialVenues);
	const { createSessionMutation } = useCreateSessionMutation(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user } = useUser(initialUser);

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
		return <ViewErrorPage errors={[venuesError, eventError]} />;
	}

	if (venues && venues.length === 0) {
		return (
			<PageWrapper>
				<Head>
					<title>Not Found</title>
				</Head>

				<Navigation />

				<Column>
					<h1 className="text-3xl font-bold">Error</h1>

					<p className="mt-2">
						Before creating a session, you must{' '}
						<Link href={`/events/${eid}/admin/venues/create`} passHref>
							<a className="text-primary font-bold">create a venue</a>
						</Link>
						.
					</p>
				</Column>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Create Session</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Create Session</h1>

				<CreateSessionForm
					eid={String(eid)}
					venues={venues}
					venuesError={venuesError}
					isVenuesLoading={isVenuesLoading}
					createSessionMutation={createSessionMutation}
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

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialVenues = await getVenues(String(eid));

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialVenues
		}
	};
};

export default CreateSessionPage;
