import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Column from '../components/Column';
import { LinkButton } from '../components/form/LinkButton';
import { Navigation } from '../components/navigation';

const NotFoundPage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Page not found</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="font-bold text-2xl mt-5">404 - Page not found</h1>

				<Link href="/events" passHref>
					<LinkButton className="mt-5">Go to events page</LinkButton>
				</Link>
			</Column>
		</>
	);
};

export default NotFoundPage;
