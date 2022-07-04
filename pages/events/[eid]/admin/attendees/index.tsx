import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../components/AdminPageWrapper';
import { IconLinkTooltip } from '../../../../../components/IconLinkTooltip';
import { AttendeeList } from '../../../../../components/attendees/AttendeeList';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../components/typography/Heading';
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

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>Attendees</Heading>

							<IconLinkTooltip
								message="Create an attendee"
								side="top"
								href={`/events/${eid}/admin/attendees/create`}
								icon={faSquarePlus}
								className="text-gray-700 hover:text-gray-600"
							/>
						</FlexRowBetween>

						<AttendeeList admin eid={String(eid)} attendees={attendeesData} />
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default AttendeesAdminPage;
