import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
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
import { Session } from 'next-auth';
import { EventAttendeeUser, getAttendee } from '../../../../../api/events/[eid]/attendees/[aid]';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewServerErrorPage } from '../../../../../../components/error/ViewServerErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';

type Props = {
	initialOrganizer: boolean;
	initialAttendee: EventAttendeeUser | undefined;
	session: Session | null;
};

const DeleteAttendeePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialAttendee, session } = props;
	const router = useRouter();
	const { eid, aid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(
		String(eid),
		String(aid),
		initialAttendee
	);
	const { deleteAttendeeMutation } = useDeleteAttendeeMutation(String(eid), String(aid));

	if (!session?.user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialAttendee || !attendee) {
		return <NotFoundPage />;
	}

	if (isAttendeeLoading) {
		return <LoadingPage />;
	}

	if (attendeeError) {
		return <ViewServerErrorPage errors={[attendeeError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Attendee</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Delete Attendee Page</h1>

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

export default DeleteAttendeePage;
