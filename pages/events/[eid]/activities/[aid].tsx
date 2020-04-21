import type Prisma from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';

const ViewActivityPage: NextPage = () => {
	const router = useRouter();
	const { aid, eid } = router.query;
	const { data, isLoading } = useQuery<Prisma.EventActivity, Error>(
		['activity', eid, aid],
		async () => {
			return axios.get(`/api/events/${eid}/activities/${aid}`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined && aid !== undefined
		}
	);

	return (
		<>
			<Head>
				<title>Viewing Activity: {aid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				{isLoading ? (
					<p>Loading</p>
				) : (
					<div>
						<p>{data?.id}</p>

						<h1 className="text-3xl">{data?.name}</h1>
						<p>{data?.description}</p>
						<p>{data?.startDate}</p>
						<p>{data?.endDate}</p>
					</div>
				)}
			</Column>
		</>
	);
};

export default ViewActivityPage;
