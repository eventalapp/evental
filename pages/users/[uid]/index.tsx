import parse from 'html-react-parser';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { LoadingPage } from '../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { useUserQuery } from '../../../hooks/queries/useUserQuery';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { getUser } from '../../api/users/[uid]';

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
		<PageWrapper>
			<NextSeo
				title={`${user.name} — Evental`}
				description={`View ${user.name} at Evental.`}
				openGraph={{
					url: `https://evental.app/users/${user.id}`,
					title: `${user.name} — Evental`,
					description: `View ${user.name} at Evental.`,
					images: [
						{
							url: 'https://cdn.evental.app/images/logo.jpg',
							width: 389,
							height: 389,
							alt: 'Evental Logo Alt',
							type: 'image/jpeg'
						}
					]
				}}
			/>

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
