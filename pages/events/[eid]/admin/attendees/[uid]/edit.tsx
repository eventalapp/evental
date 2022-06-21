import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const EditAttendeePage: NextPage = () => {
	const router = useRouter();
	const { eid, uid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
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
		<PageWrapper>
			<Head>
				<title>Edit Attendee</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<div className="mb-2">
					<h3 className="text-xl font-medium md:text-2xl">Edit Attendee</h3>
				</div>

				<p className="mt-1 mb-8 text-sm text-gray-600">
					This attendee profile will be visible on the event page. This profile is separate from the
					users profile. You cannot edit the users details such as company, description, image, etc.
					You may want to{' '}
					<Link href={`/events/${eid}/admin/attendees/create`}>
						<a className="text-gray-900 underline">create an attendee</a>
					</Link>{' '}
					if you're looking to change the users details.
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

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export default EditAttendeePage;
