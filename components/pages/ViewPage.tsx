import Prisma from '@prisma/client';
import { formatDistance } from 'date-fns';
import parse from 'html-react-parser';
import Link from 'next/link';
import React from 'react';

import { LinkButton } from '../form/LinkButton';
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
				<div className="space-x-4">
					{admin && (
						<Link href={`/events/${eid}/admin/pages/${pid}/edit`} passHref>
							<LinkButton className="ml-3">Edit page</LinkButton>
						</Link>
					)}
					{admin && (
						<Link href={`/events/${eid}/admin/pages/${pid}/delete`} passHref>
							<LinkButton className="ml-3">Delete page</LinkButton>
						</Link>
					)}
				</div>
			</FlexRowBetween>

			{page.body && (
				<div className="prose focus:outline-none prose-a:text-primary mt-1">
					{parse(String(page.body))}
				</div>
			)}
		</div>
	);
};
