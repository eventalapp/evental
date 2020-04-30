import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../components/layout/Column';
import { Navigation } from '../../../components/navigation';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../components/layout/PageWrapper';
import { CreateAttendeeForm } from '../../../components/attendees/CreateAttendeeForm';
import React from 'react';
import { UnauthorizedPage } from '../../../components/error/UnauthorizedPage';
import { getEvent } from '../../api/events/[eid]';
import Prisma from '@prisma/client';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import { useCreateAttendeeMutation } from '../../../hooks/mutations/useCreateAttendeeMutation';
import { useImageUploadMutation } from '../../../hooks/mutations/useImageUploadMutation';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { PasswordlessUser } from '../../../utils/api';

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
};

const EventRegisterPage: NextPage<Props> = (props) => {
	const { user, initialEvent } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { createAttendeeMutation } = useCreateAttendeeMutation(String(eid));
	const { imageUploadMutation, imageUploadResponse } = useImageUploadMutation();

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!initialEvent || !event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (isEventLoading) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Event signup</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Register for this event</h1>

				<CreateAttendeeForm
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
					createAttendeeMutation={createAttendeeMutation}
					imageUploadMutation={imageUploadMutation}
					imageUploadResponse={imageUploadResponse}
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

export default EventRegisterPage;
