import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { DeleteRoleForm } from '../../../../../../components/roles/DeleteRoleForm';
import { useRoleAttendeesQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useDeleteRoleMutation } from '../../../../../../hooks/mutations/useDeleteRoleMutation';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import { getAttendeesByRole, getRole } from '../../../../../api/events/[eid]/roles/[rid]';
import Prisma from '@prisma/client';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../../../utils/api';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { AttendeeWithUser, PasswordlessUser } from '../../../../../../utils/stripUserPassword';

type Props = {
	initialOrganizer: boolean;
	initialRole: Prisma.EventRole | undefined;
	initialAttendees: AttendeeWithUser[] | undefined;
	initialUser: PasswordlessUser | undefined;
};

const DeleteRolePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialRole, initialAttendees, initialUser } = props;
	const router = useRouter();
	const { eid, rid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { roleAttendeesError, role, isRoleAttendeesLoading, attendees } = useRoleAttendeesQuery(
		String(eid),
		String(rid),
		{ attendees: initialAttendees, role: initialRole }
	);
	const { deleteRoleMutation } = useDeleteRoleMutation(String(eid), String(rid));
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialRole || !initialAttendees || !role || !attendees) {
		return <NotFoundPage message="Role not found." />;
	}

	if (roleAttendeesError) {
		return <ViewErrorPage errors={[roleAttendeesError]} />;
	}

	if (isRoleAttendeesLoading) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Role</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-medium">
					You are about to delete a role ("{role.name}")
				</p>

				<h1 className="text-3xl font-bold">Delete Role</h1>

				<DeleteRoleForm
					role={role}
					roleAttendeesError={roleAttendeesError}
					deleteRoleMutation={deleteRoleMutation}
					isRoleAttendeesLoading={isRoleAttendeesLoading}
					attendees={attendees}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, rid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialAttendees = (await getAttendeesByRole(String(eid), String(rid))) ?? undefined;
	const initialRole = (await getRole(String(eid), String(rid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialAttendees,
			initialRole
		}
	};
};

export default DeleteRolePage;
