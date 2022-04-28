import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { DeleteActivityForm } from '../../../../../../components/activities/DeleteActivityForm';
import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import { Session } from 'next-auth';
import { useActivityQuery } from '../../../../../../hooks/queries/useActivityQuery';
import { useDeleteActivityMutation } from '../../../../../../hooks/mutations/useDeleteActivityMutation';
import { getActivity } from '../../../../../api/events/[eid]/activities/[aid]';
import type Prisma from '@prisma/client';

type Props = {
	initialOrganizer: boolean;
	initialActivity: Prisma.EventActivity;
	session: Session | null;
};

const DeleteActivityPage: NextPage<Props> = (props) => {
	const { initialOrganizer, session } = props;
	const router = useRouter();
	const { eid, aid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { activity, isActivityLoading, activityError } = useActivityQuery(String(eid), String(aid));
	const { deleteActivityError, deleteActivityMutation } = useDeleteActivityMutation(
		String(eid),
		String(aid)
	);

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
				<title>Delete Activity</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Delete Activity Page</h1>

				<DeleteActivityForm
					activity={activity}
					isActivityLoading={isActivityLoading}
					activityError={activityError}
					deleteActivityError={deleteActivityError}
					deleteActivityMutation={deleteActivityMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, aid } = context.query;

	const session = await getSession(context);
	const initialOrganizer = await getIsOrganizer(session?.user.id, String(eid));
	const initialActivity = await getActivity(String(eid), String(aid));

	return {
		props: {
			session,
			initialOrganizer,
			initialActivity
		}
	};
};

export default DeleteActivityPage;
