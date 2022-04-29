import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { EditEventForm } from '../../../../components/events/EditEventForm';
import { Navigation } from '../../../../components/navigation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useEditEventMutation } from '../../../../hooks/mutations/useEditEventMutation';
import React, { useEffect } from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getEvent } from '../../../api/events/[eid]';
import Prisma from '@prisma/client';
import { Session } from 'next-auth';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { toast } from 'react-toastify';
import { ViewServerErrorPage } from '../../../../components/error/ViewServerErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';

type Props = {
	initialEvent: Prisma.Event | undefined;
	session: Session | null;
};

const EditEventPage: NextPage<Props> = (props) => {
	const { initialEvent, session } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { editEventMutation, editEventError } = useEditEventMutation(String(eid));

	useEffect(() => {
		toast.error(editEventError?.message);
	}, [editEventError]);

	if (!session?.user?.id) {
		return <UnauthorizedPage />;
	}

	if (!initialEvent || !event) {
		return <NotFoundPage />;
	}

	if (isEventLoading) {
		return <LoadingPage />;
	}

	if (eventError) {
		return <ViewServerErrorPage errors={[eventError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit event</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Edit Event</h1>

				<EditEventForm
					eid={String(eid)}
					editEventError={editEventError}
					eventError={eventError}
					editEventMutation={editEventMutation}
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

export default EditEventPage;
