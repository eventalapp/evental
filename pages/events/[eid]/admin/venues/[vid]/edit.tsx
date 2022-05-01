import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

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
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { PasswordlessUser, ssrGetUser } from '../../../../../../utils/api';
import { useUser } from '../../../../../../hooks/queries/useUser';

type Props = {
	initialOrganizer: boolean;
	initialVenue: Prisma.EventVenue | undefined;
	initialUser: PasswordlessUser | undefined;
};

const EditVenuePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialVenue, initialUser } = props;
	const router = useRouter();
	const { eid, vid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venue, venueError, isVenueLoading } = useVenueQuery(
		String(eid),
		String(vid),
		initialVenue
	);
	const { editVenueMutation } = useEditVenueMutation(String(eid), String(vid));
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialVenue || !venue) {
		return <NotFoundPage message="Venue not found." />;
	}

	if (isVenueLoading) {
		return <LoadingPage />;
	}

	if (venueError) {
		return <ViewErrorPage errors={[venueError]} />;
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

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialVenue = (await getVenue(String(eid), String(vid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialVenue
		}
	};
};

export default EditVenuePage;
