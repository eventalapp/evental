import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../components/Footer';
import { IconLinkTooltip } from '../../../../../components/IconLinkTooltip';
import { AttendeeList } from '../../../../../components/attendees/AttendeeList';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/typography/Heading';
import { useAttendeesQuery } from '../../../../../hooks/queries/useAttendeesQuery';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const AttendeesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer } = useIsOrganizerQuery(String(eid));
	const { attendeesData } = useAttendeesQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));
	const { user } = useUser();

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Edit Attendees</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column>
				<div>
					<FlexRowBetween>
						<Heading>Attendees</Heading>

						<IconLinkTooltip
							message="Click to create an attendee"
							side="top"
							href={`/events/${eid}/admin/attendees/create`}
							icon={faSquarePlus}
							className="text-gray-700 hover:text-gray-600"
						/>
					</FlexRowBetween>

					<AttendeeList admin eid={String(eid)} attendees={attendeesData} />
				</div>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default AttendeesAdminPage;
