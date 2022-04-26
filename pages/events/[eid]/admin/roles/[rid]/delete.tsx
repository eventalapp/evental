import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../../../components/BackButton';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { DeleteRoleForm } from '../../../../../../components/roles/DeleteRoleForm';
import { useRoleAttendeesQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useDeleteRoleMutation } from '../../../../../../hooks/mutations/useDeleteRoleMutation';
import React from 'react';

const DeleteRolePage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid, rid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roleAttendeesError, role, isRoleAttendeesLoading, attendees } = useRoleAttendeesQuery(
		String(eid),
		String(rid)
	);
	const { deleteRoleError, deleteRoleMutation } = useDeleteRoleMutation(String(eid), String(rid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<>
			<Head>
				<title>Delete Rid</title>
			</Head>

			<Navigation />

			<Column>
				<BackButton href={`/events/${eid}/admin`}>Admin Page</BackButton>

				<h1 className="text-3xl">Delete Role Page</h1>

				<DeleteRoleForm
					role={role}
					deleteRoleError={deleteRoleError}
					roleAttendeesError={roleAttendeesError}
					deleteRoleMutation={deleteRoleMutation}
					isRoleAttendeesLoading={isRoleAttendeesLoading}
					attendees={attendees}
				/>
			</Column>
		</>
	);
};

export default DeleteRolePage;
