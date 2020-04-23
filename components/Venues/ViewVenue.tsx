import type Prisma from '@prisma/client';
import React from 'react';
import { useOrganizerQuery } from '../../hooks/queries/useOrganizerQuery';
import Link from 'next/link';
import { LinkButton } from '../Form/LinkButton';

interface Props {
	eid: string;
	vid: string;
	loading: boolean;
	venue: Prisma.EventVenue | undefined;
}

export const ViewVenue: React.FC<Props> = (props) => {
	const { eid, vid, loading, venue } = props;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	if (loading) {
		return (
			<div>
				<p>Venue loading...</p>
			</div>
		);
	}

	return (
		<div>
			{loading ? (
				<p>Loading Venue...</p>
			) : (
				venue && (
					<div>
						<div className="flex flex-row justify-between">
							<h1 className="text-3xl">{venue.name}</h1>

							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/venues/${vid}/edit`} passHref>
									<LinkButton className="mr-3">Edit venue</LinkButton>
								</Link>
							)}
						</div>

						<p>{venue.description}</p>
					</div>
				)
			)}
		</div>
	);
};
