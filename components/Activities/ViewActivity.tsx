import type Prisma from '@prisma/client';
import Link from 'next/link';
import { LinkButton } from '../Form/LinkButton';
import { useOrganizerQuery } from '../../hooks/queries/useOrganizerQuery';
import React from 'react';

interface Props {
	loading: boolean;
	activity: Prisma.EventActivity | undefined;
	eid: string;
	aid: string;
}

export const ViewActivity: React.FC<Props> = (props) => {
	const { loading, activity, aid, eid } = props;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	if (loading) {
		return (
			<div>
				<p>Activities loading...</p>
			</div>
		);
	}

	return (
		<div>
			{activity && (
				<div>
					<div className="flex flex-row justify-between">
						<h1 className="text-3xl">{activity.name}</h1>

						{!isOrganizerLoading && isOrganizer && (
							<Link href={`/events/${eid}/admin/activities/${aid}/edit`} passHref>
								<LinkButton className="mr-3">Edit activity</LinkButton>
							</Link>
						)}
					</div>
					<p>{activity.description}</p>
					<p>{activity.startDate}</p>
					<p>{activity.endDate}</p>
				</div>
			)}
		</div>
	);
};
