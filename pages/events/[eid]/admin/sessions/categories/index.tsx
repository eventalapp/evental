import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../components/Footer';
import { IconLinkTooltip } from '../../../../../../components/IconLinkTooltip';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { SessionCategoryList } from '../../../../../../components/sessions/SessionCategoryList';
import { Heading } from '../../../../../../components/typography/Heading';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionCategoriesQuery } from '../../../../../../hooks/queries/useSessionCategoriesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const SessionCategoriesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer } = useIsOrganizerQuery(String(eid));
	const { user } = useUser();
	const { event, eventError } = useEventQuery(String(eid));
	const { sessionCategories } = useSessionCategoriesQuery(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Session Categories</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column>
				<div>
					<FlexRowBetween>
						<Heading>Session Categories</Heading>

						<IconLinkTooltip
							message="Click to create a session category"
							side="top"
							href={`/events/${eid}/admin/sessions/categories/create`}
							icon={faSquarePlus}
							className="text-gray-700 hover:text-gray-600"
						/>
					</FlexRowBetween>

					<SessionCategoryList eid={String(eid)} sessionCategories={sessionCategories} admin />
				</div>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default SessionCategoriesAdminPage;
