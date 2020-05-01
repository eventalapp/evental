import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import React from 'react';
import { UseSessionQueryData } from '../../hooks/queries/useSessionQuery';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

type Props = {
	eid: string;
	sid: string;
} & UseSessionQueryData &
	UseOrganizerQueryData;

export const ViewSession: React.FC<Props> = (props) => {
	const { session, isOrganizerLoading, isOrganizer, sid, eid } = props;

	if (!session) return null;

	return (
		<div>
			<FlexRowBetween>
				<h1 className="text-3xl font-bold">{session.name}</h1>

				<div>
					{!isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/sessions/${sid}/edit`} passHref>
							<LinkButton className="mr-3">Edit session</LinkButton>
						</Link>
					)}
					{!isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/sessions/${sid}/delete`} passHref>
							<LinkButton className="mr-3">Delete session</LinkButton>
						</Link>
					)}
				</div>
			</FlexRowBetween>
			<p>{session.description}</p>
			<p>{session.endDate.toString()}</p>
			<div className="flex flex-row items-center mb-1">
				<FontAwesomeIcon
					fill="currentColor"
					className="w-5 h-5 mr-1.5"
					size="1x"
					icon={faLocationDot}
				/>
				<p>{session?.venueId}</p>
			</div>

			<div className="flex flex-row items-center">
				<FontAwesomeIcon
					fill="currentColor"
					className="w-5 h-5 mr-1.5"
					size="1x"
					icon={faCalendarDay}
				/>
				<p>
					{format(new Date(session.startDate), 'MMMM dd h:mm a')} -{' '}
					{format(new Date(session.endDate), 'MMMM dd h:mm a')}
				</p>
			</div>
		</div>
	);
};
