import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { useActivityQuery } from '../../../../hooks/useActivityQuery';

const ViewActivityPage: NextPage = () => {
	const router = useRouter();
	const { aid, eid } = router.query;
	const { activity, isActivityLoading } = useActivityQuery(String(eid), String(aid));

	return (
		<>
			<Head>
				<title>Viewing Activity: {aid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				{isActivityLoading ? (
					<p>Loading</p>
				) : (
					<div>
						<p>{activity?.id}</p>

						<h1 className="text-3xl">{activity?.name}</h1>
						<p>{activity?.description}</p>
						<p>{activity?.startDate}</p>
						<p>{activity?.endDate}</p>
					</div>
				)}
			</Column>
		</>
	);
};

export default ViewActivityPage;
