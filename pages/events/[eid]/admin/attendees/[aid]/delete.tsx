import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../../../components/BackButton';
import Column from '../../../../../../components/Column';

import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { DeleteAttendeeForm } from '../../../../../../components/attendees/DeleteAttendeeForm';
import { useAttendeeQuery } from '../../../../../../hooks/queries/useAttendeeQuery';
import { useDeleteAttendeeMutation } from '../../../../../../hooks/mutations/useDeleteAttendeeMutatation';

const DeleteAttendeePage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid, aid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(String(eid), String(aid));
	const { deleteAttendeeError, deleteAttendeeMutation } = useDeleteAttendeeMutation(
		String(eid),
		String(aid)
	);

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<div>
			<Head>
				<title>Delete Attendee</title>
			</Head>

			<Navigation />

			<Column>
				<BackButton />

				<h1 className="text-3xl">Delete Attendee Page</h1>

				<DeleteAttendeeForm
					attendee={attendee}
					attendeeError={attendeeError}
					isAttendeeLoading={isAttendeeLoading}
					deleteAttendeeError={deleteAttendeeError}
					deleteAttendeeMutation={deleteAttendeeMutation}
				/>
			</Column>
		</div>
	);
};

export default DeleteAttendeePage;
