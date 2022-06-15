import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Prisma from '@prisma/client';
import { formatDistance } from 'date-fns';
import parse from 'html-react-parser';
import React from 'react';

import { IconLinkTooltip } from '../IconLinkTooltip';
import { FlexRowBetween } from '../layout/FlexRowBetween';

type Props = {
	eid: string;
	pid: string;
	page: Prisma.EventPage;
	admin?: boolean;
};

export const ViewPage: React.FC<Props> = (props) => {
	const { page, pid, eid, admin = false } = props;

	if (!page) return null;

	return (
		<div>
			<FlexRowBetween>
				<div>
					<h1 className="text-2xl md:text-3xl font-medium">{page.name}</h1>
					<span className="text-sm block text-gray-600">
						Updated {formatDistance(new Date(page.updatedAt), new Date(), { addSuffix: true })}
					</span>
				</div>

				{admin && (
					<div className="space-x-4">
						<IconLinkTooltip
							message="Click to edit this page"
							side="top"
							href={`/events/${eid}/admin/pages/${pid}/edit`}
							icon={faPenToSquare}
							className="text-gray-700"
						/>
						<IconLinkTooltip
							message="Click to delete this page"
							side="top"
							href={`/events/${eid}/admin/pages/${pid}/delete`}
							icon={faTrashCan}
							className="text-red-500"
						/>
					</div>
				)}
			</FlexRowBetween>

			{page.body && (
				<div className="prose focus:outline-none prose-a:text-primary mt-1">
					{parse(String(page.body))}
				</div>
			)}
		</div>
	);
};
