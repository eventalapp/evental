import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../components/Footer';
import { IconLinkTooltip } from '../../../../../../components/IconLinkTooltip';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { SessionTypeList } from '../../../../../../components/sessions/SessionTypeList';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useSessionTypesQuery } from '../../../../../../hooks/queries/useSessionTypesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const SessionTypesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { event } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { isSessionTypesLoading, sessionTypes } = useSessionTypesQuery(String(eid));

	if (
		isSessionTypesLoading ||
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
				<title>Session Types</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<div>
					<FlexRowBetween>
						<h3 className="text-xl font-medium md:text-2xl">Session Types</h3>

						<IconLinkTooltip
							message="Click to create a session type"
							side="top"
							href={`/events/${eid}/admin/sessions/types/create`}
							icon={faSquarePlus}
							className="text-gray-700 hover:text-gray-600"
						/>
					</FlexRowBetween>

					{sessionTypes && <SessionTypeList eid={String(eid)} sessionTypes={sessionTypes} admin />}
				</div>
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export default SessionTypesAdminPage;
