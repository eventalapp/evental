import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import Column from '../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { EventNavigation } from '../../../../../components/events/navigation';
import { ssrGetUser } from '../../../../../utils/api';
import {
	getSessionsByDate,
	PaginatedSessionsWithVenue
} from '../../../../api/events/[eid]/sessions';
import { getEvent } from '../../../../api/events/[eid]';
import { getRoles } from '../../../../api/events/[eid]/roles';
import Prisma from '@prisma/client';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { Pagination } from '../../../../../components/Pagination';
import { useSessionsByDateQuery } from '../../../../../hooks/queries/useSessionsByDateQuery';
import { SessionList } from '../../../../../components/sessions/SessionList';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import { formatInTimeZone } from 'date-fns-tz';

type Props = {
	initialSessionsByDate: PaginatedSessionsWithVenue | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
};

const ViewSessionTypePage: NextPage<Props> = (props) => {
	const { initialEvent, initialRoles, initialUser, initialSessionsByDate } = props;
	const router = useRouter();
	const [page, setPage] = useState(1);
	const { date, eid } = router.query;
	const { user, isUserLoading } = useUser(initialUser);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading } = useRolesQuery(String(eid), initialRoles);
	const { isSessionsByDateLoading, sessionsByDateData } = useSessionsByDateQuery(
		String(eid),
		String(date),
		{ initialData: initialSessionsByDate, page }
	);

	if (isRolesLoading || isEventLoading || isUserLoading || isSessionsByDateLoading) {
		return <LoadingPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!sessionsByDateData) {
		return <NotFoundPage message="Sessions not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Sessions By Date</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} />

			<Column>
				<FlexRowBetween>
					<h3 className="text-xl md:text-2xl font-medium">
						Sessions for {formatInTimeZone(new Date(String(date)), event.timeZone, 'MM/dd/yyyy')}
					</h3>
				</FlexRowBetween>

				<h3 className="text-xl md:text-2xl font-medium mt-5">
					Sessions{' '}
					<span className="font-normal text-gray-500">
						{sessionsByDateData?.pagination?.total > 0 && (
							<span className="font-normal text-gray-500">
								({sessionsByDateData?.pagination?.from || 0}/
								{sessionsByDateData?.pagination?.total || 0})
							</span>
						)}
					</span>
				</h3>

				<SessionList sessions={sessionsByDateData.sessions} eid={String(eid)} event={event} />

				{sessionsByDateData.pagination.pageCount > 1 && (
					<Pagination
						page={page}
						pageCount={sessionsByDateData.pagination.pageCount}
						setPage={setPage}
					/>
				)}
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, date } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialSessionsByDate = (await getSessionsByDate(String(eid), String(date))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSessionsByDate,
			initialEvent,
			initialRoles
		}
	};
};

export default ViewSessionTypePage;
