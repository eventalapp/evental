import type Prisma from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';

type EventMemberUser = Prisma.EventMember & {
	user: {
		name: string | null;
		image: string | null;
		company: string | null;
		position: string | null;
	};
};

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { aid, eid } = router.query;
	const { data, isLoading } = useQuery<EventMemberUser, Error>(
		['attendee', eid, aid],
		async () => {
			return axios.get(`/api/events/${eid}/attendees/${aid}`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined && aid !== undefined
		}
	);

	return (
		<>
			<Head>
				<title>Viewing Attendee: {aid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				{isLoading ? (
					<p>Loading</p>
				) : (
					<div>
						<img alt={String(data?.user.name)} src={String(data?.user.image)} />
						<h1 className="text-3xl">{data?.user.name}</h1>
						<p>{data?.role}</p>
						<span className="text-md text-gray-700 block">{data?.user.company}</span>
						<span className="text-md text-gray-700 block">{data?.user.position}</span>
					</div>
				)}
			</Column>
		</>
	);
};

export default ViewAttendeePage;
