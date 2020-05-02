import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import { useAttendeesQuery } from '../../../../hooks/queries/useAttendeesQuery';
import { AttendeeList } from '../../../../components/attendees/AttendeeList';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getAttendees } from '../../../api/events/[eid]/attendees';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../utils/stripUserPassword';

type Props = {
	initialAttendees: AttendeeWithUser[] | undefined;
	initialUser: PasswordlessUser | undefined;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const { initialAttendees } = props;
	const router = useRouter();
	const { uid, eid } = router.query;
	const { attendees, attendeesError, isAttendeesLoading } = useAttendeesQuery(
		String(eid),
		initialAttendees
	);

	if (!initialAttendees || !attendees) {
		return <NotFoundPage message="No attendees not found." />;
	}

	if (isAttendeesLoading) {
		return <LoadingPage />;
	}

	if (attendeesError) {
		return <ViewErrorPage errors={[attendeesError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Attendee: {uid}</title>
			</Head>

			<Navigation />

			<Column>
				<div className="flex flex-row justify-between mb-3">
					<h1 className="text-3xl font-bold">Attendees</h1>
				</div>

				<AttendeeList
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

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialAttendees = (await getAttendees(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialAttendees
		}
	};
};

export default ViewAttendeePage;
