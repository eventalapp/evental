import dayjs from 'dayjs';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ActivityList } from '../../../components/Activities/ActivityList';
import Column from '../../../components/Column';
import { LinkButton } from '../../../components/Form/LinkButton';
import { Navigation } from '../../../components/Navigation';
import { ServerError } from '../../../components/ServerError';
import { useActivitiesQuery } from '../../../hooks/queries/useActivitiesQuery';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../hooks/queries/useRolesQuery';
import { capitalizeFirstLetter } from '../../../utils/string';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));
	const { activities, isActivitiesLoading, activitiesError } = useActivitiesQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));

	return (
		<>
			<Head>
				<title>{event?.location}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				{eventError && <ServerError error={eventError} />}
				{isOrganizerError && <ServerError error={isOrganizerError} />}
				{activitiesError && <ServerError error={activitiesError} />}
				{rolesError && <ServerError error={rolesError} />}

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
							{!isRolesLoading &&
								roles &&
								roles.map((role) => (
									<Link href={`/events/${eid}/roles/${role.id}`} passHref key={role.id}>
										<LinkButton className="mr-3">
											{capitalizeFirstLetter(role.name.toLowerCase())}s
										</LinkButton>
									</Link>
								))}

							<Link href={`/events/${eid}/venues`} passHref>
								<LinkButton>Venues</LinkButton>
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
