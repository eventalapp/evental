import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { useVenueQuery } from '../../../../hooks/queries/useVenueQuery';
import React, { useState } from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import Prisma from '@prisma/client';
import { getVenue } from '../../../api/events/[eid]/venues/[vid]';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { PasswordlessUser } from '../../../../utils/stripUserPassword';
import { ssrGetUser } from '../../../../utils/api';
import { EventNavigation } from '../../../../components/events/navigation';
import { getEvent } from '../../../api/events/[eid]';
import { getRoles } from '../../../api/events/[eid]/roles';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { useSessionsByVenueQuery } from '../../../../hooks/queries/useSessionsByVenueQuery';
import { getSessionsByVenue, PaginatedSessionsWithVenue } from '../../../api/events/[eid]/sessions';
import { Pagination } from '../../../../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { SessionList } from '../../../../components/sessions/SessionList';
import Tooltip from '../../../../components/radix/components/Tooltip';
import parse from 'html-react-parser';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { getPages } from '../../../api/events/[eid]/pages';

type Props = {
	initialVenue: Prisma.EventVenue | undefined;
	initialSessionsByVenue: PaginatedSessionsWithVenue | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const router = useRouter();
	const {
		initialVenue,
		initialRoles,
		initialUser,
		initialEvent,
		initialSessionsByVenue,
		initialPages
	} = props;
	const { vid, eid } = router.query;
	const [page, setPage] = useState(1);
	const { venue, isVenueLoading, venueError } = useVenueQuery(
		String(eid),
		String(vid),
		initialVenue
	);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const { sessionsByVenueData, isSessionsByVenueLoading } = useSessionsByVenueQuery(
		String(eid),
		String(vid),
		{
			initialData: initialSessionsByVenue,
			page
		}
	);

	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (
		isVenueLoading ||
		isEventLoading ||
		isRolesLoading ||
		isSessionsByVenueLoading ||
		isPagesLoading
	) {
		return <LoadingPage />;
	}

	if (!venue || !sessionsByVenueData?.sessions) {
		return <NotFoundPage message="Venue not found." />;
	}

	if (venueError || eventError || rolesError) {
		return <ViewErrorPage errors={[venueError, eventError, rolesError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Venue: {venue && venue.name}</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} pages={pages} />

			<Column>
				<div className="mb-5">
					<h3 className="text-xl md:text-2xl font-medium mb-1">{venue.name}</h3>

					<Tooltip
						message={
							venue.address
								? `This is venue is located at ${venue?.address}.`
								: 'This venue has not specified an address'
						}
					>
						<div className="inline-flex flex-row items-center mb-1 cursor-help">
							<FontAwesomeIcon
								fill="currentColor"
								className="w-5 h-5 mr-1.5"
								size="1x"
								icon={faLocationDot}
							/>
							{venue.address ? <p>{venue.address}</p> : <em>No Address</em>}
						</div>
					</Tooltip>

					{venue.description && (
						<div className="prose focus:outline-none prose-a:text-primary mt-1">
							{parse(String(venue.description))}
						</div>
					)}
				</div>

				<h3 className="text-xl md:text-2xl font-medium">
					Sessions{' '}
					{sessionsByVenueData?.pagination?.total > 0 && (
						<span className="font-normal text-gray-500">
							({sessionsByVenueData?.pagination?.from || 0}/
							{sessionsByVenueData?.pagination?.total || 0})
						</span>
					)}
				</h3>

				{sessionsByVenueData.sessions && (
					<SessionList eid={String(eid)} sessions={sessionsByVenueData.sessions} event={event} />
				)}

				{sessionsByVenueData.pagination.pageCount > 1 && (
					<Pagination
						page={page}
						pageCount={sessionsByVenueData.pagination.pageCount}
						setPage={setPage}
					/>
				)}
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, vid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialVenue = (await getVenue(String(eid), String(vid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialSessionsByVenue = (await getSessionsByVenue(String(eid), String(vid))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialVenue,
			initialRoles,
			initialEvent,
			initialSessionsByVenue,
			initialPages
		}
	};
};

export default ViewAttendeePage;
