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
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import Prisma from '@prisma/client';
import { getVenue } from '../../../api/events/[eid]/venues/[vid]';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewNextkitErrorPage } from '../../../../components/error/ViewNextkitErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { PasswordlessUser } from '../../../../utils/api';

type Props = {
	initialVenue: Prisma.EventVenue | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
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

	if (!initialVenue || !venue) {
		return <NotFoundPage message="Venue not found." />;
	}

	if (isVenueLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (isOrganizerError || venueError) {
		return <ViewNextkitErrorPage errors={[isOrganizerError, venueError]} />;
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
	const initialOrganizer = await getIsOrganizer(user.id, String(eid));

	return {
		props: {
			session,
			initialVenue,
			initialOrganizer
		}
	};
};

export default ViewAttendeePage;
