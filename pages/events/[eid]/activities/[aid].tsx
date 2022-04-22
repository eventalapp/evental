import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewActivity } from '../../../../components/Activities/ViewActivity';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { ServerError } from '../../../../components/ServerError';
import { useActivityQuery } from '../../../../hooks/useActivityQuery';

const ViewActivityPage: NextPage = () => {
	const router = useRouter();
	const { aid, eid } = router.query;
	const { activity, isActivityLoading, activityError } = useActivityQuery(String(eid), String(aid));

	if (!activity) {
		<div>
			<p>Activity not found</p>
		</div>;
	}

	return (
		<>
			<Head>
				<title>Viewing Activity: {aid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				{activityError ? (
					<ServerError error={activityError} />
				) : (
					<ViewActivity
						activity={activity}
						loading={isActivityLoading}
						eid={String(eid)}
						aid={String(aid)}
					/>
				)}
			</Column>
		</>
	);
};

export default ViewActivityPage;
