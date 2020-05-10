import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import React from 'react';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import Prisma from '@prisma/client';
import { SessionList } from './SessionList';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';

type Props = {
	eid: string;
	tid: string;
	event: Prisma.Event;
	sessionType: Prisma.EventSessionType;
	sessions: SessionWithVenue[];
	admin?: boolean;
};

export const ViewSessionType: React.FC<Props> = (props) => {
	const { sessionType, tid, eid, admin = false, sessions, event } = props;

	if (!sessionType) return null;

	return (
		<div>
			<FlexRowBetween>
				<div className="flex flex-row items-center justify-between">
					<div
						className="rounded-full mr-3 w-4 h-4"
						style={{ backgroundColor: sessionType.color ?? '#888888' }}
					/>
					<div>
						<h3 className="text-xl md:text-2xl font-medium">{sessionType.name}</h3>
					</div>
				</div>

				<div>
					{admin && (
						<Link href={`/events/${eid}/admin/sessions/types/${tid}/edit`} passHref>
							<LinkButton className="ml-3">Edit session type</LinkButton>
						</Link>
					)}
					{admin && (
						<Link href={`/events/${eid}/admin/sessions/types/${tid}/delete`} passHref>
							<LinkButton className="ml-3">Delete session type</LinkButton>
						</Link>
					)}
				</div>
			</FlexRowBetween>

			<h3 className="text-xl md:text-2xl font-medium mt-5">
				Sessions <span className="font-normal text-gray-500">({sessions?.length || 0})</span>
			</h3>

			{sessions && (
				<SessionList eid={String(eid)} sessions={sessions} admin={admin} event={event} />
			)}
		</div>
	);
};
