import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useUserById, useUserByIdSchedule } from '@eventalapp/shared/hooks';

import Column from '../../../components/layout/Column';
import { FlexRowBetween } from '../../../components/layout/FlexRowBetween';
import { Footer } from '../../../components/layout/Footer';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { Heading } from '../../../components/primitives/Heading';
import { SessionWithEventList } from '../../../components/sessions/SessionWithEventList';

const ViewSessionPage: NextPage = () => {
	const router = useRouter();

	const { uid } = router.query;
	const { data: user } = useUserById({ uid: String(uid) });
	const { data: sessionsByUser } = useUserByIdSchedule({ uid: String(uid) });

	const Seo = user && (
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
	);

	return (
		<>
			{Seo}

			<Navigation />

			<PageWrapper>
				<Column>
					<FlexRowBetween>
						<Heading>{user ? `${user.name}'s Schedule` : <Skeleton className="w-64" />}</Heading>

						{user ? (
							<Link href={`/api/user/${user.slug}/schedule/generate`}>
								<a className="text-gray-600">Download Schedule (Excel)</a>
							</Link>
						) : (
							<Skeleton className="w-48" />
						)}
					</FlexRowBetween>

					<SessionWithEventList sessions={sessionsByUser} />
				</Column>
			</PageWrapper>

			<Footer />
		</>
	);
};

export default ViewSessionPage;
