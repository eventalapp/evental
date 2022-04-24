import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../components/Column';
import { Navigation } from '../../../components/Navigation';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { ViewEvent } from '../../../components/Events/ViewEvent';
import { useOrganizerQuery } from '../../../hooks/queries/useOrganizerQuery';
import { useActivitiesQuery } from '../../../hooks/queries/useActivitiesQuery';
import { useRolesQuery } from '../../../hooks/queries/useRolesQuery';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { activities, isActivitiesLoading, activitiesError } = useActivitiesQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));

	return (
		<div>
			<Head>
				<title>{event && event.location}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
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
				/>
			</Column>
		</div>
	);
};

export default ViewEventPage;
