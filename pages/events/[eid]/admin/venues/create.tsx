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
import { ssrGetUser } from '../../../../../utils/api';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { useUser } from '../../../../../hooks/queries/useUser';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';

type Props = {
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
};

const CreateSessionPage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialUser } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { createVenueMutation } = useCreateVenueMutation(String(eid));
	const { user } = useUser(initialUser);

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

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer
		}
	};
};
export default CreateSessionPage;
