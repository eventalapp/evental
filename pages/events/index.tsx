import type { NextPage } from 'next';
import Head from 'next/head';

import Column from '../../components/Column';

const EventsPage: NextPage = () => {
	return (
		<Column className="py-10">
			<Head>
				<title>All Events</title>
			</Head>

			<h1 className="text-3xl">Event Page</h1>

			<p>With TypeScript, Next-Auth, Prisma, Postgres, Docker</p>
		</Column>
	);
};

export default EventsPage;
