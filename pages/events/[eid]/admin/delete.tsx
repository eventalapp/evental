import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { DeleteEventForm } from '../../../../components/events/DeleteEventForm';
import { Navigation } from '../../../../components/navigation';
import Unauthorized from '../../../../components/Unauthorized';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useDeleteEventMutation } from '../../../../hooks/mutations/useDeleteEventMutation';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getEvent } from '../../../api/events/[eid]';
import type Prisma from '@prisma/client';
import { Session } from 'next-auth';

type Props = {
	initialEvent: Prisma.Event | undefined;
	session: Session | null;
};

const DeleteEventPage: NextPage<Props> = (props) => {
	const { initialEvent, session } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { deleteEventMutation, deleteEventError } = useDeleteEventMutation(String(eid));

	if (!session?.user?.id) {
		return (
			<PageWrapper variant="gray">
				<Unauthorized />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete event</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Delete Event</h1>

				<DeleteEventForm
					deleteEventError={deleteEventError}
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
