import {
	faPaperPlane,
	faPenToSquare,
	faSquarePlus,
	faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import * as Prisma from '@prisma/client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { AttendeeWithUser, capitalizeFirstLetter } from '@eventalapp/shared/utils';

import { AttendeeList } from '../attendees/AttendeeList';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { Heading } from '../primitives/Heading';
import { IconButtonTooltip } from '../primitives/IconButtonTooltip';
import { IconLinkTooltip, iconLinkTooltipSkeleton } from '../primitives/IconLinkTooltip';
import DeleteRoleDialog from './DeleteRoleDialog';
import InviteRoleMemberDialog from './InviteRoleMemberDialog';

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
				<Heading variant="xl" level={2}>
					{role ? (
						`${capitalizeFirstLetter(role.name.toLowerCase())}s`
					) : (
						<Skeleton className="w-40 max-w-2xl" />
					)}
				</Heading>

				{admin && (
					<div className="flex flex-row space-x-4">
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
							<InviteRoleMemberDialog eid={String(eid)} rid={String(rid)}>
								<IconButtonTooltip
									message={`Invite a ${role.name}`}
									icon={faPaperPlane}
									color="gray"
								/>
							</InviteRoleMemberDialog>
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
