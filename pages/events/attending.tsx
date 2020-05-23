import type { GetServerSideProps, NextPage } from 'next';
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
import { EventsPageNavigation } from '../../components/events/EventsPageNavigation';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

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
				<NextSeo
					title="Attending Events — Evental"
					description="View all of the events you are attending."
					openGraph={{
						url: 'https://evental.app/events/attending',
						title: 'Attending Events',
						description: 'View all of the events you are attending.',
						images: [
							{
								url: 'https://cdn.evental.app/images/logo.jpg',
								width: 389,
								height: 389,
								alt: 'Evental Logo Alt',
								type: 'image/jpeg'
							}
						]
					}}
				/>

				<Navigation />

				<Column>
					<h1 className="text-2xl md:text-3xl font-bold mb-3 text-center">Attending Events</h1>

					{user && <EventsPageNavigation />}

					<span className="block text-base mt-5 text-center">
						You are not attending any events.{' '}
						<Link href="/events" passHref>
							<a className="mt-3 text-primary font-medium">Find Events</a>
						</Link>
					</span>
				</Column>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Attending Events — Evental"
				description="View all of the events you are attending."
				openGraph={{
					url: 'https://evental.app/events/attending',
					title: 'Attending Events',
					description: 'View all of the events you are attending.',
					images: [
						{
							url: 'https://cdn.evental.app/images/logo.jpg',
							width: 389,
							height: 389,
							alt: 'Evental Logo Alt',
							type: 'image/jpeg'
						}
					]
				}}
			/>

			<Navigation />

			<Column>
				<h1 className="text-2xl md:text-3xl font-bold mb-3 text-center">Attending Events</h1>

				<EventsPageNavigation />

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
