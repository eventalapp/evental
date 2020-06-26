import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../components/Footer';
import { DeleteAttendeeForm } from '../../../../../../components/attendees/DeleteAttendeeForm';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../../components/typography/Heading';
import { useAdminDeleteAttendeeMutation } from '../../../../../../hooks/mutations/useAdminDeleteAttendeeMutation';
import { useAttendeeQuery } from '../../../../../../hooks/queries/useAttendeeQuery';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const DeleteAttendeePage: NextPage = () => {
	const router = useRouter();
	const { eid, uid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(String(eid), String(uid));
	const { adminDeleteAttendeeMutation } = useAdminDeleteAttendeeMutation(String(eid), String(uid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (
		isOrganizerLoading ||
		isAttendeeLoading ||
		isUserLoading ||
		isEventLoading ||
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

	if (!attendee) {
		return <NotFoundPage message="Attendee not found" />;
	}

	if (attendeeError) {
		return <ViewErrorPage errors={[attendeeError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Delete Attendee</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<p className="mb-4 block rounded-md bg-red-500 py-3 px-5 font-medium text-white">
					You are about to delete an attendee ("{attendee.user.name}")
				</p>

				<Heading>Delete Attendee</Heading>

				<DeleteAttendeeForm
					attendee={attendee}
					attendeeError={attendeeError}
					isAttendeeLoading={isAttendeeLoading}
					adminDeleteAttendeeMutation={adminDeleteAttendeeMutation}
				/>
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export default DeleteAttendeePage;
