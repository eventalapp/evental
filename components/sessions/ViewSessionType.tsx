import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Prisma from '@prisma/client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { Heading } from '../typography/Heading';
import { SessionList } from './SessionList';

type Props = {
	eid: string;
	tid: string;
	event?: Prisma.Event;
	sessionType?: Prisma.EventSessionType;
	sessions?: SessionWithVenue[];
	admin?: boolean;
	user?: PasswordlessUser | undefined;
};

export const ViewSessionType: React.FC<Props> = (props) => {
	const { sessionType, tid, eid, admin = false, sessions, event } = props;

	return (
		<div>
			<FlexRowBetween>
				<div className="flex flex-row items-center justify-between">
					{sessionType ? (
						<div
							className="mr-3 h-4 w-4 rounded-full"
							style={{ backgroundColor: sessionType.color ?? '#888888' }}
						/>
					) : (
						<Skeleton className="w-4 h-4 rounded-full mr-3" />
					)}

					<div>
						<Heading>
							{sessionType ? sessionType.name : <Skeleton className={'w-full max-w-xl'} />}
						</Heading>
					</div>
				</div>

				{admin && (
					<div className="space-x-4">
						<IconLinkTooltip
							message="Click to edit this session type"
							side="top"
							href={`/events/${eid}/admin/sessions/types/${tid}/edit`}
							icon={faPenToSquare}
							className="text-gray-700 hover:text-gray-600"
						/>

						<IconLinkTooltip
							message="Click to delete this session type"
							side="top"
							href={`/events/${eid}/admin/sessions/types/${tid}/delete`}
							icon={faTrashCan}
							className="text-red-500 hover:text-red-400"
						/>
					</div>
				)}
			</FlexRowBetween>

			<SessionList sessions={sessions} admin={admin} event={event} />
		</div>
	);
};
