import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { AttendeeWithUser, PasswordlessUser } from '../../../../utils/stripUserPassword';
import { LinkButton } from '../../../../components/form/LinkButton';
import { ssrGetUser } from '../../../../utils/api';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { useUser } from '../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { getAttendees } from '../../../api/events/[eid]/attendees';
import { Navigation } from '../../../../components/navigation';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { useAttendeesQuery } from '../../../../hooks/queries/useAttendeesQuery';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { EventSettingsNavigation } from '../../../../components/settings/EventSettingsNavigation';
import { AttendeeList } from '../../../../components/attendees/AttendeeList';

type Props = {
	initialAttendees: AttendeeWithUser[] | undefined;
	initialUser: PasswordlessUser | undefined;
	initialOrganizer: boolean;
};

const AttendeesAdminPage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialUser, initialAttendees, initialOrganizer } = props;
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { attendees, isAttendeesLoading, attendeesError } = useAttendeesQuery(
		String(eid),
		initialAttendees
	);
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (isAttendeesLoading) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Attendees</title>
			</Head>

			<Navigation />

			<Column>
				<EventSettingsNavigation eid={String(eid)} />

				<div>
					<FlexRowBetween>
						<span className="text-3xl font-bold">Attendees</span>

						<div>
							<Link href={`/events/${eid}/admin/attendees/create`} passHref>
								<LinkButton className="mr-3">
									<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faPlus} />
								</LinkButton>
							</Link>
							<Link href={`/events/${eid}/attendees/`} passHref>
								<LinkButton>
									<FontAwesomeIcon className="cursor-pointer" size="1x" icon={faChevronRight} />
								</LinkButton>
							</Link>
						</div>
					</FlexRowBetween>

					<AttendeeList
						eid={String(eid)}
						attendees={attendees}
						isAttendeesLoading={isAttendeesLoading}
						attendeesError={attendeesError}
					/>
				</div>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialAttendees = (await getAttendees(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialAttendees
		}
	};
};

export default AttendeesAdminPage;
