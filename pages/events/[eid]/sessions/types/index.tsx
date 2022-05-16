import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useSessionTypesQuery } from '../../../../../hooks/queries/useSessionTypesQuery';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { SessionTypeList } from '../../../../../components/sessions/SessionTypeList';
import Column from '../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { EventNavigation } from '../../../../../components/events/navigation';
import { ssrGetUser } from '../../../../../utils/api';
import { getSessions } from '../../../../api/events/[eid]/sessions';
import { getEvent } from '../../../../api/events/[eid]';
import { getRoles } from '../../../../api/events/[eid]/roles';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';
import Prisma from '@prisma/client';
import { getSessionTypes } from '../../../../api/events/[eid]/sessions/types';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';
import { getPages } from '../../../../api/events/[eid]/pages';
import { NextSeo } from 'next-seo';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';

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

	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);

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
		<PageWrapper variant="gray">
			<NextSeo
				title={`Sessions Types — ${event.name}`}
				description={`View all of the sessions types for ${event.name}.`}
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
