import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../components/layout/Column';
import { Navigation } from '../../../components/navigation';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { getSession } from 'next-auth/react';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Session } from 'next-auth';

type Props = {
	session: Session | null;
};

const EventRegisterPage: NextPage<Props> = (props) => {
	const { session } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Event signup</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Signup for this event WIP</h1>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);

	return {
		props: {
			session
		}
	};
};

export default EventRegisterPage;
