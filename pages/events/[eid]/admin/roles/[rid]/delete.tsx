import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { DeleteRoleForm } from '../../../../../../components/roles/DeleteRoleForm';
import { useRoleAttendeesQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useDeleteRoleMutation } from '../../../../../../hooks/mutations/useDeleteRoleMutation';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import { getAttendeesByRole, getRole } from '../../../../../api/events/[eid]/roles/[rid]';
import Prisma from '@prisma/client';
import { Session } from 'next-auth';
import { EventAttendeeUser } from '../../../../../api/events/[eid]/attendees/[aid]';

type Props = {
	initialOrganizer: boolean;
	initialRole: Prisma.EventRole;
	initialAttendees: EventAttendeeUser[];
	session: Session | null;
};

const DeleteRolePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialRole, initialAttendees, session } = props;

	const router = useRouter();
	const { eid, rid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { roleAttendeesError, role, isRoleAttendeesLoading, attendees } = useRoleAttendeesQuery(
		String(eid),
		String(rid),
		{ attendees: initialAttendees, role: initialRole }
	);
	const { deleteRoleError, deleteRoleMutation } = useDeleteRoleMutation(String(eid), String(rid));

	if (!session?.user?.id) {
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
				<title>Delete Rid</title>
			</Head>

			<Navigation />

			<Column>
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
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, rid } = context.query;

	const session = await getSession(context);
	const initialOrganizer = await getIsOrganizer(session?.user.id, String(eid));
	const initialAttendees = await getAttendeesByRole(String(eid), String(rid));
	const initialRole = await getRole(String(eid), String(rid));

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
