import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { PasswordlessUser } from '../../../../utils/stripUserPassword';
import { LinkButton } from '../../../../components/form/LinkButton';
import { ssrGetUser } from '../../../../utils/api';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import Prisma from '@prisma/client';
import { useUser } from '../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { getVenues } from '../../../api/events/[eid]/venues';
import { Navigation } from '../../../../components/navigation';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { useVenuesQuery } from '../../../../hooks/queries/useVenuesQuery';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { VenueList } from '../../../../components/venues/VenueList';
import EventNavigationMenu from '../../../../components/radix/components/EventNavigationMenu';

type Props = {
	initialVenues: Prisma.EventVenue[] | undefined;
	initialUser: PasswordlessUser | undefined;
	initialOrganizer: boolean;
};

const VenuesAdminPage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialUser, initialVenues, initialOrganizer } = props;
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid), initialVenues);
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (isVenuesLoading) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Venues</title>
			</Head>

			<Navigation />

			<Column>
				<EventNavigationMenu eid={String(eid)} />

				<div>
					<FlexRowBetween>
						<span className="text-3xl font-bold">Venues</span>

						<div>
							<Link href={`/events/${eid}/admin/venues/create`} passHref>
								<LinkButton padding="medium">Create</LinkButton>
							</Link>
						</div>
					</FlexRowBetween>

					<VenueList
						eid={String(eid)}
						venues={venues}
						isVenuesLoading={isVenuesLoading}
						venuesError={venuesError}
					/>
				</div>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialVenues = (await getVenues(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialVenues
		}
	};
};

export default VenuesAdminPage;
