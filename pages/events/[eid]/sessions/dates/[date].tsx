import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import Column from '../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { EventNavigation } from '../../../../../components/events/navigation';
import { ssrGetUser } from '../../../../../utils/api';
import { getSessionsByDate, SessionWithVenue } from '../../../../api/events/[eid]/sessions';
import { getEvent } from '../../../../api/events/[eid]';
import { getRoles } from '../../../../api/events/[eid]/roles';
import Prisma from '@prisma/client';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { useSessionsByDateQuery } from '../../../../../hooks/queries/useSessionsByDateQuery';
import { SessionList } from '../../../../../components/sessions/SessionList';
import dayjs from 'dayjs';
import { getPages } from '../../../../api/events/[eid]/pages';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';
import { NextSeo } from 'next-seo';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';

type Props = {
	initialSessionsByDate: SessionWithVenue[] | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
	initialOrganizer: boolean;
};

const ViewSessionTypePage: NextPage<Props> = (props) => {
	const {
		initialEvent,
		initialRoles,
		initialUser,
		initialSessionsByDate,
		initialPages,
		initialOrganizer
	} = props;
	const router = useRouter();
	const { date, eid } = router.query;
	const { user, isUserLoading } = useUser(initialUser);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading } = useRolesQuery(String(eid), initialRoles);
	const { isSessionsByDateLoading, sessionsByDateData } = useSessionsByDateQuery(
		String(eid),
		String(date),
		{ initialData: initialSessionsByDate }
	);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);

	if (
		isRolesLoading ||
		isEventLoading ||
		isUserLoading ||
		isSessionsByDateLoading ||
		isPagesLoading ||
		isOrganizerLoading
	) {
		return <LoadingPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!sessionsByDateData) {
		return <NotFoundPage message="Sessions not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper variant="gray">
			<NextSeo
				title={`${dayjs(String(date)).startOf('day').tz(event.timeZone).format('MMMM D')} — ${
					event.name
				}`}
				description={`View all of the sessions for ${dayjs(String(date))
					.startOf('day')
					.tz(event.timeZone)
					.format('YYYY/MM/DD')} at ${event.name}`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/sessions/dates/${date}`,
					title: `${dayjs(String(date)).startOf('day').tz(event.timeZone).format('YYYY/MM/DD')} — ${
						event.name
					}`,
					description: `View all of the sessions for ${dayjs(String(date))
						.startOf('day')
						.tz(event.timeZone)
						.format('YYYY/MM/DD')} at ${event.name}`,
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

			<EventNavigation event={event} roles={roles} user={user} pages={pages} />

			<Column>
				<h3 className="text-xl md:text-2xl font-medium mt-5">
					Sessions for {dayjs(String(date)).startOf('day').tz(event.timeZone).format('MMMM D')}{' '}
					<span className="font-normal text-gray-500">({sessionsByDateData.length || 0})</span>
				</h3>

				<SessionList sessions={sessionsByDateData} eid={String(eid)} event={event} />
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, date } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialSessionsByDate = (await getSessionsByDate(String(eid), String(date))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSessionsByDate,
			initialEvent,
			initialRoles,
			initialPages,
			initialOrganizer
		}
	};
};

export default ViewSessionTypePage;
