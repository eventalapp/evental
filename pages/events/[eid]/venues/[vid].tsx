import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import { useVenueQuery } from '../../../../hooks/queries/useVenueQuery';
import { ViewVenue } from '../../../../components/venues/ViewVenue';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getSession } from 'next-auth/react';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import Prisma from '@prisma/client';
import { Session } from 'next-auth';
import { getVenue } from '../../../api/events/[eid]/venues/[vid]';
import { NotFoundPage } from '../../../../components/NotFoundPage';

type Props = {
	initialVenue: Prisma.EventVenue | undefined;
	initialOrganizer: boolean;
	session: Session | null;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialVenue, initialOrganizer } = props;
	const { vid, eid } = router.query;
	const { venue, isVenueLoading, venueError } = useVenueQuery(
		String(eid),
		String(vid),
		initialVenue
	);
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(
		String(eid),
		initialOrganizer
	);

	if (!initialVenue) {
		return <NotFoundPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Venue: {venue && venue.name}</title>
			</Head>

			<Navigation />

			<Column>
				<ViewVenue
					eid={String(eid)}
					vid={String(vid)}
					venue={venue}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizer={isOrganizer}
					isOrganizerError={isOrganizerError}
					isVenueLoading={isVenueLoading}
					venueError={venueError}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, vid } = context.query;

	const session = await getSession(context);
	const initialVenue = (await getVenue(String(eid), String(vid))) ?? undefined;
	const initialOrganizer = await getIsOrganizer(session?.user.id, String(eid));

	return {
		props: {
			session,
			initialVenue,
			initialOrganizer
		}
	};
};

export default ViewAttendeePage;
