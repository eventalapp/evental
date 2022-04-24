import type Prisma from '@prisma/client';
import Link from 'next/link';
import { LinkButton } from '../Form/LinkButton';
import React from 'react';
import { useOrganizerQuery } from '../../hooks/queries/useOrganizerQuery';

type Props = {
	eid: string;
	rid: string;
	loading: boolean;
	role: Prisma.EventRole | undefined;
};

export const ViewRole: React.FC<Props> = (props) => {
	const { eid, rid, loading, role } = props;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	if (loading) {
		return (
			<div>
				<p>Roles loading...</p>
			</div>
		);
	}

	return (
		<div>
			{loading ? (
				<p>Loading Venue...</p>
			) : (
				role && (
					<div>
						<div className="flex flex-row justify-between">
							<h1 className="text-3xl">{role.name}</h1>

							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/roles/${rid}/edit`} passHref>
									<LinkButton className="mr-3">Edit role</LinkButton>
								</Link>
							)}
						</div>

						<Link href={`/events/${eid}/attendees/${role.id}`} passHref>
							<LinkButton>View Role Members</LinkButton>
						</Link>
					</div>
				)
			)}
		</div>
	);
};
