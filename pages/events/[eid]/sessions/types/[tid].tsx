import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { useSessionTypeQuery } from '../../../../../hooks/queries/useSessionTypeQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { ViewSessionType } from '../../../../../components/sessions/ViewSessionType';
import Column from '../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { EventNavigation } from '../../../../../components/events/navigation';
import { ssrGetUser } from '../../../../../utils/api';
import { getSessionsByType, SessionWithVenue } from '../../../../api/events/[eid]/sessions';
import { getEvent } from '../../../../api/events/[eid]';
import { getRoles } from '../../../../api/events/[eid]/roles';
import Prisma from '@prisma/client';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { getSessionType } from '../../../../api/events/[eid]/sessions/types/[tid]';
import { useSessionsByTypeQuery } from '../../../../../hooks/queries/useSessionsByTypeQuery';

type Props = {
	initialSessionType: Prisma.EventSessionType | undefined;
	initialSessions: SessionWithVenue[] | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
};

const ViewSessionTypePage: NextPage<Props> = (props) => {
	const { initialSessionType, initialEvent, initialRoles, initialUser, initialSessions } = props;

	const router = useRouter();
	const { tid, eid } = router.query;
	const { user, isUserLoading } = useUser(initialUser);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading } = useRolesQuery(String(eid), initialRoles);
	const { isSessionTypeLoading, sessionType } = useSessionTypeQuery(
		String(eid),
		String(tid),
		initialSessionType
	);
	const sessionsByTypeQuery = useSessionsByTypeQuery(String(eid), String(tid), initialSessions);

	if (isSessionTypeLoading || isRolesLoading || isEventLoading || isUserLoading) {
		return <LoadingPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!sessionType) {
		return <NotFoundPage message="Session Type not found." />;
	}

	if (!sessionsByTypeQuery.data) {
		return <NotFoundPage message="Sessions not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>{sessionType.name}</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} />

			<Column>
				<ViewSessionType
					sessionType={sessionType}
					eid={String(eid)}
					tid={String(tid)}
					sessions={sessionsByTypeQuery.data}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, tid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialSessionType = (await getSessionType(String(eid), String(tid))) ?? undefined;
	const initialSessions = (await getSessionsByType(String(eid), String(tid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSessions,
			initialEvent,
			initialRoles,
			initialSessionType
		}
	};
};

export default ViewSessionTypePage;