import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import { Footer } from '../../../../../../components/Footer';
import { LinkButton } from '../../../../../../components/form/LinkButton';
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
						<h3 className="text-xl md:text-2xl font-medium">Session Types</h3>

						<div>
							<Link href={`/events/${eid}/admin/sessions/types/create`} passHref>
								<LinkButton padding="medium">Create</LinkButton>
							</Link>
						</div>
					</FlexRowBetween>

					{sessionTypes && <SessionTypeList eid={String(eid)} sessionTypes={sessionTypes} admin />}
				</div>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default SessionTypesAdminPage;
