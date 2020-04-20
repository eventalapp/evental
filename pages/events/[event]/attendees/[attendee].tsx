import type { NextPage } from 'next';
import Head from 'next/head';
import Column from '../../../../components/Column';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { attendee, event } = router.query;

	return (
		<Column className="py-10">
			<Head>
				<title>Viewing Attendee: {attendee}</title>
			</Head>

			<Link href={`/events/${event}/attendees`}>
				<a className="text-blue-900">Back to attendees</a>
			</Link>

			<h1 className="text-3xl">View Attendee Page id: {attendee}</h1>

			<p>With TypeScript, Next-Auth, Prisma, Postgres, Docker</p>
		</Column>
	);
};

export default ViewAttendeePage;
