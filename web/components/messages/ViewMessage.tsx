import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import * as Prisma from '@prisma/client';
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { FlexRowBetween } from '../layout/FlexRowBetween';
import { Heading } from '../primitives/Heading';
import { IconButtonTooltip } from '../primitives/IconButtonTooltip';
import { IconLinkTooltip } from '../primitives/IconLinkTooltip';
import DeleteMessageDialog from './DeleteMessageDialog';

type Props = {
	eid: string;
	mid: string;
	message?: Prisma.EventMessage;
	admin?: boolean;
};

export const ViewMessage: React.FC<Props> = (props) => {
	const { message, mid, eid, admin = false } = props;

	return (
		<div>
			<FlexRowBetween>
				<div>
					<Heading className="mb-2">
						{message ? message.title : <Skeleton className="w-full max-w-2xl" />}
					</Heading>
					<span className="block text-sm text-gray-600">
						{message ? (
							`Sent ${dayjs(message.createdAt).fromNow()}
										${admin && message.recipientCount ? ` to ${message.recipientCount} recipients` : ''}`
						) : (
							<Skeleton className="w-52" />
						)}
					</span>
				</div>

				{admin && (
					<div className="flex flex-row space-x-4">
						<IconLinkTooltip
							message="Edit this message"
							href={`/events/${eid}/admin/messages/${mid}/edit`}
							icon={faPenToSquare}
							color="gray"
						/>

						<DeleteMessageDialog eid={String(eid)} mid={String(mid)}>
							<IconButtonTooltip message="Delete this message" icon={faTrashCan} color="red" />
						</DeleteMessageDialog>
					</div>
				)}
			</FlexRowBetween>

			{message ? (
				message.body && (
					<div className="prose mt-1 focus:outline-none prose-a:text-primary">
						{parse(String(message.body))}
					</div>
				)
			) : (
				<Skeleton className="mb-2 h-5 w-full" count={10} />
			)}
		</div>
	);
};
