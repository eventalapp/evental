import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { LinkButton } from '../../../../../components/form/LinkButton';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import { PageList } from '../../../../../components/pages/PageList';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';

const PagesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { pages, isPagesLoading, pagesError } = usePagesQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));

	if (
		isEventLoading ||
		isUserLoading ||
		isOrganizerLoading ||
		isOrganizerLoading ||
		isRolesLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Pages</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<div>
					<FlexRowBetween>
						<h3 className="text-xl md:text-2xl font-medium">Pages</h3>

						<div>
							<Link href={`/events/${eid}/admin/pages/create`} passHref>
								<LinkButton padding="medium">Create</LinkButton>
							</Link>
						</div>
					</FlexRowBetween>

					<PageList
						admin
						eid={String(eid)}
						pages={pages}
						isPagesLoading={isPagesLoading}
						pagesError={pagesError}
					/>
				</div>
			</Column>
		</PageWrapper>
	);
};

export default PagesAdminPage;