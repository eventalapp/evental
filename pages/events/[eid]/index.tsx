import dayjs from 'dayjs';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ActivityList } from '../../../components/Activities/ActivityList';
import Column from '../../../components/Column';
import { LinkButton } from '../../../components/Form/LinkButton';
import { Navigation } from '../../../components/Navigation';
import { useActivitiesQuery } from '../../../hooks/useActivitiesQuery';
import { useEventQuery } from '../../../hooks/useEventQuery';
import { useOrganizerQuery } from '../../../hooks/useOrganizerQuery';
import { useRolesQuery } from '../../../hooks/useRolesQuery';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { activities, isActivitiesLoading } = useActivitiesQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	return (
		<>
			<Head>
				<title>{event?.location}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				{isEventLoading ? (
					<p>Loading event...</p>
				) : (
					<div>
						{!isOrganizerLoading && isOrganizer && (
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
							{roles &&
								roles.map((role) => (
									<Link href={`/events/${eid}/attendees/${role.id}`} passHref key={role.id}>
										<LinkButton className="mr-3">View {role.role.toLowerCase()}s</LinkButton>
									</Link>
								))}

							<Link href={`/events/${eid}/activities`} passHref>
								<LinkButton className="mr-3">View activities</LinkButton>
							</Link>
							<Link href={`/events/${eid}/venues`} passHref>
								<LinkButton>View venues</LinkButton>
							</Link>
						</div>
						<ActivityList activities={activities} eid={String(eid)} loading={isActivitiesLoading} />
					</div>
				)}
			</Column>
		</>
	);
};

export default ViewEventPage;
