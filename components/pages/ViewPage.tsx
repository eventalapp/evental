import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import React from 'react';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import Prisma from '@prisma/client';
import parse from 'html-react-parser';

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
				<div className="flex items-center">
					<h1 className="text-2xl md:text-3xl font-medium">{page.name}</h1>
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
