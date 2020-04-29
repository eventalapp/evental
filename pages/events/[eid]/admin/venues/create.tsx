import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { CreateVenueForm } from '../../../../../components/venues/CreateVenueForm';
import { Navigation } from '../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useCreateVenueMutation } from '../../../../../hooks/mutations/useCreateVenueMutation';
import React, { useEffect } from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { Session } from 'next-auth';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { toast } from 'react-toastify';

type Props = {
	initialOrganizer: boolean;
	session: Session | null;
};

const CreateActivityPage: NextPage<Props> = (props) => {
	const { initialOrganizer, session } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { createVenueMutation, createVenueError } = useCreateVenueMutation(String(eid));

	useEffect(() => {
		toast.error(createVenueError?.message);
	}, [createVenueError]);

	if (!session?.user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Create event</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Create Venue Page</h1>

				<CreateVenueForm
					createVenueError={createVenueError}
					createVenueMutation={createVenueMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialOrganizer = await getIsOrganizer(session?.user.id, String(eid));

	return {
		props: {
			session,
			initialOrganizer
		}
	};
};
export default CreateActivityPage;
