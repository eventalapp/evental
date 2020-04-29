import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { DeleteActivityForm } from '../../../../../../components/activities/DeleteActivityForm';
import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import { Session } from 'next-auth';
import { useActivityQuery } from '../../../../../../hooks/queries/useActivityQuery';
import { useDeleteActivityMutation } from '../../../../../../hooks/mutations/useDeleteActivityMutation';
import { getActivity } from '../../../../../api/events/[eid]/activities/[aid]';
import type Prisma from '@prisma/client';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewServerErrorPage } from '../../../../../../components/error/ViewServerErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';

type Props = {
	initialOrganizer: boolean;
	initialActivity: Prisma.EventActivity | undefined;
	session: Session | null;
};

const DeleteActivityPage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialActivity, session } = props;
	const router = useRouter();
	const { eid, aid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { activity, isActivityLoading, activityError } = useActivityQuery(
		String(eid),
		String(aid),
		initialActivity
	);
	const { deleteActivityMutation } = useDeleteActivityMutation(String(eid), String(aid));

	if (!session?.user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialActivity || !activity) {
		return <NotFoundPage />;
	}

	if (isActivityLoading) {
		return <LoadingPage />;
	}

	if (activityError) {
		return <ViewServerErrorPage errors={[activityError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete {activity.name}</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-semibold">
					You are about to delete an activity ("{activity.name}")
				</p>

				<h1 className="text-3xl font-bold">Delete Activity</h1>

				<DeleteActivityForm
					activity={activity}
					isActivityLoading={isActivityLoading}
					activityError={activityError}
					deleteActivityMutation={deleteActivityMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, aid } = context.query;

	const session = await getSession(context);
	const initialOrganizer = (await getIsOrganizer(session?.user.id, String(eid))) ?? undefined;
	const initialActivity = (await getActivity(String(eid), String(aid))) ?? undefined;

	return {
		props: {
			session,
			initialOrganizer,
			initialActivity
		}
	};
};

export default DeleteActivityPage;
