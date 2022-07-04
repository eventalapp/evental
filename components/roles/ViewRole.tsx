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
import { IconButtonTooltip } from '../IconButtonTooltip';
import { IconLinkTooltip, iconLinkTooltipSkeleton } from '../IconLinkTooltip';
import { AttendeeList } from '../attendees/AttendeeList';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import DeleteRoleDialog from '../radix/components/DeleteRoleDialog';
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
								message={`Create a ${role.name}`}
								href={`/events/${eid}/admin/attendees/create`}
								icon={faSquarePlus}
								color="gray"
							/>
						) : (
							iconLinkTooltipSkeleton
						)}

						{role ? (
							<IconLinkTooltip
								message={`Invite a ${role.name}`}
								href={`/events/${eid}/admin/roles/${rid}/invite`}
								icon={faPaperPlane}
								color="gray"
							/>
						) : (
							iconLinkTooltipSkeleton
						)}

						{role ? (
							<IconLinkTooltip
								message={`Edit the ${role.name} role`}
								href={`/events/${eid}/admin/roles/${rid}/edit`}
								icon={faPenToSquare}
								color="gray"
							/>
						) : (
							iconLinkTooltipSkeleton
						)}

						{role ? (
							<DeleteRoleDialog eid={String(eid)} rid={String(rid)}>
								<IconButtonTooltip
									message={`Delete the ${role.name} role`}
									icon={faTrashCan}
									color="red"
								/>
							</DeleteRoleDialog>
						) : (
							iconLinkTooltipSkeleton
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
