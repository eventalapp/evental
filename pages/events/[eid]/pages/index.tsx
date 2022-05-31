import Prisma from '@prisma/client';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../components/Footer';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/navigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { PageList } from '../../../../components/pages/PageList';
import { useAttendeeQuery } from '../../../../hooks/queries/useAttendeeQuery';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { ssrGetUser } from '../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../utils/stripUserPassword';
import { getEvent } from '../../../api/events/[eid]';
import { getAttendee } from '../../../api/events/[eid]/attendees/[uid]';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { getPages } from '../../../api/events/[eid]/pages';
import { getRoles } from '../../../api/events/[eid]/roles';

type Props = {
	initialPages: Prisma.EventPage[] | undefined;
	initialEvent: Prisma.Event | undefined;
	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
};

const SessionsPage: NextPage<Props> = (props) => {
	const router = useRouter();
	const {
		initialPages,
		initialOrganizer,
		initialEvent,
		initialIsAttendeeByUserId,
		initialUser,
		initialRoles
	} = props;
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { pages, isPagesLoading, pagesError } = usePagesQuery(String(eid), {
		initialData: initialPages
	});
	const { event, isEventLoading } = useEventQuery(String(eid), initialEvent);
	const { user } = useUser(initialUser);
	const { attendee, isAttendeeLoading } = useAttendeeQuery(
		String(eid),
		String(user?.id),
		initialIsAttendeeByUserId
	);
	const { roles, isRolesLoading } = useRolesQuery(String(eid), initialRoles);

	if (
		isPagesLoading ||
		isOrganizerLoading ||
		isEventLoading ||
		isAttendeeLoading ||
		isRolesLoading
	) {
		return <LoadingPage />;
	}

	if (!pages) {
		return <NotFoundPage message="No pages found." />;
	}

	if (pagesError) {
		return <ViewErrorPage errors={[pagesError]} />;
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
				title={`Pages — ${event.name}`}
				description={`View all of the pages for ${event.name}.`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/pages`,
					title: `Pages — ${event.name}`,
					description: `View all of the pages for ${event.name}.`,
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
						adminLink={'/pages'}
						event={event}
						eid={String(eid)}
						isOrganizer={isOrganizer}
						isAttendee={attendee}
					/>
				)}

				<h3 className="text-xl md:text-2xl font-medium">Pages</h3>

				<PageList
					eid={String(eid)}
					pages={pages}
					isPagesLoading={isPagesLoading}
					pagesError={pagesError}
				/>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialIsAttendeeByUserId =
		(await getAttendee(String(eid), String(initialUser?.id))) ?? undefined;

	return {
		props: {
			initialUser,
			initialPages,
			initialEvent,
			initialOrganizer,
			initialRoles,
			initialIsAttendeeByUserId
		}
	};
};

export default SessionsPage;
