import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LinkButton } from '../../../../../../components/form/LinkButton';
import { capitalizeFirstLetter } from '../../../../../../utils/string';
import { useRoleQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
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
import React, { useState } from 'react';
import { AttendeeList } from '../../../../../../components/attendees/AttendeeList';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { useAttendeesByRoleQuery } from '../../../../../../hooks/queries/useAttendeesByRoleQuery';
import { Pagination } from '../../../../../../components/Pagination';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const [page, setPage] = useState(1);
	const { role, roleError, isRoleLoading } = useRoleQuery(String(eid), String(rid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { user } = useUser();
	const { attendeesData, isAttendeesLoading } = useAttendeesByRoleQuery(String(eid), String(rid), {
		page
	});

	if (
		isOrganizerLoading ||
		isRoleLoading ||
		isRolesLoading ||
		isEventLoading ||
		isAttendeesLoading
	) {
		return <LoadingPage />;
	}

	if (!role || !attendeesData?.attendees) {
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
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Role</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<FlexRowBetween>
					<h3 className="text-xl md:text-2xl font-medium">
						{capitalizeFirstLetter(role.name.toLowerCase())}s{' '}
						{attendeesData?.pagination?.total > 0 && (
							<span className="font-normal text-gray-500">
								({attendeesData?.pagination?.from || 0}/{attendeesData?.pagination?.total || 0})
							</span>
						)}
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

				{attendeesData?.attendees?.length === 0 ? (
					<p>No {role.name.toLowerCase()}s found.</p>
				) : (
					<AttendeeList admin eid={String(eid)} attendees={attendeesData?.attendees} />
				)}

				{attendeesData.pagination.pageCount > 1 && (
					<Pagination
						page={page}
						pageCount={attendeesData.pagination.pageCount}
						setPage={setPage}
					/>
				)}
			</Column>
		</PageWrapper>
	);
};

export default ViewAttendeePage;
