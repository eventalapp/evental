import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useAttendeesByRole, useRole } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewRole } from '../../../../../../components/roles/ViewRole';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const {
		data: role,
		error: roleError,
		isLoading: isRoleLoading
	} = useRole({ eid: String(eid), rid: String(rid) });
	const { data: attendees, isLoading: isAttendeesLoading } = useAttendeesByRole({
		eid: String(eid),
		rid: String(rid)
	});

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

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewRole attendees={attendees} eid={String(eid)} rid={String(rid)} role={role} admin />
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewAttendeePage;
