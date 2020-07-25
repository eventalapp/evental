import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { useAttendeesByRole, useRole } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../../components/primitives/Heading';
import { EditRoleForm } from '../../../../../../components/roles/EditRoleForm';

const EditRolePage: NextPage = () => {
	const router = useRouter();
	const { eid, rid } = router.query;
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
			eid={String(eid)}
			isLoading={isAttendeesLoading || isRoleLoading}
		>
			<PageWrapper>
				<Head>
					<title>Edit Role</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading>Edit Role</Heading>

						{/*TODO: Skeletonize*/}

						{attendees && role && (
							<EditRoleForm eid={String(eid)} rid={String(rid)} role={role} attendees={attendees} />
						)}
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditRolePage;
