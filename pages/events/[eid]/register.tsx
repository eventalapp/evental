import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../components/layout/Column';
import { Navigation } from '../../../components/navigation';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { getSession } from 'next-auth/react';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Session } from 'next-auth';
import { EventRegistrationForm } from '../../../components/events/EventRegistrationForm';
import { useRegisterAttendeeMutation } from '../../../hooks/mutations/useRegisterAttendeeMutation';
import React from 'react';
import { UnauthorizedPage } from '../../../components/error/UnauthorizedPage';
import { getEvent } from '../../api/events/[eid]';
import Prisma from '@prisma/client';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import { Loading } from '../../../components/error/Loading';

type Props = {
	session: Session | null;
	initialEvent: Prisma.Event | undefined;
};

const EventRegisterPage: NextPage<Props> = (props) => {
	const { session, initialEvent } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { registerAttendeeError, registerAttendeeMutation } = useRegisterAttendeeMutation(
		String(eid)
	);

	if (!session?.user?.id) {
		return <UnauthorizedPage />;
	}

	if (!initialEvent) {
		return <NotFoundPage />;
	}

	if (isEventLoading) {
		return <Loading />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Event signup</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Register for this event</h1>

				<EventRegistrationForm
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
					registerAttendeeMutation={registerAttendeeMutation}
					registerAttendeeError={registerAttendeeError}
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
