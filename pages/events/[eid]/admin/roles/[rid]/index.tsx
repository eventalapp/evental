import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { AttendeeList } from '../../../../../../components/attendees/AttendeeList';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import { Footer } from '../../../../../../components/Footer';
import { LinkButton } from '../../../../../../components/form/LinkButton';
import Column from '../../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { useAttendeesByRoleQuery } from '../../../../../../hooks/queries/useAttendeesByRoleQuery';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRoleQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { capitalizeFirstLetter } from '../../../../../../utils/string';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const { role, roleError, isRoleLoading } = useRoleQuery(String(eid), String(rid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { user } = useUser();
	const { attendeesData, isAttendeesLoading } = useAttendeesByRoleQuery(String(eid), String(rid));

	if (
		isOrganizerLoading ||
		isRoleLoading ||
		isRolesLoading ||
		isEventLoading ||
		isAttendeesLoading
	) {
		return <LoadingPage />;
	}

	if (!role || !attendeesData) {
		return <NotFoundPage message="Role not found." />;
	}

	if (roleError || eventError || rolesError) {
		return <ViewErrorPage errors={[roleError, rolesError, eventError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Viewing Role</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<FlexRowBetween>
					<h3 className="text-xl md:text-2xl font-medium">
						{capitalizeFirstLetter(role.name.toLowerCase())}s{' '}
						<span className="font-normal text-gray-500">({attendeesData.length || 0})</span>
					</h3>

					<div>
						<div className="flex items-center flex-row space-x-3">
							<Link href={`/events/${eid}/admin/attendees/create`} passHref>
								<LinkButton>Create {role.name}</LinkButton>
							</Link>

							<Link href={`/events/${eid}/admin/roles/${rid}/invite`} passHref>
								<LinkButton>Invite {role.name}</LinkButton>
							</Link>

							<Link href={`/events/${eid}/admin/roles/${rid}/edit`} passHref>
								<LinkButton>Edit role</LinkButton>
							</Link>

							<Link href={`/events/${eid}/admin/roles/${rid}/delete`} passHref>
								<LinkButton>Delete role</LinkButton>
							</Link>
						</div>
					</div>
				</FlexRowBetween>

				{attendeesData?.length === 0 ? (
					<p>No {role.name.toLowerCase()}s found.</p>
				) : (
					<AttendeeList admin eid={String(eid)} attendees={attendeesData} />
				)}
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default ViewAttendeePage;
