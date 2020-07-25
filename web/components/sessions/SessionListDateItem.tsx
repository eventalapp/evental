import * as Prisma from '@prisma/client';
import dayjs from 'dayjs';
import React from 'react';

import { SessionWithVenue } from '@eventalapp/shared/utils';

import { SessionListHourItem } from './SessionListHourItem';

type SessionListDateItemProps = {
	date: string;
	sessionsByHour: Record<string, SessionWithVenue[]>;
	admin?: boolean;
	event: Prisma.Event;
};

export const SessionListDateItem: React.FC<SessionListDateItemProps> = (props) => {
	const { date, sessionsByHour, event, admin } = props;

	return (
		<div key={date}>
			<p className="inline-block pb-0.5 text-xl text-gray-700">
				<span className="font-medium text-gray-900">{dayjs(date).format('dddd')}</span>,{' '}
				{dayjs(date).format('MMMM D')}
			</p>
			{Object.entries(sessionsByHour).map(([hour, sessions]) => {
				return (
					<SessionListHourItem
						key={hour}
						sessions={sessions}
						admin={admin}
						event={event}
						hour={hour}
					/>
				);
			})}
		</div>
	);
};
