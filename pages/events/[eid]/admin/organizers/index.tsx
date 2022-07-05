import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AttendeeList } from '../../../../../components/attendees/AttendeeList';
import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../components/layout/SidebarWrapper';
import InviteOrganizerDialog from '../../../../../components/organizer/InviteOrganizerDialog';
import { Heading } from '../../../../../components/primitives/Heading';
import { IconButtonTooltip } from '../../../../../components/primitives/IconButtonTooltip';
import { useOrganizersQuery } from '../../../../../hooks/queries/useOrganizersQuery';

const EventOrganizersPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizersLoading, organizers } = useOrganizersQuery(String(eid));

	return (
		<AdminPageWrapper isLoading={isOrganizersLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Organizers</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>Organizers</Heading>

							<InviteOrganizerDialog eid={String(eid)}>
								<IconButtonTooltip message="Invite an organizer" icon={faPaperPlane} color="gray" />
							</InviteOrganizerDialog>
						</FlexRowBetween>

						<AttendeeList attendees={organizers} eid={String(eid)} admin />
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EventOrganizersPage;
