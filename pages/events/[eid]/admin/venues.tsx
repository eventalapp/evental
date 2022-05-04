import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { LinkButton } from '../../../../components/form/LinkButton';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { useUser } from '../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { Navigation } from '../../../../components/navigation';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { useVenuesQuery } from '../../../../hooks/queries/useVenuesQuery';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { VenueList } from '../../../../components/venues/VenueList';
import EventNavigationMenu from '../../../../components/radix/components/EventNavigationMenu';
import { EventSettingsHeader } from '../../../../components/settings/EventSettingsHeader';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';

const VenuesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));

	if (isVenuesLoading || isUserLoading || isEventLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Venues</title>
			</Head>

			<Navigation />

			<Column>
				{event && <EventSettingsHeader event={event} />}

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

export default VenuesAdminPage;
