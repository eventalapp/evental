import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
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

type Props = {
	initialOrganizer: boolean;
	initialVenue: Prisma.EventVenue;
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
	const { editVenueMutation, editVenueError } = useEditVenueMutation(String(eid), String(vid));

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
				<title>Edit Venue</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Edit Venue Page</h1>

				<EditVenueForm
					venue={venue}
					venueError={venueError}
					editVenueMutation={editVenueMutation}
					editVenueError={editVenueError}
					isVenueLoading={isVenueLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, vid } = context.query;

	const session = await getSession(context);
	const initialOrganizer = await getIsOrganizer(session?.user.id, String(eid));
	const initialVenue = await getVenue(String(eid), String(vid));

	return {
		props: {
			session,
			initialOrganizer,
			initialVenue
		}
	};
};

export default EditVenuePage;
