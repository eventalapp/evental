import type { GetServerSideProps, NextPage } from 'next';
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
import PageWrapper from '../../../components/layout/PageWrapper';
import Prisma from '@prisma/client';
import { getEvent } from '../../api/events/[eid]';
import { getIsOrganizer } from '../../api/events/[eid]/organizer';
import { getAttendeeByUserId } from '../../api/events/[eid]/attendees/user/[uid]';
import { getActivities } from '../../api/events/[eid]/activities';
import { EventAttendeeUser } from '../../api/events/[eid]/attendees/[aid]';
import { getRoles } from '../../api/events/[eid]/roles';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import React from 'react';
import { ViewErrorPage } from '../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { PasswordlessUser, ssrGetUser } from '../../../utils/api';
import { useUser } from '../../../hooks/queries/useUser';

type Props = {
	initialEvent: Prisma.Event | undefined;
	initialActivities: Prisma.EventActivity[] | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialIsAttendeeByUserId: EventAttendeeUser | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
};

const ViewEventPage: NextPage<Props> = (props) => {
	const {
		initialEvent,
		initialOrganizer,
		initialUser,
		initialRoles,
		initialActivities,
		initialIsAttendeeByUserId
	} = props;
	const router = useRouter();
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
	const { user } = useUser(initialUser);
	const { attendeeByUserId, attendeeByUserIdError, isAttendeeByUserIdLoading } =
		useAttendeeByUserIdQuery(String(eid), String(user?.id), initialIsAttendeeByUserId);

	if (isOrganizerError || rolesError || eventError || activitiesError || attendeeByUserIdError) {
		return (
			<ViewErrorPage
				errors={[isOrganizerError, rolesError, eventError, activitiesError, attendeeByUserIdError]}
			/>
		);
	}

	if (!initialRoles || !initialActivities || !initialEvent || !event || !activities || !roles) {
		return <NotFoundPage message="Event not found." />;
	}

	if (
		rolesError ||
		isEventLoading ||
		isOrganizerLoading ||
		isActivitiesLoading ||
		isRolesLoading ||
		isAttendeeByUserIdLoading
	) {
		return <LoadingPage />;
	}

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

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialActivities = (await getActivities(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialIsAttendeeByUserId =
		(await getAttendeeByUserId(String(eid), String(initialUser?.id))) ?? undefined;

	return {
		props: {
			initialEvent,
			initialUser,
			initialOrganizer,
			initialIsAttendeeByUserId,
			initialRoles,
			initialActivities
		}
	};
};

export default ViewEventPage;
