import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { AdminPageWrapper } from '../../../../../../components/AdminPageWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { EditRoleForm } from '../../../../../../components/roles/EditRoleForm';
import { SidebarWrapper } from '../../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../../components/typography/Heading';
import { useAttendeesByRoleQuery } from '../../../../../../hooks/queries/useAttendeesByRoleQuery';
import { useRoleQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';

const EditRolePage: NextPage = () => {
	const router = useRouter();
	const { eid, rid } = router.query;
	const { roleError, role, isRoleLoading } = useRoleQuery(String(eid), String(rid));

	const { attendeesData, isAttendeesLoading } = useAttendeesByRoleQuery(String(eid), String(rid));

	return (
		<AdminPageWrapper
			errors={[roleError]}
			eid={String(eid)}
			isLoading={isAttendeesLoading || isRoleLoading}
		>
			<PageWrapper>
				<Head>
					<title>Edit Role</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading>Edit Role</Heading>

						{/*TODO: Skeletonize*/}

						{attendeesData && role && (
							<EditRoleForm
								eid={String(eid)}
								rid={String(rid)}
								role={role}
								attendees={attendeesData}
							/>
						)}
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditRolePage;
