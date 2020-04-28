import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { CreateActivityForm } from '../../../../../components/activities/CreateActivityForm';
import { Navigation } from '../../../../../components/navigation';
import NoAccess from '../../../../../components/NoAccess';
import Unauthorized from '../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useVenuesQuery } from '../../../../../hooks/queries/useVenuesQuery';
import { useCreateActivityMutation } from '../../../../../hooks/mutations/useCreateActivityMutation';
import React from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { getVenues } from '../../../../api/events/[eid]/venues';
import { Session } from 'next-auth';
import type Prisma from '@prisma/client';

type Props = {
	initialOrganizer: boolean;
	initialVenues: Prisma.EventVenue[];
	session: Session | null;
};

const CreateActivityPage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialVenues, session } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid), initialVenues);
	const { createActivityError, createActivityMutation } = useCreateActivityMutation(String(eid));

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
				<title>Create Activity</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Create Activity Page</h1>

				<CreateActivityForm
					eid={String(eid)}
					venues={venues}
					venuesError={venuesError}
					isVenuesLoading={isVenuesLoading}
					createActivityError={createActivityError}
					createActivityMutation={createActivityMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialOrganizer = await getIsOrganizer(session?.user.id, String(eid));
	const initialVenues = await getVenues(String(eid));

	return {
		props: {
			session,
			initialOrganizer,
			initialVenues
		}
	};
};

export default CreateActivityPage;
