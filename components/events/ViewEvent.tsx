import React from 'react';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { SessionList } from '../sessions/SessionList';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { UseSessionsQueryData } from '../../hooks/queries/useSessionsQuery';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';
import EventNavigationMenu from './EventNavigation';
import { EventHeader } from './EventHeader';

type Props = {
	eid: string;
} & UseOrganizerQueryData &
	UseEventQueryData &
	UseSessionsQueryData &
	UseRolesQueryData &
	UseAttendeeQueryData;

export const ViewEvent: React.FC<Props> = (props) => {
	const {
		eid,
		event,
		sessions,
		roles,
		isOrganizer,
		isOrganizerLoading,
		isSessionsLoading,
		sessionsError,
		attendee
	} = props;

	if (!event) return null;

	return (
		<div>
			{event && (
				<EventHeader
					event={event}
					eid={String(eid)}
					isOrganizer={isOrganizer}
					isAttendee={attendee}
				/>
			)}

			{roles && <EventNavigationMenu eid={String(eid)} roles={roles} />}

			<SessionList
				isOrganizer={isOrganizer}
				isOrganizerLoading={isOrganizerLoading}
				sessions={sessions}
				eid={String(eid)}
				sessionsError={sessionsError}
				isSessionsLoading={isSessionsLoading}
			/>
		</div>
	);
};
