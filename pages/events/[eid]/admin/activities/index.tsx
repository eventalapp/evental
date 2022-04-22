import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ActivityList } from '../../../../../components/Activities/ActivityList';
import { BackButton } from '../../../../../components/BackButton';
import Column from '../../../../../components/Column';
import { LinkButton } from '../../../../../components/Form/LinkButton';
import { Navigation } from '../../../../../components/Navigation';
import NoAccess from '../../../../../components/NoAccess';
import Unauthorized from '../../../../../components/Unauthorized';
import { useActivitiesQuery } from '../../../../../hooks/useActivitiesQuery';
import { useOrganizerQuery } from '../../../../../hooks/useOrganizerQuery';

const ActivitiesPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { activities, isActivitiesLoading } = useActivitiesQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<>
			<Head>
				<title>Activities Admin Page</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<div className="flex flex-row justify-between">
					<h1 className="text-3xl">Activities Admin Page</h1>
					<Link href={`/events/${eid}/admin/activities/create`} passHref>
						<LinkButton className="mr-3">Create activity</LinkButton>
					</Link>
				</div>

				<ActivityList activities={activities} eid={String(eid)} loading={isActivitiesLoading} />
			</Column>
		</>
	);
};

export default ActivitiesPage;
