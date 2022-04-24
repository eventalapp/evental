import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../../components/BackButton';
import Column from '../../../../../components/Column';
import { CreateRoleForm } from '../../../../../components/Roles/CreateRoleForm';
import { Navigation } from '../../../../../components/Navigation';
import NoAccess from '../../../../../components/NoAccess';
import Unauthorized from '../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useCreateRoleMutation } from '../../../../../hooks/mutations/useCreateRoleMutation';

const CreateRolePage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { createRoleMutation, createRoleError } = useCreateRoleMutation(String(eid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<>
			<Head>
				<title>Create Role</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<h1 className="text-3xl">Create Role Page</h1>

				<CreateRoleForm
					eid={String(eid)}
					createRoleError={createRoleError}
					createRoleMutation={createRoleMutation}
				/>
			</Column>
		</>
	);
};

export default CreateRolePage;