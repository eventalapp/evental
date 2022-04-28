import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../components/layout/Column';
import { ViewEvent } from '../../../components/events/ViewEvent';
import { Navigation } from '../../../components/navigation';
import { useActivitiesQuery } from '../../../hooks/queries/useActivitiesQuery';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../hooks/queries/useRolesQuery';
import { useAttendeeByUserIdQuery } from '../../../hooks/queries/useAttendeeByUserIdQuery';
import { getSession } from 'next-auth/react';
import PageWrapper from '../../../components/layout/PageWrapper';
import Prisma from '@prisma/client';
import { Session } from 'next-auth';
import { getEvent } from '../../api/events/[eid]';
import { getIsOrganizer } from '../../api/events/[eid]/organizer';
import { getActivities } from '../../api/events/[eid]/activities';
import { getRoles } from '../../api/events/[eid]/roles';
import {
	EventAttendeeUser,
	getAttendeeByUserId
} from '../../api/events/[eid]/attendees/user/[uid]';

type Props = {
	initialEvent: Prisma.Event | undefined;
	initialActivities: Prisma.EventActivity[] | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialIsAttendeeByUserId: EventAttendeeUser | undefined;
	initialOrganizer: boolean;
	session: Session | null;
};

const ViewEventPage: NextPage<Props> = (props) => {
	const router = useRouter();

	const {
		initialEvent,
		initialOrganizer,
		session,
		initialRoles,
		initialActivities,
		initialIsAttendeeByUserId
	} = props;

	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(
		String(eid),
		initialOrganizer
	);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { activities, isActivitiesLoading, activitiesError } = useActivitiesQuery(
		String(eid),
		initialActivities
	);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { attendeeByUserId, attendeeByUserIdError, isAttendeeByUserIdLoading } =
		useAttendeeByUserIdQuery(String(eid), String(session?.user?.id), initialIsAttendeeByUserId);

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>{event && event.name}</title>
			</Head>

			<Navigation />

			<Column>
				<ViewEvent
					eid={String(eid)}
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizerError={isOrganizerError}
					activities={activities}
					isActivitiesLoading={isActivitiesLoading}
					activitiesError={activitiesError}
					roles={roles}
					isRolesLoading={isRolesLoading}
					rolesError={rolesError}
					attendeeByUserId={attendeeByUserId}
					attendeeByUserIdError={attendeeByUserIdError}
					isAttendeeByUserIdLoading={isAttendeeByUserIdLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialActivities = (await getActivities(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialOrganizer = await getIsOrganizer(session, String(eid));
	const initialIsAttendeeByUserId =
		(await getAttendeeByUserId(String(eid), String(session?.user?.id))) ?? undefined;

	return {
		props: {
			initialEvent,
			session,
			initialOrganizer,
			initialIsAttendeeByUserId,
			initialRoles,
			initialActivities
		}
	};
};

export default ViewEventPage;
