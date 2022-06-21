import Prisma from '@prisma/client';
import dayjs from 'dayjs';
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
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SessionList } from '../../../../../components/sessions/SessionList';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useSessionsByDateQuery } from '../../../../../hooks/queries/useSessionsByDateQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { ssrGetUser } from '../../../../../utils/api';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { getEvent } from '../../../../api/events/[eid]';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { getPages } from '../../../../api/events/[eid]/pages';
import { getRoles } from '../../../../api/events/[eid]/roles';
import { SessionWithVenue, getSessionsByDate } from '../../../../api/events/[eid]/sessions';

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
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialOrganizer);

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
		<PageWrapper>
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
				<FlexRowBetween>
					<h3 className="text-xl font-medium md:text-2xl">
						{dayjs(String(date)).startOf('day').tz(event.timeZone).format('MMMM D')}
					</h3>
				</FlexRowBetween>

				<SessionList sessions={sessionsByDateData} eid={String(eid)} event={event} user={user} />
			</Column>

			<Footer color={event.color} />
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
