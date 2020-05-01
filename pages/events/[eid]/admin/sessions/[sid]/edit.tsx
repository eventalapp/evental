import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { EditSessionForm } from '../../../../../../components/sessions/EditSessionForm';
import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import { useVenuesQuery } from '../../../../../../hooks/queries/useVenuesQuery';
import { useSessionQuery } from '../../../../../../hooks/queries/useSessionQuery';
import { useEditSessionMutation } from '../../../../../../hooks/mutations/useEditSessionMutation';
import { getSession } from '../../../../../api/events/[eid]/sessions/[sid]';
import { getVenues } from '../../../../../api/events/[eid]/venues';
import type Prisma from '@prisma/client';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import Link from 'next/link';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { PasswordlessUser, ssrGetUser } from '../../../../../../utils/api';
import { useUser } from '../../../../../../hooks/queries/useUser';

type Props = {
	initialOrganizer: boolean;
	initialSession: Prisma.EventSession | undefined;
	initialVenues: Prisma.EventVenue[];
	initialUser: PasswordlessUser | undefined;
};

const EditSessionPage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialUser, initialVenues, initialSession } = props;
	const router = useRouter();
	const { eid, sid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid), initialVenues);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { session, isSessionLoading, sessionError } = useSessionQuery(
		String(eid),
		String(sid),
		initialSession
	);
	const { editSessionMutation } = useEditSessionMutation(String(eid), String(sid));
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialSession || !session) {
		return <NotFoundPage message="Session not found" />;
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
				<Link href={`/events/${eid}/admin/venues/edit`}>
					<a className="text-red-600">Before creating an session, you must create a venue.</a>
				</Link>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Session</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Edit Session</h1>

				<EditSessionForm
					eid={String(eid)}
					sid={String(sid)}
					venues={venues}
					session={session}
					editSessionMutation={editSessionMutation}
					isSessionLoading={isSessionLoading}
					isVenuesLoading={isVenuesLoading}
					venuesError={venuesError}
					sessionError={sessionError}
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, sid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialSession = (await getSession(String(eid), String(sid))) ?? undefined;
	const initialVenues = (await getVenues(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialSession,
			initialVenues
		}
	};
};

export default EditSessionPage;
