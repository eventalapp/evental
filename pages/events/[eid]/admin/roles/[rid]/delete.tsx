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

import { EventAttendeeUser } from '../../../../../api/events/[eid]/attendees/[aid]';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewNextkitErrorPage } from '../../../../../../components/error/ViewNextkitErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import user from '../../../../../api/auth/user';
import { PasswordlessUser } from '../../../../../../utils/api';

type Props = {
	initialOrganizer: boolean;
	initialRole: Prisma.EventRole | undefined;
	initialAttendees: EventAttendeeUser[] | undefined;
	user: PasswordlessUser | null;
};

const DeleteRolePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialRole, initialAttendees, user } = props;

	const router = useRouter();
	const { eid, rid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { roleAttendeesError, role, isRoleAttendeesLoading, attendees } = useRoleAttendeesQuery(
		String(eid),
		String(rid),
		{ attendees: initialAttendees, role: initialRole }
	);
	const { deleteRoleMutation } = useDeleteRoleMutation(String(eid), String(rid));

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
		return <ViewNextkitErrorPage errors={[roleAttendeesError]} />;
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
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-semibold">
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

	const session = await getSession(context);
	const initialOrganizer = (await getIsOrganizer(user.id, String(eid))) ?? undefined;
	const initialAttendees = (await getAttendeesByRole(String(eid), String(rid))) ?? undefined;
	const initialRole = (await getRole(String(eid), String(rid))) ?? undefined;

	return {
		props: {
			session,
			initialOrganizer,
			initialAttendees,
			initialRole
		}
	};
};

export default DeleteRolePage;
