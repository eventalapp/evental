import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
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
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import { Session } from 'next-auth';
import { EventAttendeeUser, getAttendee } from '../../../../../api/events/[eid]/attendees/[aid]';

type Props = {
	initialOrganizer: boolean;
	initialAttendee: EventAttendeeUser | undefined;
	session: Session | null;
};

const EditAttendeePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialAttendee, session } = props;
	const router = useRouter();
	const { eid, aid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(
		String(eid),
		String(aid),
		initialAttendee
	);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { editAttendeeError, editAttendeeMutation } = useEditAttendeeMutation(
		String(eid),
		String(aid)
	);

	if (!session?.user?.id) {
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, aid } = context.query;

	const session = await getSession(context);
	const initialOrganizer = (await getIsOrganizer(session?.user.id, String(eid))) ?? undefined;
	const initialAttendee = (await getAttendee(String(eid), String(aid))) ?? undefined;

	return {
		props: {
			session,
			initialOrganizer,
			initialAttendee
		}
	};
};

export default EditAttendeePage;
