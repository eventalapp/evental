import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';
import PageWrapper from '../components/layout/PageWrapper';
import { useUser } from '../hooks/queries/useUser';
import { ssrGetUser } from '../utils/api';
import { PasswordlessUser } from '../utils/stripUserPassword';
import { LoadingPage } from '../components/error/LoadingPage';
import { NotFoundPage } from '../components/error/NotFoundPage';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const SchedulePage: NextPage<Props> = (props) => {
	const { initialUser } = props;
	const { user, isUserLoading } = useUser(initialUser);

	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return <NotFoundPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Schedule</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<h1 className="text-2xl md:text-3xl font-bold">Schedule</h1>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const initialUser = (await ssrGetUser(context.req)) ?? undefined;

	return {
		props: {
			initialUser
		}
	};
};

export default SchedulePage;
