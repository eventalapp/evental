import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import { Footer } from '../../../../../components/Footer';
import { IconLinkTooltip } from '../../../../../components/IconLinkTooltip';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { PageList } from '../../../../../components/pages/PageList';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const PagesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
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
		<PageWrapper>
			<Head>
				<title>Edit Pages</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<div>
					<FlexRowBetween>
						<h3 className="text-xl md:text-2xl font-medium">Pages</h3>

						<IconLinkTooltip
							message="Click to create a page"
							side="top"
							href={`/events/${eid}/admin/pages/create`}
							icon={faSquarePlus}
							className="text-gray-700"
						/>
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

			<Footer />
		</PageWrapper>
	);
};

export default PagesAdminPage;
