import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import Column from '../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import { useOrganizersQuery } from '../../../../../hooks/queries/useOrganizersQuery';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import { InviteOrganizerForm } from '../../../../../components/organizer/InviteOrganizerForm';
import { useInviteOrganizerMutation } from '../../../../../hooks/mutations/useInviteOrganizerMutation';

const EventOrganizersPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { isOrganizersLoading, organizers } = useOrganizersQuery(String(eid));
	const { inviteOrganizerMutation } = useInviteOrganizerMutation(String(eid));

	if (
		isEventLoading ||
		isUserLoading ||
		isOrganizerLoading ||
		isRolesLoading ||
		isOrganizersLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!organizers) {
		return <NotFoundPage message="Organizers not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Invite Organizer</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<FlexRowBetween>
					<h3 className="text-xl md:text-2xl font-medium">Invite Organizer</h3>
				</FlexRowBetween>

				<InviteOrganizerForm inviteOrganizerMutation={inviteOrganizerMutation} />
			</Column>
		</PageWrapper>
	);
};

export default EventOrganizersPage;
