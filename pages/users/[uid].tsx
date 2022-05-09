import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { getUser } from '../api/users/[uid]';
import { Navigation } from '../../components/navigation';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { useUserQuery } from '../../hooks/queries/useUserQuery';
import { NotFoundPage } from '../../components/error/NotFoundPage';
import { LoadingPage } from '../../components/error/LoadingPage';
import React from 'react';
import parse from 'html-react-parser';

type Props = {
	initialViewingUser: PasswordlessUser | undefined;
};

const ViewSessionPage: NextPage<Props> = (props) => {
	const { initialViewingUser } = props;
	const router = useRouter();
	const { uid } = router.query;
	const { user, isUserLoading } = useUserQuery(String(uid), initialViewingUser);

	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return <NotFoundPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing User</title>
			</Head>

			<Navigation />

			<Column>
				<h3 className="text-xl md:text-2xl font-medium mb-3">{user.name}</h3>

				{user.description && (
					<div className="prose focus:outline-none prose-a:text-primary">
						{parse(String(user.description))}
					</div>
				)}
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { uid } = context.query;

	const initialViewingUser = (await getUser(String(uid))) ?? undefined;

	return {
		props: {
			initialViewingUser
		}
	};
};

export default ViewSessionPage;
