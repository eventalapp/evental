import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { EditRoleForm } from '../../../../../../components/roles/EditRoleForm';
import { useRoleAttendeesQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useEditRoleMutation } from '../../../../../../hooks/mutations/useEditRoleMutation';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';

const EditRolePage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid, rid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roleAttendeesError, role, isRoleAttendeesLoading, attendees } = useRoleAttendeesQuery(
		String(eid),
		String(rid)
	);
	const { editRoleError, editRoleMutation } = useEditRoleMutation(String(eid), String(rid));

	if (!session.data?.user?.id) {
		return (
			<PageWrapper variant="gray">
				<Unauthorized />
			</PageWrapper>
		);
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return (
			<PageWrapper variant="gray">
				<NoAccess />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Rid</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Edit Role Page</h1>

				<EditRoleForm
					role={role}
					editRoleError={editRoleError}
					roleAttendeesError={roleAttendeesError}
					editRoleMutation={editRoleMutation}
					isRoleAttendeesLoading={isRoleAttendeesLoading}
					attendees={attendees}
				/>
			</Column>
		</PageWrapper>
	);
};

export default EditRolePage;
