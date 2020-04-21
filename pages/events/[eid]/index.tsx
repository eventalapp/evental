import type Prisma from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Column from '../../../components/Column';
import { LinkButton } from '../../../components/Form/LinkButton';
import { Navigation } from '../../../components/Navigation';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data: event, isLoading } = useQuery<Prisma.Event, Error>(
		['event', eid],
		async () => {
			return axios.get(`/api/events/${eid}`).then((res) => res.data.event);
		},
		{
			enabled: eid !== undefined
		}
	);
	const { data: isOrganizer } = useQuery<boolean, Error>(
		['isOrganizer', eid],
		async () => {
			return axios.get(`/api/events/${eid}/admin/organizer`).then((res) => res.data.isOrganizer);
		},
		{
			enabled: eid !== undefined
		}
	);

	return (
		<>
			<Head>
				<title>{event?.location}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				{isLoading ? (
					<p>Loading</p>
				) : (
					<div>
						{isOrganizer && (
							<Link href={`/events/${eid}/admin`}>
								<a className="block bg-yellow-400 px-5 py-3 rounded-md mb-4">
									You are an organizer for this event, click here to manage this event
								</a>
							</Link>
						)}
						<span className="text-gray-600 text-sm block">{event?.type}</span>
						<h1 className="text-3xl">{event?.name}</h1>
						<p>{event?.location}</p>
						<p>{event?.description}</p>
						{dayjs(event?.startDate).format('MMM DD')} - {dayjs(event?.endDate).format('MMM DD')}
						<div className="mt-3">
							<Link href={`/events/${eid}/attendees`} passHref>
								<LinkButton className="mr-3">View attendees</LinkButton>
							</Link>
							<Link href={`/events/${eid}/activities`} passHref>
								<LinkButton>View activities</LinkButton>
							</Link>
						</div>
					</div>
				)}
			</Column>
		</>
	);
};

export default ViewEventPage;
