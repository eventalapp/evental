import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewActivity } from '../../../../components/activities/ViewActivity';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import { useActivityQuery } from '../../../../hooks/queries/useActivityQuery';
import React from 'react';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getSession } from 'next-auth/react';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { Session } from 'next-auth';
import type Prisma from '@prisma/client';
import { getActivity } from '../../../api/events/[eid]/activities/[aid]';

type Props = {
	initialActivity: Prisma.EventActivity | undefined;
	initialOrganizer: boolean;
	session: Session | null;
};

const ViewActivityPage: NextPage<Props> = (props) => {
	const { initialActivity, initialOrganizer } = props;
	const router = useRouter();
	const { aid, eid } = router.query;
	const { activity, isActivityLoading, activityError } = useActivityQuery(
		String(eid),
		String(aid),
		initialActivity
	);
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(
		String(eid),
		initialOrganizer
	);

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Activity: {aid}</title>
			</Head>

			<Navigation />

			<Column>
				<ViewActivity
					activity={activity}
					isActivityLoading={isActivityLoading}
					activityError={activityError}
					isOrganizerError={isOrganizerError}
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					eid={String(eid)}
					aid={String(aid)}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { aid, eid } = context.query;

	const session = await getSession(context);
	const initialActivity = (await getActivity(String(eid), String(aid))) ?? undefined;
	const initialOrganizer = await getIsOrganizer(session?.user.id, String(eid));

	return {
		props: {
			session,
			initialActivity,
			initialOrganizer
		}
	};
};

export default ViewActivityPage;
