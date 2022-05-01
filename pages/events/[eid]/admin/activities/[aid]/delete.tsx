import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { DeleteActivityForm } from '../../../../../../components/activities/DeleteActivityForm';
import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';

import { useActivityQuery } from '../../../../../../hooks/queries/useActivityQuery';
import { useDeleteActivityMutation } from '../../../../../../hooks/mutations/useDeleteActivityMutation';
import { getActivity } from '../../../../../api/events/[eid]/activities/[aid]';
import type Prisma from '@prisma/client';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { PasswordlessUser, ssrGetUser } from '../../../../../../utils/api';
import { useUser } from '../../../../../../hooks/queries/useUser';

type Props = {
	initialOrganizer: boolean;
	initialActivity: Prisma.EventActivity | undefined;
	initialUser: PasswordlessUser | undefined;
};

const DeleteActivityPage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialActivity, initialUser } = props;
	const router = useRouter();
	const { eid, aid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { activity, isActivityLoading, activityError } = useActivityQuery(
		String(eid),
		String(aid),
		initialActivity
	);
	const { deleteActivityMutation } = useDeleteActivityMutation(String(eid), String(aid));
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialActivity || !activity) {
		return <NotFoundPage message="Activity not found" />;
	}

	if (isActivityLoading) {
		return <LoadingPage />;
	}

	if (activityError) {
		return <ViewErrorPage errors={[activityError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Activity</title>
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

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialActivity = (await getActivity(String(eid), String(aid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialActivity
		}
	};
};

export default DeleteActivityPage;
