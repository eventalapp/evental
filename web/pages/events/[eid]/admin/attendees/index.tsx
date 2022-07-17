import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AttendeeList } from '../../../../../components/attendees/AttendeeList';
import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/primitives/Heading';
import { IconLinkTooltip } from '../../../../../components/primitives/IconLinkTooltip';
import { useAttendeesQuery } from '../../../../../hooks/queries/useAttendeesQuery';

const AttendeesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { attendeesData, isAttendeesLoading, attendeesError } = useAttendeesQuery(String(eid));

	return (
		<AdminPageWrapper errors={[attendeesError]} isLoading={isAttendeesLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Edit Attendees</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>Attendees</Heading>

							<IconLinkTooltip
								message="Create an attendee"
								href={`/events/${eid}/admin/attendees/create`}
								icon={faSquarePlus}
							/>
						</FlexRowBetween>

						<AttendeeList admin eid={String(eid)} attendees={attendeesData} />
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default AttendeesAdminPage;
