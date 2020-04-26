import type { NextPage } from 'next';
import Head from 'next/head';
import Column from '../components/layout/Column';
import { FlexRowBetween } from '../components/layout/FlexRowBetween';
import { Navigation } from '../components/navigation';

const EventsPage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Settings</title>
			</Head>

			<Navigation />

			<Column>
				<FlexRowBetween>
					<h1 className="text-3xl font-bold">Settings Page</h1>
				</FlexRowBetween>
			</Column>
		</>
	);
};

export default EventsPage;
