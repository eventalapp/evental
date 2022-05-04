import React from 'react';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { SessionList } from '../sessions/SessionList';
import { UseSessionsQueryData } from '../../hooks/queries/useSessionsQuery';

type Props = {
	eid: string;
} & UseOrganizerQueryData &
	UseSessionsQueryData;

export const ViewEvent: React.FC<Props> = (props) => {
	const { eid, sessions, isSessionsLoading, sessionsError } = props;

	return (
		<div>
			<SessionList
				sessions={sessions}
				eid={String(eid)}
				sessionsError={sessionsError}
				isSessionsLoading={isSessionsLoading}
			/>
		</div>
	);
};
