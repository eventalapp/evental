import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../../../components/BackButton';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { EditAttendeeForm } from '../../../../../../components/attendees/EditAttendeeForm';
import { useAttendeeQuery } from '../../../../../../hooks/queries/useAttendeeQuery';
import { useEditAttendeeMutation } from '../../../../../../hooks/mutations/useEditAttendeeMutation';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';

const EditAttendeePage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid, aid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(String(eid), String(aid));
	const { editAttendeeError, editAttendeeMutation } = useEditAttendeeMutation(
		String(eid),
		String(aid)
	);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<div>
			<Head>
				<title>Edit Attendee</title>
			</Head>

			<Navigation />

			<Column>
				<BackButton />

				<h1 className="text-3xl">Edit Attendee Page</h1>

				<EditAttendeeForm
					eid={String(eid)}
					attendee={attendee}
					isAttendeeLoading={isAttendeeLoading}
					attendeeError={attendeeError}
					editAttendeeError={editAttendeeError}
					editAttendeeMutation={editAttendeeMutation}
					roles={roles}
					isRolesLoading={isRolesLoading}
					rolesError={rolesError}
				/>
			</Column>
		</div>
	);
};

export default EditAttendeePage;
