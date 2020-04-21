import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Column from '../components/Column';
import { LinkButton } from '../components/Form/LinkButton';
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
				<Link href="/events/create" passHref>
					<LinkButton className="mr-3">Create Event</LinkButton>
				</Link>
				<Link href="/events" passHref>
					<LinkButton className="mr-3">View Events</LinkButton>
				</Link>
				<Link href="/auth/signin" passHref>
					<LinkButton>Sign in</LinkButton>
				</Link>
			</Column>
		</>
	);
};

export default HomePage;
