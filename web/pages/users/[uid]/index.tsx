import {
	faAddressBook,
	faArrowUpRightFromSquare,
	faBuilding,
	faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import parse from 'html-react-parser';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { useUserById } from '@eventalapp/shared/hooks';

import { LoadingPage } from '../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import Column from '../../../components/layout/Column';
import { Footer } from '../../../components/layout/Footer';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { Heading } from '../../../components/primitives/Heading';
import { TooltipIcon } from '../../../components/primitives/TooltipIcon';

const ViewSessionPage: NextPage = () => {
	const router = useRouter();
	const { uid } = router.query;
	const { data: user, isLoading: isUserLoading } = useUserById({ uid: String(uid) });

	// TODO: skeleton impl
	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return <NotFoundPage />;
	}

	const Seo = (
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
					<div>
						<div className="relative mb-7 flex flex-row items-center">
							<div className="relative mr-3 h-16 w-16 shrink-0 rounded-md border border-gray-200 shadow-sm md:mr-5 md:h-20 md:w-20">
								<Image
									alt={String(user.name)}
									src={String(
										user.image
											? `https://cdn.evental.app${user.image}`
											: `https://cdn.evental.app/images/default-avatar.jpg`
									)}
									className="rounded-md"
									layout="fill"
								/>
							</div>

							<div>
								<Heading>{user.name}</Heading>
								<div className="flex flex-row flex-wrap items-center text-gray-600">
									{user.location && (
										<TooltipIcon
											icon={faLocationDot}
											tooltipMessage={`This user is located in ${user.location}`}
											label={user.location}
										/>
									)}

									{user.company && (
										<TooltipIcon
											icon={faBuilding}
											tooltipMessage={`This user works for ${user.company}`}
											label={user.company}
										/>
									)}

									{user.position && (
										<TooltipIcon
											icon={faAddressBook}
											tooltipMessage={
												user.company
													? `This user works for ${user.company} as a ${user.position}`
													: `This user works as a ${user.position}`
											}
											label={user.position}
										/>
									)}

									{user.website && (
										<TooltipIcon
											icon={faArrowUpRightFromSquare}
											tooltipMessage={`This user's website link is ${user.website}`}
											label={user.website}
											externalLink={user.website}
										/>
									)}
								</div>
							</div>
						</div>
					</div>

					{user.description && (
						<div className="prose focus:outline-none prose-a:text-primary">
							{parse(String(user.description))}
						</div>
					)}
				</Column>
			</PageWrapper>

			<Footer />
		</>
	);
};

export default ViewSessionPage;
