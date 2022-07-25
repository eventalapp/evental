import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import * as Prisma from '@prisma/client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { SessionCategoryWithCount, SessionWithVenue, StrippedUser } from '@eventalapp/shared/utils';

import { FlexRowBetween } from '../layout/FlexRowBetween';
import { Heading } from '../primitives/Heading';
import { IconButtonTooltip } from '../primitives/IconButtonTooltip';
import { IconLinkTooltip } from '../primitives/IconLinkTooltip';
import { SessionList } from '../sessions/SessionList';
import DeleteSessionCategoryDialog from './DeleteSessionCategoryDialog';

type Props = {
	eid: string;
	cid: string;
	event?: Prisma.Event;
	sessionCategory?: SessionCategoryWithCount;
	sessions?: SessionWithVenue[];
	admin?: boolean;
	user?: StrippedUser | undefined;
};

export const ViewSessionCategory: React.FC<Props> = (props) => {
	const { sessionCategory, cid, eid, admin = false, sessions, event } = props;

	return (
		<div>
			<FlexRowBetween>
				<div className="flex flex-row items-center justify-between">
					{sessionCategory ? (
						<div
							className="mr-3 h-4 w-4 rounded-full"
							style={{ backgroundColor: sessionCategory.color ?? '#888888' }}
						/>
					) : (
						<Skeleton className="mr-3 h-4 w-4 rounded-full" />
					)}

					<div>
						<Heading>
							{sessionCategory ? sessionCategory.name : <Skeleton className="w-32" />}
						</Heading>
					</div>
				</div>

				{admin && (
					<div className="flex flex-row space-x-4">
						<IconLinkTooltip
							message="Edit this session category"
							href={`/events/${eid}/admin/sessions/categories/${cid}/edit`}
							icon={faPenToSquare}
							color="gray"
						/>

						<DeleteSessionCategoryDialog eid={String(eid)} cid={String(cid)}>
							<IconButtonTooltip
								icon={faTrashCan}
								message="Delete this session category"
								color="red"
							/>
						</DeleteSessionCategoryDialog>
					</div>
				)}
			</FlexRowBetween>

			<SessionList sessions={sessions} admin={admin} event={event} />
		</div>
	);
};
