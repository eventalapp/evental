import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { EditActivityForm } from '../../../../../../components/activities/EditActivityForm';
import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import { Session } from 'next-auth';
import { useVenuesQuery } from '../../../../../../hooks/queries/useVenuesQuery';
import { useActivityQuery } from '../../../../../../hooks/queries/useActivityQuery';
import { useEditActivityMutation } from '../../../../../../hooks/mutations/useEditActivityMutation';
import { getActivity } from '../../../../../api/events/[eid]/activities/[aid]';
import { getVenues } from '../../../../../api/events/[eid]/venues';
import type Prisma from '@prisma/client';

type Props = {
	initialOrganizer: boolean;
	initialActivity: Prisma.EventActivity | undefined;
	initialVenues: Prisma.EventVenue[];
	session: Session | null;
};

const EditActivityPage: NextPage<Props> = (props) => {
	const { initialOrganizer, session, initialVenues, initialActivity } = props;
	const router = useRouter();
	const { eid, aid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid), initialVenues);
	const { activity, isActivityLoading, activityError } = useActivityQuery(
		String(eid),
		String(aid),
		initialActivity
	);
	const { editActivityError, editActivityMutation } = useEditActivityMutation(
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
				<title>Edit Activity</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Edit Activity Page</h1>

				<EditActivityForm
					eid={String(eid)}
					venues={venues}
					activity={activity}
					editActivityMutation={editActivityMutation}
					editActivityError={editActivityError}
					isActivityLoading={isActivityLoading}
					isVenuesLoading={isVenuesLoading}
					venuesError={venuesError}
					activityError={activityError}
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
	const initialVenues = (await getVenues(String(eid))) ?? undefined;

	return {
		props: {
			session,
			initialOrganizer,
			initialActivity,
			initialVenues
		}
	};
};

export default EditActivityPage;
