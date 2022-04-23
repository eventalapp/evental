import type Prisma from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import { LinkButton } from '../Form/LinkButton';
import { useOrganizerQuery } from '../../hooks/queries/useOrganizerQuery';

interface Props {
	loading: boolean;
	venues: Prisma.EventVenue[] | undefined;
	eid: string;
}

export const VenueList: React.FC<Props> = (props) => {
	const { eid, loading, venues } = props;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	if (loading) {
		return (
			<div>
				<p>Venues loading...</p>
			</div>
		);
	}

	if (venues?.length === 0) {
		return (
			<div>
				<p>No venues found.</p>
			</div>
		);
	}

	return (
		<div>
			{venues &&
				venues.map((venue) => (
					<div key={venue.id} className="py-2 border-t-2 border-gray-200">
						<Link href={`/events/${eid}/venues/${venue.slug}`}>
							<a className="flex flex-row justify-between items-center">
								<div>
									<span className="text-lg block">{venue.name}</span>
									<span className="text-md block">{venue.description}</span>
								</div>
								{!isOrganizerLoading && isOrganizer && (
									<div>
										<Link href={`/events/${eid}/venues/${venue.slug}`} passHref>
											<LinkButton variant={'secondary'} className="mr-3">
												View
											</LinkButton>
										</Link>
										<Link href={`/events/${eid}/admin/venues/${venue.slug}/edit`} passHref>
											<LinkButton variant={'secondary'}>Edit</LinkButton>
										</Link>
									</div>
								)}
							</a>
						</Link>
					</div>
				))}
		</div>
	);
};
