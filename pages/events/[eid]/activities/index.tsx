import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ActivityList } from '../../../../components/activities/ActivityList';
import Column from '../../../../components/layout/Column';
import { LinkButton } from '../../../../components/form/LinkButton';
import { Navigation } from '../../../../components/navigation';
import { useActivitiesQuery } from '../../../../hooks/queries/useActivitiesQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { groupByDate } from '../../../../utils/groupByDate';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';

import { getIsOrganizer } from '../../../api/events/[eid]/organizer';

import type Prisma from '@prisma/client';
import { getActivities } from '../../../api/events/[eid]/activities';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewNextkitErrorPage } from '../../../../components/error/ViewNextkitErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import user from '../../../api/auth/user';
import { PasswordlessUser } from '../../../../utils/api';

type Props = {
	initialActivities: Prisma.EventActivity[] | undefined;
	initialOrganizer: boolean;
	user: PasswordlessUser | null;
};

const ActivitiesPage: NextPage<Props> = (props) => {
	const { initialActivities, initialOrganizer } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { activities, isActivitiesLoading, activitiesError } = useActivitiesQuery(
		String(eid),
		initialActivities
	);
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(
		String(eid),
		initialOrganizer
	);

	if (!initialActivities || !activities) {
		return <NotFoundPage message="No activities not found." />;
	}

	if (isActivitiesLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (activitiesError || isOrganizerError) {
		return <ViewNextkitErrorPage errors={[activitiesError, isOrganizerError]} />;
	}

	if (activities) {
		groupByDate(activities);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>All Activities</title>
			</Head>

			<Navigation />

			<Column>
				<FlexRowBetween>
					<h1 className="text-3xl font-bold">Activities</h1>

					{!isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/activities/create`} passHref>
							<LinkButton>Create Activity</LinkButton>
						</Link>
					)}
				</FlexRowBetween>

				<ActivityList
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizerError={isOrganizerError}
					activities={activities}
					eid={String(eid)}
					activitiesError={activitiesError}
					isActivitiesLoading={isActivitiesLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialActivities = (await getActivities(String(eid))) ?? undefined;
	const initialOrganizer = await getIsOrganizer(user.id, String(eid));

	return {
		props: {
			session,
			initialActivities,
			initialOrganizer
		}
	};
};

export default ActivitiesPage;
