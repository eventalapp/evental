import type Prisma from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
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

const AttendeesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data, isLoading } = useQuery<
		{ organizers: EventMemberUser[]; attendees: EventMemberUser[] },
		Error
	>(
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
				<BackButton />

				<h1 className="text-3xl">Attendees Page</h1>

				{isLoading ? (
					<p>Loading...</p>
				) : (
					data && (
						<>
							<div>
								<h2 className="text-2xl my-3">Organizers ({data.organizers.length})</h2>
								<ul>
									{data.organizers.map((eventMember) => (
										<li key={eventMember.id} className="inline-block">
											<Link href={`/events/${eid}/attendees/${eventMember.userId}`}>
												<a>
													<div className="flex flex-col items-center">
														<img
															alt={String(eventMember.user.name)}
															src={String(eventMember.user.image)}
															className="rounded-full h-32 w-32"
														/>
														<span className="text-lg">{eventMember.user.name}</span>
														<span className="text-md text-gray-700">
															{eventMember.user.company}
														</span>
														<span className="text-md text-gray-700">
															{eventMember.user.position}
														</span>
													</div>
												</a>
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div>
								<h2 className="text-2xl my-3">Attendees ({data.attendees.length})</h2>
								<ul>
									{data.attendees.map((eventMember) => (
										<li key={eventMember.id}>
											<Link href={`/events/${eid}/attendees/${eventMember.userId}`}>
												<a>
													<img
														alt={String(eventMember.user.name)}
														src={String(eventMember.user.image)}
													/>
													<span>{eventMember.user.name}</span>
												</a>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</>
					)
				)}
			</Column>
		</>
	);
};

export default AttendeesPage;
