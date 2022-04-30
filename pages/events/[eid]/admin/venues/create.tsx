import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Navigation } from '../../../../../components/navigation';
import { CreateVenueForm } from '../../../../../components/venues/CreateVenueForm';
import { useCreateVenueMutation } from '../../../../../hooks/mutations/useCreateVenueMutation';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { PasswordlessUser } from '../../../../../utils/api';
import user from '../../../../api/auth/user';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';

type Props = {
	initialOrganizer: boolean;
	user: PasswordlessUser | null;
};

const CreateActivityPage: NextPage<Props> = (props) => {
	const { initialOrganizer, user } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { createVenueMutation } = useCreateVenueMutation(String(eid));

	if (!user?.id) {
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
				<h1 className="text-3xl font-bold">Create Venue</h1>

				<CreateVenueForm createVenueMutation={createVenueMutation} eid={String(eid)} />
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialOrganizer = await getIsOrganizer(user.id, String(eid));

	return {
		props: {
			session,
			initialOrganizer
		}
	};
};
export default CreateActivityPage;
