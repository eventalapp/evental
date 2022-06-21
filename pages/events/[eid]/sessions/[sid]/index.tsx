import Prisma from '@prisma/client';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../components/Footer';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventNavigation } from '../../../../../components/events/navigation';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { ViewSession } from '../../../../../components/sessions/ViewSession';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useIsSessionAttendeeQuery } from '../../../../../hooks/queries/useIsSessionAttendeeQuery';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useSessionAttendeesQuery } from '../../../../../hooks/queries/useSessionAttendeesQuery';
import { useSessionQuery } from '../../../../../hooks/queries/useSessionQuery';
import { useSessionRoleAttendeesQuery } from '../../../../../hooks/queries/useSessionRoleAttendeesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { ssrGetUser } from '../../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { getEvent } from '../../../../api/events/[eid]';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { getPages } from '../../../../api/events/[eid]/pages';
import { getRoles } from '../../../../api/events/[eid]/roles';
import { SessionWithVenue } from '../../../../api/events/[eid]/sessions';
import { getSession } from '../../../../api/events/[eid]/sessions/[sid]';
import { getIsSessionAttendee } from '../../../../api/events/[eid]/sessions/[sid]/attendee';
import { getSessionAttendees } from '../../../../api/events/[eid]/sessions/[sid]/attendees';

type Props = {
	initialSession: SessionWithVenue | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialSessionAttendees: AttendeeWithUser[] | undefined;
	initialRoleSessionAttendees: AttendeeWithUser[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
	initialIsOrganizer: boolean;
	initialIsSessionAttendee: boolean;
};

const ViewSessionPage: NextPage<Props> = (props) => {
	const {
		initialSession,
		initialUser,
		initialRoles,
		initialEvent,
		initialSessionAttendees,
		initialIsSessionAttendee,
		initialRoleSessionAttendees,
		initialPages,
		initialIsOrganizer
	} = props;
	const router = useRouter();
	const { sid, eid } = router.query;
	const { user } = useUser(initialUser);
	const { session, isSessionLoading, sessionError } = useSessionQuery(
		String(eid),
		String(sid),
		initialSession
	);

	const { sessionAttendeesQuery } = useSessionAttendeesQuery(
		String(eid),
		String(sid),
		initialSessionAttendees
	);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialIsOrganizer);
	const { isSessionAttendee, isSessionAttendeeLoading } = useIsSessionAttendeeQuery(
		String(eid),
		String(sid),
		{ initialData: initialIsSessionAttendee }
	);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});
	const { sessionRoleAttendeesQuery } = useSessionRoleAttendeesQuery(String(eid), String(sid), {
		initialData: initialRoleSessionAttendees
	});

	if (
		isSessionLoading ||
		isRolesLoading ||
		isEventLoading ||
		isPagesLoading ||
		isOrganizerLoading ||
		isSessionAttendeeLoading
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
		<PageWrapper>
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
					user={user}
					roleAttendees={sessionRoleAttendeesQuery.data}
					attendees={sessionAttendeesQuery.data}
					isAttending={Boolean(isSessionAttendee)}
					session={session}
					eid={String(eid)}
					sid={String(sid)}
					event={event}
				/>
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { sid, eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialSession = (await getSession(String(eid), String(sid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialIsOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? false;
	const initialSessionAttendees =
		(await getSessionAttendees(String(eid), String(sid), { type: 'ATTENDEE' })) ?? undefined;
	const initialRoleSessionAttendees =
		(await getSessionAttendees(String(eid), String(sid), { type: 'ROLE' })) ?? undefined;
	const initialIsSessionAttendee =
		(await getIsSessionAttendee({
			eid: String(eid),
			sid: String(sid),
			userId: String(initialUser?.id)
		})) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSession,
			initialEvent,
			initialRoles,
			initialSessionAttendees,
			initialIsSessionAttendee,
			initialPages,
			initialIsOrganizer,
			initialRoleSessionAttendees
		}
	};
};

export default ViewSessionPage;
