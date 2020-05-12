import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { getUser } from '../../api/users/[uid]';
import { Navigation } from '../../../components/navigation';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { useUserQuery } from '../../../hooks/queries/useUserQuery';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import { LoadingPage } from '../../../components/error/LoadingPage';
import React, { useState } from 'react';
import parse from 'html-react-parser';
import { NextSeo } from 'next-seo';
import { useSessionsByUserQuery } from '../../../hooks/queries/useSessionsByUserQuery';
import { Pagination } from '../../../components/Pagination';
import { SessionWithEventList } from '../../../components/sessions/SessionWithEventList';
import { getSessionsByUser, PaginatedSessionsWithVenueEvent } from '../../api/users/[uid]/sessions';

type Props = {
	initialViewingUser: PasswordlessUser | undefined;
	initialSessionsByUserData: PaginatedSessionsWithVenueEvent | undefined;
};

const ViewSessionPage: NextPage<Props> = (props) => {
	const { initialViewingUser, initialSessionsByUserData } = props;
	const router = useRouter();
	const [page, setPage] = useState(1);
	const { uid } = router.query;
	const { user, isUserLoading } = useUserQuery(String(uid), initialViewingUser);
	const { isSessionsByUserLoading, sessionsByUserData } = useSessionsByUserQuery(String(uid), {
		page,
		initialData: initialSessionsByUserData
	});

	if (isUserLoading || isSessionsByUserLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return <NotFoundPage />;
	}

	if (!sessionsByUserData?.sessions) {
		return <NotFoundPage message="No sessions not found." />;
	}

	return (
		<PageWrapper variant="gray">
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

				<h3 className="text-xl md:text-2xl font-medium mt-3">
					Schedule{' '}
					{sessionsByUserData?.pagination?.total > 0 && (
						<span className="font-normal text-gray-500">
							({sessionsByUserData?.pagination?.from || 0}/
							{sessionsByUserData?.pagination?.total || 0})
						</span>
					)}
				</h3>

				<SessionWithEventList sessions={sessionsByUserData?.sessions} />

				{sessionsByUserData.pagination.pageCount > 1 && (
					<Pagination
						page={page}
						pageCount={sessionsByUserData.pagination.pageCount}
						setPage={setPage}
					/>
				)}
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { uid } = context.query;

	const initialViewingUser = (await getUser(String(uid))) ?? undefined;
	const initialSessionsByUserData = (await getSessionsByUser(String(uid))) ?? undefined;

	return {
		props: {
			initialViewingUser,
			initialSessionsByUserData
		}
	};
};

export default ViewSessionPage;
