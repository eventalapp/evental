import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewAttendee } from '../../../../components/attendees/ViewAttendee';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import { useAttendeeQuery } from '../../../../hooks/queries/useAttendeeQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { EventAttendeeUser, getAttendee } from '../../../api/events/[eid]/attendees/[aid]';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import React from 'react';
import { ViewNextkitErrorPage } from '../../../../components/error/ViewNextkitErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { PasswordlessUser } from '../../../../utils/api';

type Props = {
	initialAttendee: EventAttendeeUser | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const { initialAttendee, initialOrganizer } = props;
	const router = useRouter();
	const { aid, eid } = router.query;
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(
		String(eid),
		String(aid),
		initialAttendee
	);
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(
		String(eid),
		initialOrganizer
	);

	if (!initialAttendee) {
		return <NotFoundPage />;
	}

	if (isAttendeeLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (attendeeError || isOrganizerError) {
		return <ViewNextkitErrorPage errors={[attendeeError, isOrganizerError]} />;
	}

	if (!attendee || !attendee.user || !attendee.role) {
		return <NotFoundPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Attendee: {aid}</title>
			</Head>

			<Navigation />

			<Column>
				<ViewAttendee
					attendee={attendee}
					attendeeError={attendeeError}
					isAttendeeLoading={isAttendeeLoading}
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizerError={isOrganizerError}
					eid={String(eid)}
					aid={String(aid)}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { aid, eid } = context.query;

	const session = await getSession(context);
	const initialAttendee = (await getAttendee(String(eid), String(aid))) ?? undefined;
	const initialOrganizer = await getIsOrganizer(user.id, String(eid));

	return {
		props: {
			session,
			initialAttendee,
			initialOrganizer
		}
	};
};

export default ViewAttendeePage;
