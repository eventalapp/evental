import {
	faAddressBook,
	faAddressCard,
	faArrowUpRightFromSquare,
	faBuilding,
	faLocationDot,
	faPenToSquare,
	faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import parse from 'html-react-parser';
import Image from 'next/image';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { capitalizeFirstLetter } from '../../utils/string';
import { AttendeeWithUser } from '../../utils/stripUserPassword';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { TooltipIcon, TooltipIconSkeleton } from "../TooltipIcon";
import { Heading } from '../typography/Heading';

type Props = { eid: string; uid: string; admin?: boolean; attendee?: AttendeeWithUser };

export const ViewAttendee: React.FC<Props> = (props) => {
	const { eid, uid, attendee, admin = false } = props;

	return (
		<div>
			<div className="relative mb-7 flex flex-row items-center">
				{admin && (
					<div className="absolute top-0 right-0 space-x-4">
						<IconLinkTooltip
							message="Click to edit this attendee"
							side="top"
							href={`/events/${eid}/admin/attendees/${uid}/edit`}
							icon={faPenToSquare}
							className="text-gray-700 hover:text-gray-600"
						/>

						<IconLinkTooltip
							message="Click to delete this attendee"
							side="top"
							href={`/events/${eid}/admin/attendees/${uid}/delete`}
							icon={faTrashCan}
							className="text-red-500 hover:text-red-400"
						/>
					</div>
				)}

				{attendee ? (
					<div className="relative mr-3 h-16 w-16 shrink-0 rounded-md border border-gray-200 shadow-sm md:mr-5 md:h-20 md:w-20">
						<Image
							alt={String(attendee.user.name)}
							src={String(
								attendee?.user.image
									? `https://cdn.evental.app${attendee?.user.image}`
									: `https://cdn.evental.app/images/default-avatar.jpg`
							)}
							className="rounded-md"
							layout="fill"
						/>
					</div>
				) : (
					<Skeleton className="mr-3 h-16 w-16 md:mr-5 md:h-20 md:w-20 rounded-md shrink-0" />
				)}

				<div>
					<Heading className="mb-1">
						{attendee ? attendee.user.name : <Skeleton className="max-w-2xl w-full" />}
					</Heading>

					<div className="flex flex-row flex-wrap items-center text-gray-600">
						{attendee ? (
							attendee.role.name && (
								<TooltipIcon
									icon={faAddressCard}
									tooltipMessage={`This user is attending as a ${attendee.role.name}`}
									label={capitalizeFirstLetter(String(attendee.role.name))}
								/>
							)
						) : (
							<TooltipIconSkeleton/>
						)}

						{attendee ? (
							attendee.user.location && (
								<TooltipIcon
									icon={faLocationDot}
									tooltipMessage={`This user is located in ${attendee.user.location}`}
									label={attendee.user.location}
								/>
							)
						) : (
							<TooltipIconSkeleton/>
						)}

						{attendee ? (
							attendee.user.company && (
								<TooltipIcon
									icon={faBuilding}
									tooltipMessage={`This user works for ${attendee.user.company}`}
									label={attendee.user.company}
								/>
							)
						) : (
							<TooltipIconSkeleton/>
						)}

						{attendee ? (
							attendee.user.position && (
								<TooltipIcon
									icon={faAddressBook}
									tooltipMessage={
										attendee.user.company
											? `This user works for ${attendee.user.company} as a ${attendee.user.position}`
											: `This user works as a ${attendee.user.position}`
									}
									label={attendee.user.position}
								/>
							)
						) : (
							<TooltipIconSkeleton/>
						)}

						{attendee ? (
							attendee.user.website && (
								<TooltipIcon
									icon={faArrowUpRightFromSquare}
									tooltipMessage={`This user's website link is ${attendee.user.website}`}
									label={attendee.user.website}
									externalLink={attendee.user.website}
								/>
							)
						) : (
							<TooltipIconSkeleton/>
						)}
					</div>
				</div>
			</div>

			{attendee ? (
				attendee.user.description && (
					<div className="prose focus:outline-none prose-a:text-primary">
						{parse(String(attendee.user.description))}
					</div>
				)
			) : (
				<Skeleton className="w-full" count={5} />
			)}
		</div>
	);
};
