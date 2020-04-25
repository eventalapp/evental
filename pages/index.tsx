import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Column from '../components/layout/Column';
import { LinkButton } from '../components/form/LinkButton';
import { Navigation } from '../components/navigation';

const HomePage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Evental</title>
			</Head>

			<Navigation />

			<Column className="flex flex-col items-center">
				<h1 className="px-2 mb-3 text-4xl font-black leading-tight text-center md:text-6xl">
					Execute Excellent Events
				</h1>
				<p className="max-w-4xl mt-1 mb-8 text-center text-md lg:text-lg leading-2 lg:leading-8 text-gray-800">
					Event management software that's quick to learn and easy to set up. Your attendees will
					love using Evental for your in-person, hybrid, and virtual events.
				</p>

				<Link href="/events/create" passHref>
					<LinkButton className="mr-3">Create Event</LinkButton>
				</Link>
				<Link href="/events" passHref>
					<LinkButton className="mr-3">View Events</LinkButton>
				</Link>
			</Column>
		</>
	);
};

export default HomePage;
