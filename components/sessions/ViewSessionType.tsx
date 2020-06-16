import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Prisma from '@prisma/client';
import React from 'react';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { SessionList } from './SessionList';

type Props = {
	eid: string;
	tid: string;
	event: Prisma.Event;
	sessionType: Prisma.EventSessionType;
	sessions: SessionWithVenue[];
	admin?: boolean;
	user: PasswordlessUser | undefined;
};

export const ViewSessionType: React.FC<Props> = (props) => {
	const { sessionType, tid, eid, admin = false, sessions, event, user } = props;

	if (!sessionType) return null;

	return (
		<div>
			<FlexRowBetween>
				<div className="flex flex-row items-center justify-between">
					<div
						className="mr-3 h-4 w-4 rounded-full"
						style={{ backgroundColor: sessionType.color ?? '#888888' }}
					/>
					<div>
						<h3 className="text-xl font-medium md:text-2xl">{sessionType.name}</h3>
					</div>
				</div>

				{admin && (
					<div className="space-x-4">
						<IconLinkTooltip
							message="Click to edit this session type"
							side="top"
							href={`/events/${eid}/admin/sessions/types/${tid}/edit`}
							icon={faPenToSquare}
							className="text-gray-700"
						/>

						<IconLinkTooltip
							message="Click to delete this session type"
							side="top"
							href={`/events/${eid}/admin/sessions/types/${tid}/delete`}
							icon={faTrashCan}
							className="text-red-500"
						/>
					</div>
				)}
			</FlexRowBetween>

			{sessions && (
				<SessionList
					eid={String(eid)}
					sessions={sessions}
					admin={admin}
					event={event}
					user={user}
				/>
			)}
		</div>
	);
};
