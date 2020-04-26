import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Column from '../components/layout/Column';
import { LinkButton } from '../components/form/LinkButton';
import { Navigation } from '../components/navigation';
import Image from 'next/image';

const HomePage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Evental</title>
			</Head>

			<Navigation />

			<Column className="flex flex-col items-center">
				<Image src="/images/logo.svg" alt="logo" width="80" height="80" />
				<h1 className="px-2 mb-3 text-4xl font-black leading-tight text-center md:text-6xl tracking-tight">
					Host Outstanding Events
				</h1>
				<p className="max-w-4xl mt-1 mb-8 text-center text-md lg:text-lg leading-2 lg:leading-8 text-gray-800">
					Event management software that's highly intuitive. Your attendees and organizers will love
					using Evental for your in-person, hybrid, and virtual events.
				</p>

				<div>
					<Link href="/events/create" passHref>
						<LinkButton className="mr-3">Host Event</LinkButton>
					</Link>
					<Link href="/events" passHref>
						<LinkButton>View Events</LinkButton>
					</Link>
				</div>
			</Column>
		</>
	);
};

export default HomePage;
