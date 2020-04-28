import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { EditAttendeeForm } from '../../../../../../components/attendees/EditAttendeeForm';
import { useAttendeeQuery } from '../../../../../../hooks/queries/useAttendeeQuery';
import { useEditAttendeeMutation } from '../../../../../../hooks/mutations/useEditAttendeeMutation';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';

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
		return (
			<PageWrapper variant="gray">
				<Unauthorized />
			</PageWrapper>
		);
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return (
			<PageWrapper variant="gray">
				<NoAccess />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Attendee</title>
			</Head>

			<Navigation />

			<Column>
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
		</PageWrapper>
	);
};

export default EditAttendeePage;
