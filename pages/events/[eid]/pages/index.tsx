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
import { PageList } from '../../../../components/pages/PageList';
import { Heading } from '../../../../components/typography/Heading';
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
	initialPages: Prisma.EventPage[] | undefined;
	initialEvent: Prisma.Event | undefined;
	initialIsAttendee: boolean;
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
		initialIsAttendee,
		initialUser,
		initialRoles
	} = props;
	const { eid } = router.query;

	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialOrganizer);
	const { pages, isPagesLoading, pagesError } = usePagesQuery(String(eid), {
		initialData: initialPages
	});
	const { event, isEventLoading } = useEventQuery(String(eid), initialEvent);
	const { user } = useUser(initialUser);
	const { isAttendee, isAttendeeLoading } = useIsAttendeeQuery(String(eid), initialIsAttendee);
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
		<PageWrapper>
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
						isAttendee={isAttendee}
						user={user}
					/>
				)}

				<Heading>Pages</Heading>

				<PageList
					eid={String(eid)}
					pages={pages}
					isPagesLoading={isPagesLoading}
					pagesError={pagesError}
				/>
			</Column>

			<Footer color={event.color} />
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
	const initialIsAttendee =
		(await getIsAttendee({ eid: String(eid), userId: String(initialUser?.id) })) ?? undefined;

	return {
		props: {
			initialUser,
			initialPages,
			initialEvent,
			initialOrganizer,
			initialRoles,
			initialIsAttendee
		}
	};
};

export default SessionsPage;
