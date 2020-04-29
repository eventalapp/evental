import type { NextPage } from 'next';
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
import { useSession } from 'next-auth/react';
import PageWrapper from '../../../components/layout/PageWrapper';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { data: session } = useSession();

	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { activities, isActivitiesLoading, activitiesError } = useActivitiesQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { attendeeByUserId, attendeeByUserIdError, isAttendeeByUserIdLoading } =
		useAttendeeByUserIdQuery(String(eid), String(session?.user?.id));

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

export default ViewEventPage;
