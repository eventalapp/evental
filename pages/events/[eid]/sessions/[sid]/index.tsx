import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewSession } from '../../../../../components/sessions/ViewSession';
import Column from '../../../../../components/layout/Column';
import { Navigation } from '../../../../../components/navigation';
import { useSessionQuery } from '../../../../../hooks/queries/useSessionQuery';
import React from 'react';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';

import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../../utils/api';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { getSession } from '../../../../api/events/[eid]/sessions/[sid]';
import { useSessionAttendeeQuery } from '../../../../../hooks/queries/useSessionAttendeeQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { useSessionAttendeesQuery } from '../../../../../hooks/queries/useSessionAttendeesQuery';
import { SessionWithVenue } from '../../../../api/events/[eid]/sessions';

type Props = {
	initialSession: SessionWithVenue | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
};

const ViewSessionPage: NextPage<Props> = (props) => {
	const { initialSession, initialOrganizer, initialUser } = props;
	const router = useRouter();
	const { sid, eid } = router.query;
	const { user } = useUser(initialUser);
	const { session, isSessionLoading, sessionError } = useSessionQuery(
		String(eid),
		String(sid),
		initialSession
	);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { sessionAttendeeQuery } = useSessionAttendeeQuery(
		String(eid),
		String(sid),
		String(user?.id)
	);
	const { sessionAttendeesQuery } = useSessionAttendeesQuery(String(eid), String(sid));

	if (!initialSession || !session) {
		return <NotFoundPage message="Session not found." />;
	}

	if (isOrganizerLoading || isSessionLoading) {
		return <LoadingPage />;
	}

	if (sessionError) {
		return <ViewErrorPage errors={[sessionError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Session: {sid}</title>
			</Head>

			<Navigation />

			<Column>
				<ViewSession
					sessionAttendeesQuery={sessionAttendeesQuery}
					sessionAttendeeQuery={sessionAttendeeQuery}
					session={session}
					isSessionLoading={isSessionLoading}
					sessionError={sessionError}
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					eid={String(eid)}
					sid={String(sid)}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { sid, eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialSession = (await getSession(String(eid), String(sid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSession,
			initialOrganizer
		}
	};
};

export default ViewSessionPage;
