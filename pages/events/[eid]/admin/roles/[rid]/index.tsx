import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../components/AdminPageWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewRole } from '../../../../../../components/roles/ViewRole';
import { SidebarWrapper } from '../../../../../../components/sidebar/SidebarWrapper';
import { useAttendeesByRoleQuery } from '../../../../../../hooks/queries/useAttendeesByRoleQuery';
import { useRoleQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const { role, roleError, isRoleLoading } = useRoleQuery(String(eid), String(rid));
	const { attendeesData, isAttendeesLoading } = useAttendeesByRoleQuery(String(eid), String(rid));

	return (
		<AdminPageWrapper
			errors={[roleError]}
			isLoading={isAttendeesLoading || isRoleLoading}
			eid={String(eid)}
		>
			<PageWrapper>
				<Head>
					<title>Viewing Role</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewRole
							attendees={attendeesData}
							eid={String(eid)}
							rid={String(rid)}
							role={role}
							admin
						/>
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewAttendeePage;
