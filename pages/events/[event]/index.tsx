import type { NextPage } from 'next';
import Head from 'next/head';
import Column from '../../../components/Column';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { event } = router.query;

	return (
		<Column className="py-10">
			<Head>
				<title>Viewing Event: {event}</title>
			</Head>

			<h1 className="text-3xl">View Event Page id: {event}</h1>

			<p>With TypeScript, Next-Auth, Prisma, Postgres, Docker</p>

			<Link href={`/events/${event}/attendees`}>
				<a className="text-blue-900 p-3">View attendees</a>
			</Link>

			<Link href={`/events/${event}/activities`}>
				<a className="text-blue-900 p-3">View activities</a>
			</Link>
		</Column>
	);
};

export default ViewEventPage;
