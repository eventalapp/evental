import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import { useAttendeesQuery } from '../../../../hooks/queries/useAttendeesQuery';
import { AttendeeList } from '../../../../components/attendees/AttendeeList';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getSession } from 'next-auth/react';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { Session } from 'next-auth';
import { getAttendees } from '../../../api/events/[eid]/attendees';
import { EventAttendeeUser } from '../../../api/events/[eid]/attendees/[aid]';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewServerErrorPage } from '../../../../components/error/ViewServerErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';

type Props = {
	initialAttendees: EventAttendeeUser[] | undefined;
	initialOrganizer: boolean;
	session: Session | null;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const { initialAttendees, initialOrganizer } = props;
	const router = useRouter();
	const { aid, eid } = router.query;
	const { attendees, attendeesError, isAttendeesLoading } = useAttendeesQuery(
		String(eid),
		initialAttendees
	);
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(
		String(eid),
		initialOrganizer
	);

	if (!initialAttendees || !attendees) {
		return <NotFoundPage />;
	}

	if (isAttendeesLoading) {
		return <LoadingPage />;
	}

	if (attendeesError || isOrganizerError) {
		return <ViewServerErrorPage errors={[attendeesError, isOrganizerError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Attendee: {aid}</title>
			</Head>

			<Navigation />

			<Column>
				<div className="flex flex-row justify-between mb-3">
					<h1 className="text-3xl">Attendees</h1>
				</div>

				<AttendeeList
					isOrganizerError={isOrganizerError}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizer={isOrganizer}
					attendees={attendees}
					attendeesError={attendeesError}
					isAttendeesLoading={isAttendeesLoading}
					eid={String(eid)}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialAttendees = (await getAttendees(String(eid))) ?? undefined;
	const initialOrganizer = await getIsOrganizer(session?.user.id, String(eid));

	return {
		props: {
			session,
			initialAttendees,
			initialOrganizer
		}
	};
};

export default ViewAttendeePage;
