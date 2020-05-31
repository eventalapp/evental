import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../../components/Footer';
import { AdminEditAttendeeForm } from '../../../../../../components/attendees/AdminEditAttendeeForm';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { useEditAttendeeMutation } from '../../../../../../hooks/mutations/useEditAttendeeMutation';
import { useImageUploadMutation } from '../../../../../../hooks/mutations/useImageUploadMutation';
import { useAttendeeQuery } from '../../../../../../hooks/queries/useAttendeeQuery';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const EditAttendeePage: NextPage = () => {
	const router = useRouter();
	const { eid, uid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(String(eid), String(uid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { adminEditAttendeeMutation } = useEditAttendeeMutation(String(eid), String(uid));
	const { imageUploadMutation, imageUploadResponse } = useImageUploadMutation();
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));

	if (
		isOrganizerLoading ||
		isEventLoading ||
		isAttendeeLoading ||
		isRolesLoading ||
		isUserLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!attendee) {
		return <NotFoundPage message="Attendee not found." />;
	}

	if (!roles) {
		return <NotFoundPage message="No roles not found." />;
	}

	if (attendeeError || rolesError) {
		return <ViewErrorPage errors={[attendeeError, rolesError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Attendee</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<h3 className="text-xl md:text-2xl font-medium">Edit Attendee</h3>

				<p className="text-gray-700 mt-1">
					This attendee profile will be visible on the event page. This profile is separate from
					your user profile.
				</p>

				<AdminEditAttendeeForm
					imageUploadMutation={imageUploadMutation}
					imageUploadResponse={imageUploadResponse}
					eid={String(eid)}
					attendee={attendee}
					isAttendeeLoading={isAttendeeLoading}
					attendeeError={attendeeError}
					adminEditAttendeeMutation={adminEditAttendeeMutation}
					roles={roles}
					isRolesLoading={isRolesLoading}
					rolesError={rolesError}
				/>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default EditAttendeePage;
