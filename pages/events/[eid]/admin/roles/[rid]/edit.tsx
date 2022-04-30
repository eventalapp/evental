import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { EditRoleForm } from '../../../../../../components/roles/EditRoleForm';
import { useRoleAttendeesQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useEditRoleMutation } from '../../../../../../hooks/mutations/useEditRoleMutation';
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
	initialUser: PasswordlessUser | undefined;
};

const EditRolePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialRole, initialAttendees, user } = props;

	const router = useRouter();
	const { eid, rid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { roleAttendeesError, role, isRoleAttendeesLoading, attendees } = useRoleAttendeesQuery(
		String(eid),
		String(rid),
		{ role: initialRole, attendees: initialAttendees }
	);
	const { editRoleMutation } = useEditRoleMutation(String(eid), String(rid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialRole || !initialAttendees || !role || !attendees) {
		return <NotFoundPage message="Role not found." />;
	}

	if (isRoleAttendeesLoading) {
		return <LoadingPage />;
	}

	if (roleAttendeesError) {
		return <ViewNextkitErrorPage errors={[roleAttendeesError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Rid</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Edit Role</h1>

				<EditRoleForm
					eid={String(eid)}
					role={role}
					roleAttendeesError={roleAttendeesError}
					editRoleMutation={editRoleMutation}
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

export default EditRolePage;
