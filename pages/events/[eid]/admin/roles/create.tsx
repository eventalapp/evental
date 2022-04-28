import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { CreateRoleForm } from '../../../../../components/roles/CreateRoleForm';
import { Navigation } from '../../../../../components/navigation';
import NoAccess from '../../../../../components/NoAccess';
import Unauthorized from '../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useCreateRoleMutation } from '../../../../../hooks/mutations/useCreateRoleMutation';
import React from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';

const CreateRolePage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { createRoleMutation, createRoleError } = useCreateRoleMutation(String(eid));

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
				<title>Create Role</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Create Role Page</h1>

				<CreateRoleForm createRoleError={createRoleError} createRoleMutation={createRoleMutation} />
			</Column>
		</PageWrapper>
	);
};

export default CreateRolePage;
