import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import React from 'react';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import Prisma from '@prisma/client';

type Props = {
	eid: string;
	tid: string;
	sessionType: Prisma.EventSessionType;
	admin?: boolean;
};

export const ViewSessionType: React.FC<Props> = (props) => {
	const { sessionType, tid, eid, admin = false } = props;

	if (!sessionType) return null;

	return (
		<div>
			<FlexRowBetween>
				<h1 className="text-2xl md:text-3xl font-bold">{sessionType.name}</h1>

				<div>
					{admin && (
						<Link href={`/events/${eid}/admin/sessions/types/${tid}/edit`} passHref>
							<LinkButton className="ml-3">Edit session type</LinkButton>
						</Link>
					)}
					{admin && (
						<Link href={`/events/${eid}/admin/sessions/types/${tid}/delete`} passHref>
							<LinkButton className="ml-3">Delete session type</LinkButton>
						</Link>
					)}
				</div>
			</FlexRowBetween>

			<p>{sessionType.color}</p>
		</div>
	);
};
