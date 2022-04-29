import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { EditVenueForm } from '../../../../../../components/venues/EditVenueForm';
import { useEditVenueMutation } from '../../../../../../hooks/mutations/useEditVenueMutation';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import { getVenue } from '../../../../../api/events/[eid]/venues/[vid]';
import Prisma from '@prisma/client';
import { Session } from 'next-auth';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';

import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ViewServerErrorPage } from '../../../../../../components/error/ViewServerErrorPage';

type Props = {
	initialOrganizer: boolean;
	initialVenue: Prisma.EventVenue | undefined;
	session: Session | null;
};

const EditVenuePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialVenue, session } = props;
	const router = useRouter();
	const { eid, vid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venue, venueError, isVenueLoading } = useVenueQuery(
		String(eid),
		String(vid),
		initialVenue
	);
	const { editVenueMutation } = useEditVenueMutation(String(eid), String(vid));

	if (!session?.user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialVenue || !venue) {
		return <NotFoundPage />;
	}

	if (isVenueLoading) {
		return <LoadingPage />;
	}

	if (venueError) {
		return <ViewServerErrorPage errors={[venueError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Venue</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Edit Venue</h1>

				<EditVenueForm
					eid={String(eid)}
					venue={venue}
					venueError={venueError}
					editVenueMutation={editVenueMutation}
					isVenueLoading={isVenueLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, vid } = context.query;

	const session = await getSession(context);
	const initialOrganizer = (await getIsOrganizer(session?.user.id, String(eid))) ?? undefined;
	const initialVenue = (await getVenue(String(eid), String(vid))) ?? undefined;

	return {
		props: {
			session,
			initialOrganizer,
			initialVenue
		}
	};
};

export default EditVenuePage;
