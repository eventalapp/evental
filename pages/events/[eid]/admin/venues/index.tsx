import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../components/Footer';
import { IconLinkTooltip } from '../../../../../components/IconLinkTooltip';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/typography/Heading';
import { VenueList } from '../../../../../components/venues/VenueList';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { useVenuesQuery } from '../../../../../hooks/queries/useVenuesQuery';

const VenuesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isVenuesLoading || isUserLoading || isEventLoading || isOrganizerLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Edit Venues</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<div>
					<FlexRowBetween>
						<Heading>Venues</Heading>

						<IconLinkTooltip
							message="Click to create a venue"
							side="top"
							href={`/events/${eid}/admin/venues/create`}
							icon={faSquarePlus}
							className="text-gray-700 hover:text-gray-600"
						/>
					</FlexRowBetween>

					<VenueList
						admin
						eid={String(eid)}
						venues={venues}
						isVenuesLoading={isVenuesLoading}
						venuesError={venuesError}
					/>
				</div>
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export default VenuesAdminPage;
