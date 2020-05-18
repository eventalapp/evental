import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { useUser } from '../../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useAttendeesQuery } from '../../../../../hooks/queries/useAttendeesQuery';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { AdminCreateAttendeeForm } from '../../../../../components/attendees/AdminCreateAttendeeForm';
import { useAdminCreateAttendeeMutation } from '../../../../../hooks/mutations/useAdminCreateAttendeeMutation';

const CreateAttendeePage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { adminCreateAttendeeMutation } = useAdminCreateAttendeeMutation(String(eid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { attendeesData, isAttendeesLoading } = useAttendeesQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (
		isOrganizerLoading ||
		isUserLoading ||
		isEventLoading ||
		isAttendeesLoading ||
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

	if (!event || !attendeesData) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Create Attendee</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<h3 className="text-xl md:text-2xl font-medium mb-2">Create Attendee Page</h3>

				<p className="mb-5 text-gray-600">
					Filling out the information below will create an placeholder account for this user. They
					will receive an email with instructions on how to claim their account.
				</p>

				<AdminCreateAttendeeForm
					eid={String(eid)}
					roles={roles}
					adminCreateAttendeeMutation={adminCreateAttendeeMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export default CreateAttendeePage;
