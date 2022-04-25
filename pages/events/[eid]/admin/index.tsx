import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { LinkButton } from '../../../../components/Form/LinkButton';
import { Navigation } from '../../../../components/Navigation';
import NoAccess from '../../../../components/NoAccess';
import Unauthorized from '../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { useVenuesQuery } from '../../../../hooks/queries/useVenuesQuery';
import { VenueList } from '../../../../components/Venues/VenueList';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { RoleList } from '../../../../components/Roles/RoleList';
import { useActivitiesQuery } from '../../../../hooks/queries/useActivitiesQuery';
import { ActivityList } from '../../../../components/Activities/ActivityList';
import { useAttendeesQuery } from '../../../../hooks/queries/useAttendeesQuery';
import { AttendeeList } from '../../../../components/Attendees/AttendeeList';
import { buildTitle } from '../../../../utils/buildTitle';

const AdminPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();

	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { attendees, isAttendeesLoading, attendeesError } = useAttendeesQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { activities, isActivitiesLoading, activitiesError } = useActivitiesQuery(String(eid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<div>
			<Head>
				<title>{buildTitle('Edit Event')}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />
				<div className="flex flex-row justify-between">
					<h1 className="text-3xl">Admin Page</h1>

					<div>
						<Link href={`/events/${eid}/admin/edit`} passHref>
							<LinkButton>Edit event</LinkButton>
						</Link>
					</div>
				</div>
				<span>Manage your event</span>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-10">
					<div>
						<div className="flex flex-row justify-between mb-3">
							<span className="text-3xl">Venues</span>

							<div>
								<Link href={`/events/${eid}/venues/`} passHref>
									<LinkButton>View all venues</LinkButton>
								</Link>
							</div>
						</div>

						<VenueList
							eid={String(eid)}
							venues={venues}
							venuesError={venuesError}
							isVenuesLoading={isVenuesLoading}
							isOrganizerError={isOrganizerError}
							isOrganizer={isOrganizer}
							isOrganizerLoading={isOrganizerLoading}
						/>
					</div>
					<div>
						<div className="flex flex-row justify-between mb-3">
							<h1 className="text-3xl">Roles</h1>

							<div>
								<Link href={`/events/${eid}/roles/`} passHref>
									<LinkButton>View all roles</LinkButton>
								</Link>
							</div>
						</div>

						<RoleList
							eid={String(eid)}
							roles={roles}
							isRolesLoading={isRolesLoading}
							rolesError={rolesError}
							isOrganizerError={isOrganizerError}
							isOrganizer={isOrganizer}
							isOrganizerLoading={isOrganizerLoading}
						/>
					</div>
				</div>
				<div className="my-10">
					<div>
						<div className="flex flex-row justify-between mb-3">
							<h1 className="text-3xl">Attendees</h1>

							<div>
								<Link href={`/events/${eid}/attendees/`} passHref>
									<LinkButton>View all attendees</LinkButton>
								</Link>
							</div>
						</div>

						<AttendeeList
							eid={String(eid)}
							attendees={attendees}
							isAttendeesLoading={isAttendeesLoading}
							attendeesError={attendeesError}
						/>
					</div>
				</div>
				<div className="my-10">
					<div>
						<div className="flex flex-row justify-between">
							<span className="text-3xl">Activities</span>

							<div>
								<Link href={`/events/${eid}/activities/`} passHref>
									<LinkButton>View all activities</LinkButton>
								</Link>
							</div>
						</div>

						<ActivityList
							isOrganizer={isOrganizer}
							isOrganizerLoading={isOrganizerLoading}
							isOrganizerError={isOrganizerError}
							activities={activities}
							eid={String(eid)}
							activitiesError={activitiesError}
							isActivitiesLoading={isActivitiesLoading}
						/>
					</div>
				</div>
			</Column>
		</div>
	);
};

export default AdminPage;
