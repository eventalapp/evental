import Prisma from '@prisma/client';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import { Footer } from '../../../../components/Footer';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/navigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { RoleList } from '../../../../components/roles/RoleList';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsAttendeeQuery } from '../../../../hooks/queries/useIsAttendeeQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { ssrGetUser } from '../../../../utils/api';
import { PasswordlessUser } from '../../../../utils/stripUserPassword';
import { getEvent } from '../../../api/events/[eid]';
import { getIsAttendee } from '../../../api/events/[eid]/attendee';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { getPages } from '../../../api/events/[eid]/pages';
import { getRoles } from '../../../api/events/[eid]/roles';

type Props = {
	initialRoles: Prisma.EventRole[] | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialIsAttendee: boolean;
	initialPages: Prisma.EventPage[] | undefined;
};

const RolesPage: NextPage<Props> = (props) => {
	const {
		initialRoles,
		initialOrganizer,
		initialEvent,
		initialUser,
		initialIsAttendee,
		initialPages
	} = props;
	const router = useRouter();
	const { eid } = router.query;

	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialOrganizer);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { user } = useUser(initialUser);
	const { isAttendee, isAttendeeLoading } = useIsAttendeeQuery(String(eid), initialIsAttendee);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (
		isOrganizerLoading ||
		isRolesLoading ||
		isEventLoading ||
		isAttendeeLoading ||
		isPagesLoading
	) {
		return <LoadingPage />;
	}

	if (!initialRoles || !roles) {
		return <NotFoundPage message="No roles found." />;
	}

	if (rolesError || eventError) {
		return <ViewErrorPage errors={[rolesError, eventError]} />;
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
				title={`Roles — ${event.name}`}
				description={`View all of the roles at ${event.name}.`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/roles`,
					title: `Roles — ${event.name}`,
					description: `View all of the roles at ${event.name}.`,
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
						adminLink={'/roles'}
						event={event}
						eid={String(eid)}
						isOrganizer={isOrganizer}
						isAttendee={isAttendee}
						user={user}
					/>
				)}

				<h3 className="text-xl font-medium md:text-2xl">Roles</h3>

				<RoleList
					eid={String(eid)}
					roles={roles}
					isRolesLoading={isRolesLoading}
					rolesError={rolesError}
				/>

				<Footer color={event.color} />
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialIsAttendee =
		(await getIsAttendee({ eid: String(eid), userId: String(initialUser?.id) })) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialRoles,
			initialOrganizer,
			initialEvent,
			initialIsAttendee,
			initialPages
		}
	};
};

export default RolesPage;
