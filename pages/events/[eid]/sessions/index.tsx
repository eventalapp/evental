import Prisma from '@prisma/client';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/navigation';
import { Footer } from '../../../../components/Footer';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { SessionList } from '../../../../components/sessions/SessionList';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsAttendeeQuery } from '../../../../hooks/queries/useIsAttendeeQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useSessionsQuery } from '../../../../hooks/queries/useSessionsQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { ssrGetUser } from '../../../../utils/api';
import { PasswordlessUser } from '../../../../utils/stripUserPassword';
import { getEvent } from '../../../api/events/[eid]';
import { getIsAttendee } from '../../../api/events/[eid]/attendee';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { getPages } from '../../../api/events/[eid]/pages';
import { getRoles } from '../../../api/events/[eid]/roles';
import { getSessions, SessionWithVenue } from '../../../api/events/[eid]/sessions';

type Props = {
	initialSessions: SessionWithVenue[] | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
	initialIsAttendee: boolean;
};

const SessionsPage: NextPage<Props> = (props) => {
	const {
		initialSessions,
		initialOrganizer,
		initialEvent,
		initialRoles,
		initialIsAttendee,
		initialUser,
		initialPages
	} = props;
	const router = useRouter();
	const { eid } = router.query;

	const { sessionsData, isSessionsLoading, sessionsError } = useSessionsQuery(String(eid), {
		initialData: initialSessions
	});
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialOrganizer);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const { isAttendee, isAttendeeLoading } = useIsAttendeeQuery(String(eid), initialIsAttendee);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (
		isSessionsLoading ||
		isOrganizerLoading ||
		isAttendeeLoading ||
		isRolesLoading ||
		isEventLoading ||
		isPagesLoading
	) {
		return <LoadingPage />;
	}

	if (!sessionsData) {
		return <NotFoundPage message="No sessions not found." />;
	}

	if (sessionsError || rolesError || eventError) {
		return <ViewErrorPage errors={[sessionsError, rolesError, eventError]} />;
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
				title={`Sessions — ${event.name}`}
				description={`View all of the sessions for ${event.name}.`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/sessions`,
					title: `Sessions — ${event.name}`,
					description: `View all of the sessions for ${event.name}.`,
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
				{event && (
					<EventHeader
						adminLink={'/sessions'}
						event={event}
						eid={String(eid)}
						isOrganizer={isOrganizer}
						isAttendee={isAttendee}
						user={user}
					/>
				)}

				<SessionList sessions={sessionsData} eid={String(eid)} event={event} user={user} />
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialSessions = (await getSessions(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? false;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialIsAttendee =
		(await getIsAttendee({ eid: String(eid), userId: String(initialUser?.id) })) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSessions,
			initialOrganizer,
			initialEvent,
			initialRoles,
			initialIsAttendee,
			initialPages
		}
	};
};

export default SessionsPage;
