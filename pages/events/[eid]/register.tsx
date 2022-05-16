import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
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
import { LoadingPage } from '../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../utils/api';
import { useUser } from '../../../hooks/queries/useUser';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { NextSeo } from 'next-seo';
import { formatInTimeZone } from 'date-fns-tz';
import { PrivatePage } from '../../../components/error/PrivatePage';
import { getIsOrganizer } from '../../api/events/[eid]/organizer';
import { useOrganizerQuery } from '../../../hooks/queries/useOrganizerQuery';

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialOrganizer: boolean;
};

const EventRegisterPage: NextPage<Props> = (props) => {
	const { initialUser, initialEvent, initialOrganizer } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { createAttendeeMutation } = useCreateAttendeeMutation(String(eid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { user } = useUser(initialUser);

	if (isEventLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!initialEvent || !event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper variant="gray">
			<NextSeo
				title={`Register for ${event.name} — Evental`}
				description={`Fill out the form below to register for ${
					event.name
				} taking place from ${formatInTimeZone(
					event.startDate,
					event.timeZone,
					'MMMM do'
				)} to ${formatInTimeZone(event.endDate, event.timeZone, 'MMMM do')}.`}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/regsister`,
					title: `Register for ${event.name} — Evental`,
					description: `Fill out the form below to register for ${
						event.name
					} taking place from ${formatInTimeZone(
						event.startDate,
						event.timeZone,
						'MMMM do'
					)} to ${formatInTimeZone(event.endDate, event.timeZone, 'MMMM do')}.`,
					images: [
						{
							url: `https://cdn.evental.app${event.image}`,
							width: 300,
							height: 300,
							alt: `${event.name} Logo Alt`,
							type: 'image/jpeg'
						}
					]
				}}
			/>

			<Navigation />

			<Column variant="halfWidth">
				<h1 className="text-2xl md:text-3xl font-bold">Register for {event.name}</h1>

				<p className="text-gray-700 mt-2">
					To attend this event, please click the register button below.
				</p>

				<CreateAttendeeForm
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
					createAttendeeMutation={createAttendeeMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialEvent,
			initialOrganizer
		}
	};
};

export default EventRegisterPage;
