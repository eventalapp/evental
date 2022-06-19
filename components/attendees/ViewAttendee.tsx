import {
	faAddressBook,
	faAddressCard,
	faArrowUpRightFromSquare,
	faBuilding,
	faLocationDot,
	faPenToSquare,
	faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';
import Image from 'next/image';
import React from 'react';

import { capitalizeFirstLetter } from '../../utils/string';
import { AttendeeWithUser } from '../../utils/stripUserPassword';
import { IconLinkTooltip } from '../IconLinkTooltip';
import Tooltip from '../radix/components/Tooltip';

type Props = { eid: string; uid: string; admin?: boolean; attendee: AttendeeWithUser };

export const ViewAttendee: React.FC<Props> = (props) => {
	const { eid, uid, attendee, admin = false } = props;

	if (!attendee) return null;

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

				<div>
					<h1 className="mb-1.5 max-w-lg text-2xl font-bold leading-[1.1] tracking-tight md:text-3xl">
						{attendee.user.name}
					</h1>

					<div className="flex flex-row flex-wrap items-center text-gray-600">
						{attendee.role.name && (
							<div className="mr-3">
								<Tooltip side={'top'} message={`This user is attending as a ${attendee.role.name}`}>
									<div className="mb-1 inline-flex cursor-help flex-row items-center">
										<FontAwesomeIcon
											fill="currentColor"
											className="mr-1.5 h-5 w-5"
											size="1x"
											icon={faAddressCard}
										/>
										<p>{capitalizeFirstLetter(String(attendee.role.name))}</p>
									</div>
								</Tooltip>
							</div>
						)}

						{attendee.user.location && (
							<div className="mr-3">
								<Tooltip side={'top'} message={`This user is located in ${attendee.user.location}`}>
									<div className="mb-1 inline-flex cursor-help flex-row items-center">
										<FontAwesomeIcon
											fill="currentColor"
											className="mr-1.5 h-5 w-5"
											size="1x"
											icon={faLocationDot}
										/>
										<p>{attendee.user.location}</p>
									</div>
								</Tooltip>
							</div>
						)}

						{attendee.user.company && (
							<div className="mr-3">
								<Tooltip side={'top'} message={`This user works for ${attendee.user.company}`}>
									<div className="mb-1 inline-flex cursor-help flex-row items-center">
										<FontAwesomeIcon
											fill="currentColor"
											className="mr-1.5 h-5 w-5"
											size="1x"
											icon={faBuilding}
										/>
										<p>{attendee.user.company}</p>
									</div>
								</Tooltip>
							</div>
						)}

						{attendee.user.position && (
							<div className="mr-3">
								<Tooltip
									side={'top'}
									message={
										attendee.user.company
											? `This user works for ${attendee.user.company} as a ${attendee.user.position}`
											: `This user works as a ${attendee.user.position}`
									}
								>
									<div className="mb-1 inline-flex cursor-help flex-row  items-center">
										<FontAwesomeIcon
											fill="currentColor"
											className="mr-1.5 h-5 w-5"
											size="1x"
											icon={faAddressBook}
										/>
										<p>{attendee.user.position}</p>
									</div>
								</Tooltip>
							</div>
						)}

						{attendee.user.website && (
							<div className="mr-3">
								<Tooltip
									side={'top'}
									message={`This user's website link is ${attendee.user.website}`}
								>
									<a href={attendee.user.website} target="_blank" rel="noopener noreferrer">
										<div className="mb-1 inline-flex flex-row items-center">
											<FontAwesomeIcon
												fill="currentColor"
												className="mr-1.5 h-5 w-5"
												size="1x"
												icon={faArrowUpRightFromSquare}
											/>
											<p>{attendee.user.website}</p>
										</div>
									</a>
								</Tooltip>
							</div>
						)}
					</div>
				</div>
			</div>

			{attendee.user.description && (
				<div className="prose focus:outline-none prose-a:text-primary">
					{parse(String(attendee.user.description))}
				</div>
			)}
		</div>
	);
};
