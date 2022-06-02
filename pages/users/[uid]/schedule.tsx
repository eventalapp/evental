import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { LoadingPage } from '../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import Column from '../../../components/layout/Column';
import { FlexRowBetween } from '../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { SessionWithEventList } from '../../../components/sessions/SessionWithEventList';
import { useSessionsByUserQuery } from '../../../hooks/queries/useSessionsByUserQuery';
import { useUserQuery } from '../../../hooks/queries/useUserQuery';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { getUser } from '../../api/users/[uid]';
import { SessionWithVenueEvent, getSessionsByUser } from '../../api/users/[uid]/sessions';

type Props = {
	initialViewingUser: PasswordlessUser | undefined;
	initialSessionsByUserData: SessionWithVenueEvent[] | undefined;
};

const ViewSessionPage: NextPage<Props> = (props) => {
	const { initialViewingUser, initialSessionsByUserData } = props;
	const router = useRouter();

	const { uid } = router.query;
	const { user, isUserLoading } = useUserQuery(String(uid), initialViewingUser);
	const { isSessionsByUserLoading, sessionsByUserData } = useSessionsByUserQuery(String(uid), {
		initialData: initialSessionsByUserData
	});

	if (isUserLoading || isSessionsByUserLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return <NotFoundPage />;
	}

	if (!sessionsByUserData) {
		return <NotFoundPage message="No sessions not found." />;
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
				<FlexRowBetween>
					<h3 className="text-xl md:text-2xl font-medium mt-3">
						{user.name}'s Schedule{' '}
						<span className="font-normal text-gray-500">({sessionsByUserData.length || 0})</span>
					</h3>

					<Link href={`/api/users/${user.slug}/schedule/generate`}>
						<a className="text-gray-600">Download Schedule (Excel)</a>
					</Link>
				</FlexRowBetween>

				<SessionWithEventList sessions={sessionsByUserData} />
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
