import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ActivityList } from '../../../../components/Activities/ActivityList';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { LinkButton } from '../../../../components/Form/LinkButton';
import { Navigation } from '../../../../components/Navigation';
import { useActivitiesQuery } from '../../../../hooks/useActivitiesQuery';
import { useOrganizerQuery } from '../../../../hooks/useOrganizerQuery';
import { groupByDate } from '../../../../utils/groupByDate';

const ActivitiesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { activities, isActivitiesLoading } = useActivitiesQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	if (activities) {
		groupByDate(activities);
	}

	return (
		<>
			<Head>
				<title>All Activities</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<div className="flex flex-row justify-between">
					<h1 className="text-3xl">Activities Page</h1>
					{!isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/activities/create`} passHref>
							<LinkButton>Create Activity</LinkButton>
						</Link>
					)}
				</div>

				<ActivityList activities={activities} eid={String(eid)} loading={isActivitiesLoading} />
			</Column>
		</>
	);
};

export default ActivitiesPage;
