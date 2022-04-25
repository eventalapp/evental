import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { LinkButton } from '../../../../components/form/LinkButton';
import { Navigation } from '../../../../components/navigation';
import NoAccess from '../../../../components/NoAccess';
import Unauthorized from '../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { useVenuesQuery } from '../../../../hooks/queries/useVenuesQuery';
import { VenueList } from '../../../../components/venues/VenueList';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { RoleList } from '../../../../components/roles/RoleList';
import { useActivitiesQuery } from '../../../../hooks/queries/useActivitiesQuery';
import { ActivityList } from '../../../../components/activities/ActivityList';
import { useAttendeesQuery } from '../../../../hooks/queries/useAttendeesQuery';
import { AttendeeList } from '../../../../components/attendees/AttendeeList';
import { buildTitle } from '../../../../utils/buildTitle';
import { faChevronRight, faCog, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';

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

			<Column>
				<BackButton />
				<FlexRowBetween>
					<h1 className="text-3xl mb-3 font-bold">Admin Page</h1>

					<div>
						<Link href={`/events/${eid}/admin/edit/`} passHref>
							<LinkButton className="mr-3">
								<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faCog} />
								<span className="ml-2">Edit</span>
							</LinkButton>
						</Link>

						<Link href={`/events/${eid}/admin/delete/`} passHref>
							<LinkButton>
								<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faTrash} />
								<span className="ml-2">Delete</span>
							</LinkButton>
						</Link>
					</div>
				</FlexRowBetween>
				<span>Manage your event</span>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-10">
					<div>
						<FlexRowBetween>
							<span className="text-3xl">Venues</span>

							<div>
								<Link href={`/events/${eid}/admin/venues/create`} passHref>
									<LinkButton className="mr-3">
										<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faPlus} />
									</LinkButton>
								</Link>
								<Link href={`/events/${eid}/venues/`} passHref>
									<LinkButton>
										<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faChevronRight} />
									</LinkButton>
								</Link>
							</div>
						</FlexRowBetween>

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
						<FlexRowBetween>
							<h1 className="text-3xl">Roles</h1>

							<div>
								<Link href={`/events/${eid}/admin/roles/create`} passHref>
									<LinkButton className="mr-3">
										<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faPlus} />
									</LinkButton>
								</Link>
								<Link href={`/events/${eid}/roles/`} passHref>
									<LinkButton>
										<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faChevronRight} />
									</LinkButton>
								</Link>
							</div>
						</FlexRowBetween>

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
						<FlexRowBetween>
							<h1 className="text-3xl">Attendees</h1>

							<div>
								<Link href={`/events/${eid}/attendees/`} passHref>
									<LinkButton>
										<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faChevronRight} />
									</LinkButton>
								</Link>
							</div>
						</FlexRowBetween>

						<AttendeeList
							isOrganizer={isOrganizer}
							isOrganizerLoading={isOrganizerLoading}
							isOrganizerError={isOrganizerError}
							eid={String(eid)}
							attendees={attendees}
							isAttendeesLoading={isAttendeesLoading}
							attendeesError={attendeesError}
						/>
					</div>
				</div>
				<div className="my-10">
					<div>
						<FlexRowBetween>
							<span className="text-3xl">Activities</span>

							<div>
								<Link href={`/events/${eid}/admin/activities/create`} passHref>
									<LinkButton className="mr-3">
										<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faPlus} />
									</LinkButton>
								</Link>
								<Link href={`/events/${eid}/activities/`} passHref>
									<LinkButton>
										<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faChevronRight} />
									</LinkButton>
								</Link>
							</div>
						</FlexRowBetween>

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
