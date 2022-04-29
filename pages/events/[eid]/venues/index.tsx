import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { LinkButton } from '../../../../components/form/LinkButton';
import { Navigation } from '../../../../components/navigation';
import { VenueList } from '../../../../components/venues/VenueList';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { ViewServerError } from '../../../../components/ViewServerError';
import React from 'react';
import { useVenuesQuery } from '../../../../hooks/queries/useVenuesQuery';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getSession } from 'next-auth/react';
import Prisma from '@prisma/client';
import { Session } from 'next-auth';
import { getVenues } from '../../../api/events/[eid]/venues';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { NotFoundPage } from '../../../../components/NotFoundPage';

type Props = {
	initialVenues: Prisma.EventVenue[] | undefined;
	initialOrganizer: boolean;
	session: Session | null;
};

const ActivitiesPage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialVenues, initialOrganizer } = props;
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(
		String(eid),
		initialOrganizer
	);
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid), initialVenues);

	if (!initialVenues) {
		return <NotFoundPage />;
	}

	if (isOrganizerError) {
		return (
			<PageWrapper variant="gray">
				<ViewServerError errors={[isOrganizerError]} />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>All Venues</title>
			</Head>

			<Navigation />

			<Column>
				<FlexRowBetween>
					<h1 className="text-3xl">Venues Page</h1>

					{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/venues/create`} passHref>
							<LinkButton>Create venue</LinkButton>
						</Link>
					)}
				</FlexRowBetween>

				<VenueList
					eid={String(eid)}
					venues={venues}
					isOrganizerError={isOrganizerError}
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					isVenuesLoading={isVenuesLoading}
					venuesError={venuesError}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialVenues = (await getVenues(String(eid))) ?? undefined;
	const initialOrganizer = await getIsOrganizer(session?.user.id, String(eid));

	return {
		props: {
			session,
			initialVenues,
			initialOrganizer
		}
	};
};

export default ActivitiesPage;
