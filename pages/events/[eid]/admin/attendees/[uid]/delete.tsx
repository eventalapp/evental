import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

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
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import { getAttendee } from '../../../../../api/events/[eid]/attendees/[uid]';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../../../utils/api';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { AttendeeWithUser, PasswordlessUser } from '../../../../../../utils/stripUserPassword';

type Props = {
	initialOrganizer: boolean;
	initialAttendee: AttendeeWithUser | undefined;
	initialUser: PasswordlessUser | undefined;
};

const DeleteAttendeePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialAttendee, initialUser } = props;
	const router = useRouter();
	const { eid, uid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(
		String(eid),
		String(uid),
		initialAttendee
	);
	const { deleteAttendeeMutation } = useDeleteAttendeeMutation(String(eid), String(uid));
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialAttendee || !attendee) {
		return <NotFoundPage message="Attendee not found" />;
	}

	if (isAttendeeLoading) {
		return <LoadingPage />;
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
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-semibold">
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, uid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialAttendee = (await getAttendee(String(eid), String(uid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialAttendee
		}
	};
};

export default DeleteAttendeePage;