import { capitalizeFirstLetter } from '../../utils/string';
import Image from 'next/image';
import React from 'react';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';
import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { FlexRowBetween } from '../layout/FlexRowBetween';

type Props = { eid: string; aid: string } & UseAttendeeQueryData & UseOrganizerQueryData;

export const ViewAttendee: React.FC<Props> = (props) => {
	const { eid, aid, attendee, isOrganizerLoading, isOrganizer } = props;

	if (!attendee) return null;

	return (
		<div>
			<div className="h-32 w-32 relative">
				<Image
					alt={String(attendee.name)}
					src={String(
						attendee?.image
							? `https://cdn.evental.app${attendee?.image}`
							: `https://cdn.evental.app/images/default-avatar.jpg`
					)}
					className="rounded-full"
					layout="fill"
				/>
			</div>

			<FlexRowBetween>
				<h1 className="text-3xl font-bold">{attendee.name}</h1>

				{!isOrganizerLoading && isOrganizer && (
					<div>
						<Link href={`/events/${eid}/admin/attendees/${aid}/edit`} passHref>
							<LinkButton className="mr-3">Edit Attendee</LinkButton>
						</Link>

						<Link href={`/events/${eid}/admin/attendees/${aid}/delete`} passHref>
							<LinkButton className="mr-3">Delete Attendee</LinkButton>
						</Link>
					</div>
				)}
			</FlexRowBetween>

			<p>{capitalizeFirstLetter(String(attendee.role.name).toLowerCase())}</p>
			<span className="text-md text-gray-700 block">{attendee.company}</span>
			<span className="text-md text-gray-700 block">{attendee.position}</span>
		</div>
	);
};
