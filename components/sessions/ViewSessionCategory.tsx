import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Prisma from '@prisma/client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { StrippedUser } from '../../utils/stripUser';
import { IconButtonTooltip } from '../IconButtonTooltip';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import DeleteSessionCategoryDialog from '../radix/components/DeleteSessionCategoryDialog';
import { Heading } from '../typography/Heading';
import { SessionList } from './SessionList';

type Props = {
	eid: string;
	cid: string;
	event?: Prisma.Event;
	sessionCategory?: Prisma.EventSessionCategory;
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
						<Skeleton className="w-4 h-4 rounded-full mr-3" />
					)}

					<div>
						<Heading>
							{sessionCategory ? sessionCategory.name : <Skeleton className={'w-full max-w-xl'} />}
						</Heading>
					</div>
				</div>

				{admin && (
					<div className="space-x-4 flex flex-row">
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
