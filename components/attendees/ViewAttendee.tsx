import { capitalizeFirstLetter } from '../../utils/string';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAddressBook,
	faAddressCard,
	faBuilding,
	faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { AttendeeWithUser } from '../../utils/stripUserPassword';

type Props = { eid: string; uid: string; admin?: boolean; attendee: AttendeeWithUser };

export const ViewAttendee: React.FC<Props> = (props) => {
	const { eid, uid, attendee, admin = false } = props;

	if (!attendee) return null;

	return (
		<div>
			<FlexRowBetween>
				<div className="h-32 w-32 relative">
					<Image
						alt={String(attendee.user.name)}
						src={String(
							attendee?.user.image
								? `https://cdn.evental.app${attendee?.user.image}`
								: `https://cdn.evental.app/images/default-avatar.jpg`
						)}
						className="rounded-full"
						layout="fill"
					/>
				</div>

				{admin && (
					<div>
						<Link href={`/events/${eid}/admin/attendees/${uid}/edit`} passHref>
							<LinkButton className="mr-3">Edit Attendee</LinkButton>
						</Link>

						<Link href={`/events/${eid}/admin/attendees/${uid}/delete`} passHref>
							<LinkButton className="mr-3">Delete Attendee</LinkButton>
						</Link>
					</div>
				)}
			</FlexRowBetween>

			<h1 className="text-2xl md:text-3xl font-bold">{attendee.user.name}</h1>

			{attendee.role.name && (
				<div className="flex flex-row items-center mb-1">
					<FontAwesomeIcon
						fill="currentColor"
						className="w-5 h-5 mr-1.5"
						size="1x"
						icon={faAddressCard}
					/>
					<p>{capitalizeFirstLetter(String(attendee.role.name))}</p>
				</div>
			)}

			{attendee.user.location && (
				<div className="flex flex-row items-center mb-1">
					<FontAwesomeIcon
						fill="currentColor"
						className="w-5 h-5 mr-1.5"
						size="1x"
						icon={faLocationDot}
					/>
					<p>{attendee.user.location}</p>
				</div>
			)}

			{attendee.user.company && (
				<div className="flex flex-row items-center mb-1">
					<FontAwesomeIcon
						fill="currentColor"
						className="w-5 h-5 mr-1.5"
						size="1x"
						icon={faBuilding}
					/>
					<p>{attendee.user.company}</p>
				</div>
			)}

			{attendee.user.position && (
				<div className="flex flex-row items-center mb-1">
					<FontAwesomeIcon
						fill="currentColor"
						className="w-5 h-5 mr-1.5"
						size="1x"
						icon={faAddressBook}
					/>
					<p>{attendee.user.position}</p>
				</div>
			)}

			<span className="text-base text-gray-700 block mt-3">{attendee.user.description}</span>
		</div>
	);
};
