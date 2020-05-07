import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
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
import { EventNavigation } from '../../../../components/events/navigation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { useAttendeeQuery } from '../../../../hooks/queries/useAttendeeQuery';
import { getEvent } from '../../../api/events/[eid]';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { getAttendee } from '../../../api/events/[eid]/attendees/[uid]';
import { getSessions } from '../../../api/events/[eid]/sessions';
import { getRoles } from '../../../api/events/[eid]/roles';
import Prisma from '@prisma/client';
import { EventHeader } from '../../../../components/events/EventHeader';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';

type Props = {
	initialAttendees: AttendeeWithUser[] | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
	initialOrganizer: boolean;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const {
		initialAttendees,
		initialIsAttendeeByUserId,
		initialEvent,
		initialOrganizer,
		initialUser,
		initialRoles
	} = props;
	const router = useRouter();
	const { uid, eid } = router.query;
	const { attendees, attendeesError, isAttendeesLoading } = useAttendeesQuery(
		String(eid),
		initialAttendees
	);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const {
		attendee: isAttendee,
		attendeeError,
		isAttendeeLoading
	} = useAttendeeQuery(String(eid), String(user?.id), initialIsAttendeeByUserId);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);

	if (
		isAttendeesLoading ||
		isRolesLoading ||
		isEventLoading ||
		isAttendeeLoading ||
		isOrganizerLoading
	) {
		return <LoadingPage />;
	}

	if (!attendees) {
		return <NotFoundPage message="No attendees not found." />;
	}

	if (attendeesError || attendeeError || eventError || rolesError) {
		return <ViewErrorPage errors={[attendeesError, attendeeError, eventError, rolesError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Attendee: {uid}</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} />

			<Column>
				{event && (
					<EventHeader
						event={event}
						eid={String(eid)}
						isOrganizer={isOrganizer}
						isAttendee={isAttendee}
					/>
				)}

				<h3 className="text-xl md:text-2xl font-medium">Attendees</h3>

				<AttendeeList attendees={attendees} eid={String(eid)} />
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialAttendees = (await getAttendees(String(eid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialSessions = (await getSessions(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialIsAttendeeByUserId =
		(await getAttendee(String(eid), String(initialUser?.id))) ?? undefined;

	return {
		props: {
			initialUser,
			initialAttendees,
			initialEvent,
			initialOrganizer,
			initialIsAttendeeByUserId,
			initialRoles,
			initialSessions
		}
	};
};

export default ViewAttendeePage;
