import type { NextPage } from 'next';
import Link from 'next/link';
import { LinkButton } from '../components/form/LinkButton';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { NextSeo } from 'next-seo';

const HomePage: NextPage = () => {
	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Evental — Event management software from the future"
				description="Event management software that's highly intuitive. Your attendees and organizers will love using Evental for your in-person, hybrid, and virtual events."
				openGraph={{
					url: 'https://evental.app',
					title: 'Evental — Event management software from the future',
					description:
						"Event management software that's highly intuitive. Your attendees and organizers will love using Evental for your in-person, hybrid, and virtual events.",
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

			<Column className="flex flex-col items-center">
				<h1 className="px-2 mb-3 text-4xl sm:text-5xl font-black leading-tight text-center lg:text-6xl tracking-tight">
					Host Outstanding Events
				</h1>
				<p className="max-w-4xl mt-1 mb-6 text-center text-base text-base lg:text-xl leading-2 lg:leading-8 text-gray-600">
					Event management software that's highly intuitive. Your attendees and organizers will love
					using Evental for your in-person, hybrid, and virtual events.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<Link href="/events/create" passHref>
						<LinkButton variant="primary" padding="large">
							Host An Event
						</LinkButton>
					</Link>
					<Link href="/events" passHref>
						<LinkButton variant="inversePrimary" padding="large">
							View All Events
						</LinkButton>
					</Link>
				</div>
			</Column>
		</PageWrapper>
	);
};

export default HomePage;
