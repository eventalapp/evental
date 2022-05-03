import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { CreateRoleForm } from '../../../../../components/roles/CreateRoleForm';
import { Navigation } from '../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useCreateRoleMutation } from '../../../../../hooks/mutations/useCreateRoleMutation';
import React from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';

import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { ssrGetUser } from '../../../../../utils/api';
import { useUser } from '../../../../../hooks/queries/useUser';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';

type Props = {
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
};

const CreateRolePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialUser } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { createRoleMutation } = useCreateRoleMutation(String(eid));
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Create Role</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<h1 className="text-3xl font-bold">Create Role Page</h1>

				<CreateRoleForm eid={String(eid)} createRoleMutation={createRoleMutation} />
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer
		}
	};
};

export default CreateRolePage;
