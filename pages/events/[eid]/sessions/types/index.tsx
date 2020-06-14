import Prisma from '@prisma/client';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { EventNavigation } from '../../../../../components/events/navigation';
import { Footer } from '../../../../../components/Footer';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SessionTypeList } from '../../../../../components/sessions/SessionTypeList';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useSessionTypesQuery } from '../../../../../hooks/queries/useSessionTypesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { ssrGetUser } from '../../../../../utils/api';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { getEvent } from '../../../../api/events/[eid]';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { getPages } from '../../../../api/events/[eid]/pages';
import { getRoles } from '../../../../api/events/[eid]/roles';
import { getSessions } from '../../../../api/events/[eid]/sessions';
import { getSessionTypes } from '../../../../api/events/[eid]/sessions/types';

type Props = {
	initialSessionTypes: Prisma.EventSessionType[] | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
	initialOrganizer: boolean;
};

const SessionTypesPage: NextPage<Props> = (props) => {
	const {
		initialSessionTypes,
		initialEvent,
		initialRoles,
		initialUser,
		initialPages,
		initialOrganizer
	} = props;

	const router = useRouter();
	const { eid } = router.query;
	const { user, isUserLoading } = useUser(initialUser);
	const { event } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading } = useRolesQuery(String(eid), initialRoles);
	const { isSessionTypesLoading, sessionTypes } = useSessionTypesQuery(
		String(eid),
		initialSessionTypes
	);
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialOrganizer);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (
		isSessionTypesLoading ||
		isUserLoading ||
		isRolesLoading ||
		isPagesLoading ||
		isOrganizerLoading
	) {
		return <LoadingPage />;
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
				title={`Sessions Types — ${event.name}`}
				description={`View all of the sessions types for ${event.name}.`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/sessions/types`,
					title: `Session Types — ${event.name}`,
					description: `View all of the sessions types for ${event.name}.`,
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
				<div>
					<h3 className="text-xl md:text-2xl font-medium">Session Types</h3>

					{sessionTypes && <SessionTypeList eid={String(eid)} sessionTypes={sessionTypes} />}
				</div>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialSessions = (await getSessions(String(eid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialSessionTypes = (await getSessionTypes(String(eid))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSessions,
			initialPages,
			initialOrganizer,
			initialEvent,
			initialRoles,
			initialSessionTypes
		}
	};
};

export default SessionTypesPage;
