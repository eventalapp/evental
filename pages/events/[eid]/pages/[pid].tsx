import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
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

type Props = {
	initialPage: Prisma.EventPage | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialPage, initialRoles, initialUser, initialEvent, initialPages } = props;
	const { pid, eid } = router.query;
	const { page, isPageLoading, pageError } = usePageQuery(String(eid), String(pid), initialPage);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);

	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (isPageLoading || isEventLoading || isRolesLoading || isPagesLoading) {
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

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Page: {page && page.name}</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} pages={pages} />

			<Column>
				<ViewPage admin page={page} eid={String(eid)} pid={String(pid)} />
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

	return {
		props: {
			initialUser,
			initialPage,
			initialRoles,
			initialEvent,
			initialPages
		}
	};
};

export default ViewAttendeePage;
