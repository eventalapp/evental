import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../components/Footer';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { InviteRoleForm } from '../../../../../../components/roles/InviteRoleForm';
import { Heading } from '../../../../../../components/typography/Heading';
import { useInviteRoleMutation } from '../../../../../../hooks/mutations/useInviteRoleMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRoleQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const InviteRolePage: NextPage = () => {
	const router = useRouter();
	const { eid, rid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { inviteRoleMutation } = useInviteRoleMutation(String(eid), String(rid));
	const { role, isRoleLoading } = useRoleQuery(String(eid), String(rid));

	if (isEventLoading || isUserLoading || isOrganizerLoading || isRolesLoading || isRoleLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!role) {
		return <NotFoundPage message="Role not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Invite Role</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<FlexRowBetween>
					<Heading>Invite {role.name}</Heading>
				</FlexRowBetween>

				<p className="mb-2 text-base text-gray-700">
					Enter the users email that you wish to invite to the{' '}
					<span className="font-medium">"{role.name}"</span> role. They will receive an email with
					information on how to claim their role.
				</p>

				<InviteRoleForm inviteRoleMutation={inviteRoleMutation} />
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export default InviteRolePage;
