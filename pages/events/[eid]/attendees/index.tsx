import type Prisma from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';

type EventMemberUser = Prisma.EventMember & {
	user: {
		name: string | null;
		image: string | null;
	};
};

const AttendeesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data, isLoading } = useQuery<EventMemberUser[], Error>(
		['attendees', eid],
		async () => {
			return axios.get(`/api/events/${eid}/attendees`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined
		}
	);

	return (
		<>
			<Head>
				<title>All Attendees</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<Link href={`/events/${eid}`}>
					<a className="text-blue-900">Back to event</a>
				</Link>

				<h1 className="text-3xl">Attendees Page</h1>

				{isLoading ? (
					<p>Loading...</p>
				) : (
					<ul>
						{data?.map((eventMember) => (
							<li key={eventMember.id}>
								<Link href={`/events/${eid}/attendees/${eventMember.userId}`}>
									<a>
										<img alt={String(eventMember.user.name)} src={String(eventMember.user.image)} />
										<span>{eventMember.user.name}</span>
									</a>
								</Link>
							</li>
						))}
					</ul>
				)}
			</Column>
		</>
	);
};

export default AttendeesPage;
