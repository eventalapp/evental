import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Column from '../components/Column';

const HomePage: NextPage = () => {
	return (
		<Column className="py-10">
			<Head>
				<title>Next-Template</title>
			</Head>

			<h1 className="text-3xl">Next-Template</h1>

			<p>With TypeScript, Next-Auth, Prisma, Postgres, Docker</p>

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
	);
};

export default HomePage;
