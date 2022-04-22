import type Prisma from '@prisma/client';
import Link from 'next/link';
import React from 'react';

interface Props {
	loading: boolean;
	venues: Prisma.EventVenue[] | undefined;
	eid: string;
}

export const VenueList: React.FC<Props> = (props) => {
	const { eid, loading, venues } = props;

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
					<div key={venue.id} className="py-3 mt-3 border-t-2 border-gray-200">
						<Link href={`/events/${eid}/venues/${venue.slug}`}>
							<a>
								<span className="text-lg block">{venue.name}</span>
								<span className="text-md block">{venue.description}</span>
							</a>
						</Link>
					</div>
				))}
		</div>
	);
};
