import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { EventList } from '../../components/events/EventList';
import Column from '../../components/layout/Column';
import { Navigation } from '../../components/navigation';
import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import type Prisma from '@prisma/client';
import { ViewErrorPage } from '../../components/error/ViewErrorPage';
import { LoadingPage } from '../../components/error/LoadingPage';
import { ssrGetUser } from '../../utils/api';
import { useAttendingEventsQuery } from '../../hooks/queries/useAttendingEventsQuery';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { NotFoundPage } from '../../components/error/NotFoundPage';
import { getAttendingEvents } from '../api/events/attending';
import { useUser } from '../../hooks/queries/useUser';
import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { EventsNavigation } from '../../components/events/EventsNavigation';
import Link from 'next/link';

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialAttendingEvents: Prisma.Event[];
};

const AttendingEventsPage: NextPage<Props> = (props) => {
	const { initialAttendingEvents, initialUser } = props;
	const { attendingEventsError, isAttendingEventsLoading, attendingEvents } =
		useAttendingEventsQuery(String(initialUser?.id), initialAttendingEvents);
	const { user } = useUser(initialUser);

	if (isAttendingEventsLoading) {
		return <LoadingPage />;
	}

	if (attendingEventsError) {
		return <ViewErrorPage errors={[attendingEventsError]} />;
	}

	if (!user) {
		return <UnauthorizedPage />;
	}

	if (!attendingEvents) {
		return <NotFoundPage message="You are not attending any events" />;
	}

	if (attendingEvents.length === 0) {
		return (
			<PageWrapper variant="white">
				<Head>
					<title>Attending Events</title>
				</Head>

				<Navigation />

				<Column>
					<h1 className="text-3xl font-bold mb-3">Attending Events</h1>

					{user && <EventsNavigation />}

					<span className="block text-base mt-5">
						You are not attending any events.{' '}
						<Link href="/events" passHref>
							<a className="mt-3 text-primary font-bold">Find Events</a>
						</Link>
					</span>
				</Column>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="white">
			<Head>
				<title>Attending Events</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold mb-3">Attending Events</h1>

				{user && <EventsNavigation />}

				<EventList events={attendingEvents} />
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialAttendingEvents = await getAttendingEvents(String(initialUser?.id));

	return {
		props: { initialAttendingEvents, initialUser }
	};
};

export default AttendingEventsPage;
