import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { usePageQuery } from '../../../../hooks/queries/usePageQuery';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import Prisma from '@prisma/client';
import { getPage } from '../../../api/events/[eid]/pages/[pid]';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { PasswordlessUser } from '../../../../utils/stripUserPassword';
import { ssrGetUser } from '../../../../utils/api';
import { EventNavigation } from '../../../../components/events/navigation';
import { getEvent } from '../../../api/events/[eid]';
import { getRoles } from '../../../api/events/[eid]/roles';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { ViewPage } from '../../../../components/pages/ViewPage';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { getPages } from '../../../api/events/[eid]/pages';
import { NextSeo } from 'next-seo';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';

type Props = {
	initialPage: Prisma.EventPage | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
	initialOrganizer: boolean;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialPage, initialRoles, initialUser, initialEvent, initialPages, initialOrganizer } =
		props;
	const { pid, eid } = router.query;
	const { page, isPageLoading, pageError } = usePageQuery(String(eid), String(pid), initialPage);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);

	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);

	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (isPageLoading || isEventLoading || isRolesLoading || isPagesLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (!page) {
		return <NotFoundPage message="Page not found." />;
	}

	if (pageError || eventError || rolesError) {
		return <ViewErrorPage errors={[pageError, eventError, rolesError]} />;
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
				title={`${page.name} — ${event.name}`}
				description={`View the ${page.name} page for ${event.name}.`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/pages/${page.slug}`,
					title: `${page.name} — ${event.name}`,
					description: `View the ${page.name} page for ${event.name}.`,
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
				<ViewPage page={page} eid={String(eid)} pid={String(pid)} />
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, pid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialPage = (await getPage(String(eid), String(pid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialPage,
			initialRoles,
			initialEvent,
			initialPages,
			initialOrganizer
		}
	};
};

export default ViewAttendeePage;
