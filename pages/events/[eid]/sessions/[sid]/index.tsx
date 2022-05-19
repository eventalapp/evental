import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ViewSession } from '../../../../../components/sessions/ViewSession';
import Column from '../../../../../components/layout/Column';
import { useSessionQuery } from '../../../../../hooks/queries/useSessionQuery';
import React from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { getSession } from '../../../../api/events/[eid]/sessions/[sid]';
import { useSessionAttendeeQuery } from '../../../../../hooks/queries/useSessionAttendeeQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { useSessionAttendeesQuery } from '../../../../../hooks/queries/useSessionAttendeesQuery';
import { SessionWithVenue } from '../../../../api/events/[eid]/sessions';
import { EventNavigation } from '../../../../../components/events/navigation';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { getEvent } from '../../../../api/events/[eid]';
import { getRoles } from '../../../../api/events/[eid]/roles';
import Prisma from '@prisma/client';
import { getSessionAttendees } from '../../../../api/events/[eid]/sessions/[sid]/attendees';
import { getSessionAttendee } from '../../../../api/events/[eid]/sessions/[sid]/attendees/[uid]';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';
import { getPages } from '../../../../api/events/[eid]/pages';
import { NextSeo } from 'next-seo';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { useSessionRoleAttendeesQuery } from '../../../../../hooks/queries/useSessionRoleAttendeesQuery';

type Props = {
	initialSession: SessionWithVenue | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialSessionAttendees: AttendeeWithUser[] | undefined;
	initialSessionAttendee: AttendeeWithUser | undefined;
	initialPages: Prisma.EventPage[] | undefined;
	initialOrganizer: boolean;
};

const ViewSessionPage: NextPage<Props> = (props) => {
	const {
		initialSession,
		initialUser,
		initialRoles,
		initialEvent,
		initialSessionAttendees,
		initialSessionAttendee,
		initialPages,
		initialOrganizer
	} = props;
	const router = useRouter();
	const { sid, eid } = router.query;
	const { user } = useUser(initialUser);
	const { session, isSessionLoading, sessionError } = useSessionQuery(
		String(eid),
		String(sid),
		initialSession
	);
	const { sessionAttendeeQuery: isAttendingSessionQuery } = useSessionAttendeeQuery(
		String(eid),
		String(sid),
		String(user?.id),
		initialSessionAttendee
	);
	const { sessionAttendeesQuery } = useSessionAttendeesQuery(
		String(eid),
		String(sid),
		initialSessionAttendees
	);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});
	const { sessionRoleAttendeesQuery } = useSessionRoleAttendeesQuery(String(eid), String(sid));

	if (
		isSessionLoading ||
		isRolesLoading ||
		isEventLoading ||
		isPagesLoading ||
		isOrganizerLoading
	) {
		return <LoadingPage />;
	}

	if (!initialSession || !session) {
		return <NotFoundPage message="Session not found." />;
	}

	if (sessionError || rolesError || eventError) {
		return <ViewErrorPage errors={[sessionError, eventError, rolesError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper variant="gray">
			<NextSeo
				title={`${session.name} — ${event.name}`}
				description={`View the attendees, speakers, and details of ${session.name} at ${event.name}`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/sessions/${session.slug}`,
					title: `${session.name} — ${event.name}`,
					description: `View the attendees, speakers, and details of ${session.name} at ${event.name}`,
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
				<ViewSession
					roleAttendees={sessionRoleAttendeesQuery.data}
					attendees={sessionAttendeesQuery.data}
					isAttending={Boolean(isAttendingSessionQuery.data)}
					session={session}
					eid={String(eid)}
					sid={String(sid)}
					event={event}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { sid, eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialSession = (await getSession(String(eid), String(sid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? false;
	const initialSessionAttendees =
		(await getSessionAttendees(String(eid), String(sid))) ?? undefined;
	const initialSessionAttendee =
		(await getSessionAttendee(String(eid), String(sid), String(initialUser?.id))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSession,
			initialEvent,
			initialRoles,
			initialSessionAttendees,
			initialSessionAttendee,
			initialPages,
			initialOrganizer
		}
	};
};

export default ViewSessionPage;
