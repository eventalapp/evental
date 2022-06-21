import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../components/Footer';
import { IconLinkTooltip } from '../../../../../components/IconLinkTooltip';
import { AttendeeList } from '../../../../../components/attendees/AttendeeList';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useAttendeesQuery } from '../../../../../hooks/queries/useAttendeesQuery';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const AttendeesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { attendeesData, isAttendeesLoading } = useAttendeesQuery(String(eid));
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (
		isAttendeesLoading ||
		isAttendeesLoading ||
		isUserLoading ||
		isOrganizerLoading ||
		isEventLoading ||
		isRolesLoading
	) {
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

	if (!attendeesData) {
		return <NotFoundPage message="Attendees not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Edit Attendees</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<div>
					<FlexRowBetween>
						<h3 className="text-xl font-medium md:text-2xl">
							Attendees{' '}
							<span className="font-normal text-gray-500">({attendeesData.length || 0})</span>
						</h3>

						<IconLinkTooltip
							message="Click to create an attendee"
							side="top"
							href={`/events/${eid}/admin/attendees/create`}
							icon={faSquarePlus}
							className="text-gray-700 hover:text-gray-600"
						/>
					</FlexRowBetween>

					<AttendeeList admin eid={String(eid)} attendees={attendeesData} tiny />
				</div>
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export default AttendeesAdminPage;
