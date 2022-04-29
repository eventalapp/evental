import { capitalizeFirstLetter } from '../../utils/string';
import Image from 'next/image';
import React from 'react';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';
import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAddressBook,
	faAddressCard,
	faBuilding,
	faLocationDot
} from '@fortawesome/free-solid-svg-icons';

type Props = { eid: string; aid: string } & UseAttendeeQueryData & UseOrganizerQueryData;

export const ViewAttendee: React.FC<Props> = (props) => {
	const { eid, aid, attendee, isOrganizerLoading, isOrganizer } = props;

	if (!attendee) return null;

	return (
		<div>
			<FlexRowBetween>
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
			<h1 className="text-3xl font-bold">{attendee.name}</h1>

			<div className="flex flex-row items-center mb-1">
				<FontAwesomeIcon
					fill="currentColor"
					className="w-5 h-5 mr-1.5"
					size="1x"
					icon={faAddressCard}
				/>
				<p>{capitalizeFirstLetter(String(attendee.role.name))}</p>
			</div>

			<div className="flex flex-row items-center mb-1">
				<FontAwesomeIcon
					fill="currentColor"
					className="w-5 h-5 mr-1.5"
					size="1x"
					icon={faLocationDot}
				/>
				<p>{attendee.location}</p>
			</div>
			<div className="flex flex-row items-center mb-1">
				<FontAwesomeIcon
					fill="currentColor"
					className="w-5 h-5 mr-1.5"
					size="1x"
					icon={faBuilding}
				/>
				<p>{attendee.company}</p>
			</div>
			<div className="flex flex-row items-center mb-1">
				<FontAwesomeIcon
					fill="currentColor"
					className="w-5 h-5 mr-1.5"
					size="1x"
					icon={faAddressBook}
				/>
				<p>{attendee.position}</p>
			</div>
			<span className="text-md text-gray-700 block mt-3">{attendee.description}</span>
		</div>
	);
};
