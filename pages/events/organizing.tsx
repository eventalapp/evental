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
import { useOrganizingEventsQuery } from '../../hooks/queries/useOrganizingEventsQuery';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { getOrganizingEvents } from '../api/events/organizing';
import { useUser } from '../../hooks/queries/useUser';
import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../components/error/NotFoundPage';
import { EventsNavigation } from '../../components/events/EventsNavigation';
import { CreateEventForm } from '../../components/events/CreateEventForm';
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialOrganizingEvents: Prisma.Event[];
};

const OrganizingEventsPage: NextPage<Props> = (props) => {
	const { initialOrganizingEvents, initialUser } = props;
	const { organizingEventsError, isOrganizingEventsLoading, organizingEvents } =
		useOrganizingEventsQuery(String(initialUser?.id), initialOrganizingEvents);
	const { user } = useUser(initialUser);
	const { createEventMutation } = useCreateEventMutation();

	if (isOrganizingEventsLoading) {
		return <LoadingPage />;
	}

	if (organizingEventsError) {
		return <ViewErrorPage errors={[organizingEventsError]} />;
	}

	if (!user) {
		return <UnauthorizedPage />;
	}

	if (!organizingEvents) {
		return <NotFoundPage message="You are not organizing any events" />;
	}

	if (organizingEvents.length === 0) {
		return (
			<PageWrapper variant="white">
				<Head>
					<title>Organizing Events</title>
				</Head>

				<Navigation />

				<Column>
					<h1 className="text-3xl font-bold mb-3">Organizing Events</h1>

					{user && <EventsNavigation />}

					<span className="block font-bold text-center text-lg mt-5">Organizing an event?</span>

					<CreateEventForm createEventMutation={createEventMutation} />
				</Column>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="white">
			<Head>
				<title>Organizing Events</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold mb-3">Organizing Events</h1>

				{user && <EventsNavigation />}

				<EventList events={organizingEvents} />
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizingEvents = await getOrganizingEvents(String(initialUser?.id));

	return {
		props: { initialOrganizingEvents, initialUser }
	};
};

export default OrganizingEventsPage;
