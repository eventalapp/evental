import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewActivity } from '../../../../components/Activities/ViewActivity';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { useActivityQuery } from '../../../../hooks/queries/useActivityQuery';
import React from 'react';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';

const ViewActivityPage: NextPage = () => {
	const router = useRouter();
	const { aid, eid } = router.query;
	const { activity, isActivityLoading, activityError } = useActivityQuery(String(eid), String(aid));
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));

	return (
		<div>
			<Head>
				<title>Viewing Activity: {aid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

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
		</div>
	);
};

export default ViewActivityPage;
