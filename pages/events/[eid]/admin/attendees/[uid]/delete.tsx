import type { NextPage } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';

import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { DeleteAttendeeForm } from '../../../../../../components/attendees/DeleteAttendeeForm';
import { useAttendeeQuery } from '../../../../../../hooks/queries/useAttendeeQuery';
import { useDeleteAttendeeMutation } from '../../../../../../hooks/mutations/useDeleteAttendeeMutatation';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { useUser } from '../../../../../../hooks/queries/useUser';

const DeleteAttendeePage: NextPage = () => {
	const router = useRouter();
	const { eid, uid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(String(eid), String(uid));
	const { deleteAttendeeMutation } = useDeleteAttendeeMutation(String(eid), String(uid));
	const { user, isUserLoading } = useUser();

	if (isOrganizerLoading || isAttendeeLoading || isUserLoading) {
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

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Attendee</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-medium">
					You are about to delete an attendee ("{attendee.user.name}")
				</p>

				<h1 className="text-3xl font-bold">Delete Attendee</h1>

				<DeleteAttendeeForm
					attendee={attendee}
					attendeeError={attendeeError}
					isAttendeeLoading={isAttendeeLoading}
					deleteAttendeeMutation={deleteAttendeeMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export default DeleteAttendeePage;
