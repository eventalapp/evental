import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useAttendee } from '@eventalapp/shared/hooks';
import { capitalizeFirstLetter } from '@eventalapp/shared/utils';

import Tooltip from '../primitives/Tooltip';

type RoleMemberListItemProps = {
	userId: string;
	eid: string;
	removeRoleMember: (userId: string) => void;
};

export const RoleMemberListItem: React.FC<RoleMemberListItemProps> = (props) => {
	const { eid, userId, removeRoleMember } = props;

	const {
		data: attendee,
		isLoading: isAttendeeLoading,
		error: attendeeError
	} = useAttendee({ eid, uid: userId });

	if (isAttendeeLoading || !attendee || attendeeError) {
		return (
			<li className="relative flex h-full flex-col items-center justify-between">
				<Skeleton className="h-16 w-16 rounded-md" />
				<Skeleton className="h-4 w-14" />
				<Skeleton className="h-4 w-12" />
			</li>
		);
	}

	return (
		<li className="relative flex h-full flex-col items-center justify-between">
			<Link href={`/events/${eid}/admin/attendees/${attendee.user.slug}`}>
				<a className="flex h-full flex-col items-center justify-start">
					<div className="relative mb-1 h-16 w-16 rounded-md border border-gray-200 shadow-sm">
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
					<span className="text-center text-lg">{attendee.user.name}</span>
					<span className="block text-sm leading-none text-gray-700">
						{capitalizeFirstLetter(String(attendee.role.name).toLowerCase())}
					</span>
				</a>
			</Link>

			<div className="absolute -top-1 -right-1">
				<Tooltip side={'top'} message={`Remove this user from this session.`}>
					<button
						type="button"
						className="p-1"
						onClick={() => {
							removeRoleMember(userId);
						}}
					>
						<FontAwesomeIcon
							fill="currentColor"
							className="h-5 w-5 cursor-pointer text-gray-700 transition-colors duration-200 hover:text-red-500"
							size="lg"
							icon={faXmark}
						/>
					</button>
				</Tooltip>
			</div>
		</li>
	);
};
