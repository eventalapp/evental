import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../components/AdminPageWrapper';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { InviteOrganizerForm } from '../../../../../components/organizer/InviteOrganizerForm';
import { SidebarWrapper } from '../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../components/typography/Heading';
import { useInviteOrganizerMutation } from '../../../../../hooks/mutations/useInviteOrganizerMutation';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';

const EventOrganizersPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { inviteOrganizerMutation } = useInviteOrganizerMutation(String(eid));

	return (
		<AdminPageWrapper errors={[eventError]} eid={String(eid)} isLoading={isEventLoading}>
			<PageWrapper>
				<Head>
					<title>Invite Organizer</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>Invite Organizer</Heading>
						</FlexRowBetween>

						<p className="mb-2 text-base text-gray-700">
							Organizers are able to create, edit, and delete sessions, venues, and roles.
						</p>

						{/*TODO: Skeletonize*/}
						{event && (
							<InviteOrganizerForm
								event={event}
								inviteOrganizerMutation={inviteOrganizerMutation}
							/>
						)}
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EventOrganizersPage;
