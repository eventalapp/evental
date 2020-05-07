import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import React from 'react';
import { useRoleAttendeesQuery } from '../../../../hooks/queries/useRoleAttendeesQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import Prisma from '@prisma/client';
import { getAttendeesByRole, getRole } from '../../../api/events/[eid]/roles/[rid]';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../utils/stripUserPassword';
import { EventNavigation } from '../../../../components/events/navigation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { getEvent } from '../../../api/events/[eid]';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { getRoles } from '../../../api/events/[eid]/roles';
import { EventHeader } from '../../../../components/events/EventHeader';
import { getAttendee } from '../../../api/events/[eid]/attendees/[uid]';
import { useAttendeeQuery } from '../../../../hooks/queries/useAttendeeQuery';
import { capitalizeFirstLetter } from '../../../../utils/string';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { AttendeeList } from '../../../../components/attendees/AttendeeList';

type Props = {
	initialRole: Prisma.EventRole | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialAttendees: AttendeeWithUser[] | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const {
		initialAttendees,
		initialOrganizer,
		initialRole,
		initialUser,
		initialEvent,
		initialRoles,
		initialIsAttendeeByUserId
	} = props;
	const router = useRouter();
	const { rid, eid } = router.query;
	const { attendees, role, isRoleAttendeesLoading, roleAttendeesError } = useRoleAttendeesQuery(
		String(eid),
		String(rid),
		{ attendees: initialAttendees, role: initialRole }
	);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const {
		attendee: isAttendee,
		attendeeError,
		isAttendeeLoading
	} = useAttendeeQuery(String(eid), String(user?.id), initialIsAttendeeByUserId);

	if (
		isOrganizerLoading ||
		isRoleAttendeesLoading ||
		isRolesLoading ||
		isEventLoading ||
		isAttendeeLoading
	) {
		return <LoadingPage />;
	}

	if (!initialAttendees || !initialRole || !role || !attendees) {
		return <NotFoundPage message="Role not found." />;
	}

	if (roleAttendeesError || eventError || rolesError || attendeeError) {
		return <ViewErrorPage errors={[roleAttendeesError, rolesError, eventError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Role</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} />

			<Column>
				{event && (
					<EventHeader
						adminLink={`/roles/${rid}`}
						event={event}
						eid={String(eid)}
						isOrganizer={isOrganizer}
						isAttendee={isAttendee}
					/>
				)}

				<FlexRowBetween>
					<h3 className="text-xl md:text-2xl font-medium">
						{capitalizeFirstLetter(role.name.toLowerCase())}s{' '}
						<span className="font-normal text-gray-500">({attendees.length || 0})</span>
					</h3>
				</FlexRowBetween>

				{attendees?.length === 0 ? (
					<p>No {role.name.toLowerCase()}s found.</p>
				) : (
					<AttendeeList eid={String(eid)} attendees={attendees} />
				)}
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, rid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialRole = (await getRole(String(eid), String(rid))) ?? undefined;
	const initialAttendees = (await getAttendeesByRole(String(eid), String(rid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialIsAttendeeByUserId =
		(await getAttendee(String(eid), String(initialUser?.id))) ?? undefined;

	return {
		props: {
			initialUser,
			initialRole,
			initialAttendees,
			initialOrganizer,
			initialEvent,
			initialRoles,
			initialIsAttendeeByUserId
		}
	};
};

export default ViewAttendeePage;
