import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Column from '../components/Column';
import { Navigation } from '../components/Navigation';

const HomePage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Evental</title>
			</Head>

			<Navigation />

			<section className="bg-yellow-300 py-10">
				<Column>
					<h1 className="text-3xl">Execute Excellent Events</h1>
					<span className="inline-block">
						Event management software that's quick to learn and easy to set up. Your attendees will
						love using Evental for your in-person, hybrid, and virtual events.
					</span>
				</Column>
			</section>
			<Column className="py-10">
				<Link href="/events/create">
					<a className="text-blue-600 p-3">Create Event</a>
				</Link>
				<Link href="/events">
					<a className="text-blue-600 p-3">View Events</a>
				</Link>
				<Link href="/auth/signin">
					<a className="text-blue-600 p-3">Sign in</a>
				</Link>
			</Column>
		</>
	);
};

export default HomePage;
