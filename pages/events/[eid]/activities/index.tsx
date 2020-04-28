import type { NextPage } from 'next';
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

const ActivitiesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { activities, isActivitiesLoading, activitiesError } = useActivitiesQuery(String(eid));
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));

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
					<h1 className="text-3xl">Activities Page</h1>

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

export default ActivitiesPage;
