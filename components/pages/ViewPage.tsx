import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Prisma from '@prisma/client';
import { formatDistance } from 'date-fns';
import parse from 'html-react-parser';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { IconLinkTooltip } from '../IconLinkTooltip';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { Heading } from '../typography/Heading';

type Props = {
	eid: string;
	pid: string;
	page?: Prisma.EventPage;
	admin?: boolean;
};

export const ViewPage: React.FC<Props> = (props) => {
	const { page, pid, eid, admin = false } = props;

	return (
		<div>
			<FlexRowBetween>
				<div>
					<Heading className="mb-2">
						{page ? page.name : <Skeleton className="w-full max-w-2xl" />}
					</Heading>
					<span className="block text-sm text-gray-600">
						{page ? (
							`Updated ${formatDistance(new Date(page.updatedAt), new Date(), { addSuffix: true })}`
						) : (
							<Skeleton className="w-52" />
						)}
					</span>
				</div>

				{admin && (
					<div className="space-x-4 flex flex-row">
						<IconLinkTooltip
							message="Edit this page"
							href={`/events/${eid}/admin/pages/${pid}/edit`}
							icon={faPenToSquare}
							color="gray"
						/>
						<IconLinkTooltip
							message="Delete this page"
							href={`/events/${eid}/admin/pages/${pid}/delete`}
							icon={faTrashCan}
							color="red"
						/>
					</div>
				)}
			</FlexRowBetween>

			{page ? (
				page.body && (
					<div className="prose mt-1 focus:outline-none prose-a:text-primary">
						{parse(String(page.body))}
					</div>
				)
			) : (
				<Skeleton className="w-full mb-2 h-5" count={10} />
			)}
		</div>
	);
};
