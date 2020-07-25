import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useOrganizers } from '@eventalapp/shared/hooks';

import { AttendeeList } from '../../../../../components/attendees/AttendeeList';
import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import InviteOrganizerDialog from '../../../../../components/organizer/InviteOrganizerDialog';
import { Heading } from '../../../../../components/primitives/Heading';
import { IconButtonTooltip } from '../../../../../components/primitives/IconButtonTooltip';

const EventOrganizersPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isLoading: isOrganizersLoading, data: organizers } = useOrganizers({ eid: String(eid) });

	return (
		<AdminPageWrapper isLoading={isOrganizersLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Organizers</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>Organizers</Heading>

							<InviteOrganizerDialog eid={String(eid)}>
								<IconButtonTooltip message="Invite an organizer" icon={faPaperPlane} color="gray" />
							</InviteOrganizerDialog>
						</FlexRowBetween>

						<AttendeeList attendees={organizers} eid={String(eid)} admin />
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EventOrganizersPage;
