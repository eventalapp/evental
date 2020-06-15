import {
	faPaperPlane,
	faPenToSquare,
	faSquarePlus,
	faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import Prisma from '@prisma/client';
import React from 'react';
import { capitalizeFirstLetter } from '../../utils/string';
import { AttendeeWithUser } from '../../utils/stripUserPassword';
import { AttendeeList } from '../attendees/AttendeeList';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { FlexRowBetween } from '../layout/FlexRowBetween';

type Props = {
	eid: string;
	rid: string;
	admin?: boolean;
	role: Prisma.EventRole;
	attendees: AttendeeWithUser[];
};

export const ViewRole: React.FC<Props> = (props) => {
	const { eid, rid, role, admin = false, attendees } = props;

	if (!role) return null;

	return (
		<div>
			<FlexRowBetween>
				<h3 className="text-xl md:text-2xl font-medium">
					{capitalizeFirstLetter(role.name.toLowerCase())}s{' '}
					<span className="font-normal text-gray-500">({attendees.length || 0})</span>
				</h3>

				{admin && (
					<div className="space-x-4">
						<IconLinkTooltip
							message={`Click to create a ${role.name}`}
							side="top"
							href={`/events/${eid}/admin/attendees/create`}
							icon={faSquarePlus}
							className="text-gray-700"
						/>
						<IconLinkTooltip
							message={`Click to invite a ${role.name}`}
							side="top"
							href={`/events/${eid}/admin/roles/${rid}/invite`}
							icon={faPaperPlane}
							className="text-gray-700"
						/>
						<IconLinkTooltip
							message={`Click to edit the ${role.name} role`}
							side="top"
							href={`/events/${eid}/admin/roles/${rid}/edit`}
							icon={faPenToSquare}
							className="text-gray-700"
						/>
						<IconLinkTooltip
							message={`Click to delete the ${role.name} role`}
							side="top"
							href={`/events/${eid}/admin/roles/${rid}/delete`}
							icon={faTrashCan}
							className="text-red-500"
						/>
					</div>
				)}
			</FlexRowBetween>
			{attendees?.length === 0 ? (
				<p>No {role.name.toLowerCase()}s found.</p>
			) : (
				<AttendeeList admin={admin} eid={String(eid)} attendees={attendees} />
			)}
		</div>
	);
};
