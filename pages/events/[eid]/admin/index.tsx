import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import React from 'react';

import Prisma from '@prisma/client';
import { getEvent } from '../../../api/events/[eid]';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EditEventForm } from '../../../../components/events/EditEventForm';
import { Navigation } from '../../../../components/navigation';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { PasswordlessUser } from '../../../../utils/stripUserPassword';
import { ssrGetUser } from '../../../../utils/api';
import { useEditEventMutation } from '../../../../hooks/mutations/useEditEventMutation';
import Column from '../../../../components/layout/Column';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { useUser } from '../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import EventNavigationMenu from '../../../../components/radix/components/EventNavigationMenu';

type Props = {
	initialEvent: Prisma.Event | undefined;
	initialUser: PasswordlessUser | undefined;
};

const EditEventPage: NextPage<Props> = (props) => {
	const { initialEvent, initialUser } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { editEventMutation } = useEditEventMutation(String(eid));
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!initialEvent || !event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (isEventLoading) {
		return <LoadingPage />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Event Settings</title>
			</Head>

			<Navigation />

			<Column>
				<EventNavigationMenu eid={String(eid)} />

				<h1 className="text-3xl font-bold">Event Settings</h1>

				<EditEventForm
					eid={String(eid)}
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

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialEvent
		}
	};
};

export default EditEventPage;
