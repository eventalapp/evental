import Prisma from '@prisma/client';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventNavigation } from '../../../../../components/events/navigation';
import { Footer } from '../../../../../components/Footer';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { ViewSessionType } from '../../../../../components/sessions/ViewSessionType';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useSessionsByTypeQuery } from '../../../../../hooks/queries/useSessionsByTypeQuery';
import { useSessionTypeQuery } from '../../../../../hooks/queries/useSessionTypeQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { ssrGetUser } from '../../../../../utils/api';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { getEvent } from '../../../../api/events/[eid]';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { getPages } from '../../../../api/events/[eid]/pages';
import { getRoles } from '../../../../api/events/[eid]/roles';
import { getSessionsByType, SessionWithVenue } from '../../../../api/events/[eid]/sessions';
import { getSessionType } from '../../../../api/events/[eid]/sessions/types/[tid]';

type Props = {
	initialSessionType: Prisma.EventSessionType | undefined;
	initialSessionsByType: SessionWithVenue[] | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
	initialOrganizer: boolean;
};

const ViewSessionTypePage: NextPage<Props> = (props) => {
	const {
		initialSessionType,
		initialEvent,
		initialRoles,
		initialUser,
		initialSessionsByType,
		initialPages,
		initialOrganizer
	} = props;
	const router = useRouter();
	const { tid, eid } = router.query;
	const { user, isUserLoading } = useUser(initialUser);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading } = useRolesQuery(String(eid), initialRoles);
	const { isSessionTypeLoading, sessionType } = useSessionTypeQuery(
		String(eid),
		String(tid),
		initialSessionType
	);
	const { sessionsByTypeData, isSessionsByTypeLoading } = useSessionsByTypeQuery(
		String(eid),
		String(tid),
		{ initialData: initialSessionsByType }
	);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialOrganizer);

	if (
		isSessionTypeLoading ||
		isRolesLoading ||
		isEventLoading ||
		isUserLoading ||
		isSessionsByTypeLoading ||
		isPagesLoading ||
		isOrganizerLoading
	) {
		return <LoadingPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!sessionType) {
		return <NotFoundPage message="Session Type not found." />;
	}

	if (!sessionsByTypeData) {
		return <NotFoundPage message="Sessions not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			<NextSeo
				title={`${sessionType.name} — ${event.name}`}
				description={`View all of the ${sessionType.name} sessions.`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/sessions/types/${sessionType.slug}`,
					title: `${sessionType.name} — ${event.name}`,
					description: `View all of the ${sessionType.name} sessions.`,
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
				<ViewSessionType
					sessionType={sessionType}
					eid={String(eid)}
					tid={String(tid)}
					sessions={sessionsByTypeData}
					event={event}
					user={user}
				/>
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, tid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialSessionType = (await getSessionType(String(eid), String(tid))) ?? undefined;
	const initialSessionsByType = (await getSessionsByType(String(eid), String(tid))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSessionsByType,
			initialEvent,
			initialRoles,
			initialSessionType,
			initialPages,
			initialOrganizer
		}
	};
};

export default ViewSessionTypePage;
