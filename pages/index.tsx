import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { LinkButton } from '../components/form/LinkButton';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';

const HomePage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Evental</title>
			</Head>

			<Navigation />

			<Column className="flex flex-col items-center">
				<h1 className="px-2 mb-3 text-4xl sm:text-5xl font-black leading-tight text-center md:text-6xl xl:text-7xl tracking-tight">
					Host Outstanding Events
				</h1>
				<p className="max-w-4xl mt-1 mb-6 text-center text-md text-md lg:text-xl leading-2 lg:leading-8 text-gray-600">
					Event management software that's highly intuitive. Your attendees and organizers will love
					using Evental for your in-person, hybrid, and virtual events.
				</p>

				<div>
					<Link href="/events/create" passHref>
						<LinkButton variant="gradient" padding="large">
							Host An Event
						</LinkButton>
					</Link>
					<Link href="/events" passHref>
						<LinkButton variant="primary" padding="large" className="ml-5">
							View All Events
						</LinkButton>
					</Link>
				</div>
			</Column>
		</>
	);
};

export default HomePage;
