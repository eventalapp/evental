import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { DeleteEventForm } from '../../../../components/events/DeleteEventForm';
import { Navigation } from '../../../../components/navigation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useDeleteEventMutation } from '../../../../hooks/mutations/useDeleteEventMutation';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getEvent } from '../../../api/events/[eid]';
import type Prisma from '@prisma/client';

import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { Loading } from '../../../../components/error/Loading';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { PasswordlessUser } from '../../../../utils/api';

type Props = {
	initialEvent: Prisma.Event | undefined;
	initialUser: PasswordlessUser | undefined;
};

const DeleteEventPage: NextPage<Props> = (props) => {
	const { initialEvent, user } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { deleteEventMutation } = useDeleteEventMutation(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!initialEvent || !event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (isEventLoading) {
		return <Loading />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Event</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-semibold">
					You are about to delete an event ("{event.name}")
				</p>

				<h1 className="text-3xl font-bold">Delete Event</h1>

				<DeleteEventForm
					eventError={eventError}
					deleteEventMutation={deleteEventMutation}
					event={event}
					isEventLoading={isEventLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialEvent = (await getEvent(String(eid))) ?? undefined;

	return {
		props: {
			session,
			initialEvent
		}
	};
};

export default DeleteEventPage;
