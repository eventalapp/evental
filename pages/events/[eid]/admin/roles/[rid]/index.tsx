import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LinkButton } from '../../../../../../components/form/LinkButton';
import { capitalizeFirstLetter } from '../../../../../../utils/string';
import { useRoleAttendeesQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import Column from '../../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { FlexRowBetween } from '../../../../../../components/layout/FlexRowBetween';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import React from 'react';
import { AttendeeList } from '../../../../../../components/attendees/AttendeeList';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const { attendees, role, isRoleAttendeesLoading, roleAttendeesError } = useRoleAttendeesQuery(
		String(eid),
		String(rid)
	);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { user } = useUser();

	if (!role || !attendees) {
		return <NotFoundPage message="Role not found." />;
	}

	if (isOrganizerLoading || isRoleAttendeesLoading || isRolesLoading || isEventLoading) {
		return <LoadingPage />;
	}

	if (roleAttendeesError || eventError || rolesError) {
		return <ViewErrorPage errors={[roleAttendeesError, rolesError, eventError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Role</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<FlexRowBetween>
					<h2 className="text-2xl md:text-3xl font-bold leading-tight">
						{capitalizeFirstLetter(role.name.toLowerCase())}s{' '}
						<span className="font-normal text-gray-500">({attendees.length})</span>
					</h2>
					<div>
						<div className="flex items-center flex-row">
							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/roles/${rid}/edit`} passHref>
									<LinkButton>Edit role</LinkButton>
								</Link>
							)}
							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/roles/${rid}/delete`} passHref>
									<LinkButton className="ml-3">Delete role</LinkButton>
								</Link>
							)}
						</div>
					</div>
				</FlexRowBetween>

				{attendees?.length === 0 ? (
					<p>No {role.name.toLowerCase()}s found.</p>
				) : (
					<AttendeeList admin eid={String(eid)} attendees={attendees} />
				)}
			</Column>
		</PageWrapper>
	);
};

export default ViewAttendeePage;
