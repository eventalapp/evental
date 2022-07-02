import {
	faPaperPlane,
	faPenToSquare,
	faSquarePlus,
	faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import Prisma from '@prisma/client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { capitalizeFirstLetter } from '../../utils/string';
import { AttendeeWithUser } from '../../utils/stripUser';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { AttendeeList } from '../attendees/AttendeeList';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { Heading } from '../typography/Heading';

type Props = {
	eid: string;
	rid: string;
	admin?: boolean;
	role?: Prisma.EventRole;
	attendees?: AttendeeWithUser[];
};

export const ViewRole: React.FC<Props> = (props) => {
	const { eid, rid, role, admin = false, attendees } = props;

	return (
		<div>
			<FlexRowBetween>
				<Heading>
					{role ? (
						`${capitalizeFirstLetter(role.name.toLowerCase())}s`
					) : (
						<Skeleton className="w-40 max-w-2xl" />
					)}
				</Heading>

				{admin && (
					<div className="space-x-4 flex flex-row">
						{role ? (
							<IconLinkTooltip
								message={`Click to create a ${role.name}`}
								side="top"
								href={`/events/${eid}/admin/attendees/create`}
								icon={faSquarePlus}
								className="text-gray-700 hover:text-gray-600"
							/>
						) : (
							<Skeleton className="h-5 w-5" />
						)}

						{role ? (
							<IconLinkTooltip
								message={`Click to invite a ${role.name}`}
								side="top"
								href={`/events/${eid}/admin/roles/${rid}/invite`}
								icon={faPaperPlane}
								className="text-gray-700 hover:text-gray-600"
							/>
						) : (
							<Skeleton className="h-5 w-5" />
						)}

						{role ? (
							<IconLinkTooltip
								message={`Click to edit the ${role.name} role`}
								side="top"
								href={`/events/${eid}/admin/roles/${rid}/edit`}
								icon={faPenToSquare}
								className="text-gray-700 hover:text-gray-600"
							/>
						) : (
							<Skeleton className="h-5 w-5" />
						)}

						{role ? (
							<IconLinkTooltip
								message={`Click to delete the ${role.name} role`}
								side="top"
								href={`/events/${eid}/admin/roles/${rid}/delete`}
								icon={faTrashCan}
								className="text-red-500 hover:text-red-400"
							/>
						) : (
							<Skeleton className="h-5 w-5" />
						)}
					</div>
				)}
			</FlexRowBetween>

			{role && attendees?.length === 0 ? (
				<p>No {role.name.toLowerCase()}s found.</p>
			) : (
				<AttendeeList admin={admin} eid={String(eid)} attendees={attendees} />
			)}
		</div>
	);
};
