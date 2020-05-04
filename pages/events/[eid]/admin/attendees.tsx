import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { LinkButton } from '../../../../components/form/LinkButton';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { useUser } from '../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { Navigation } from '../../../../components/navigation';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { useAttendeesQuery } from '../../../../hooks/queries/useAttendeesQuery';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { AttendeeList } from '../../../../components/attendees/AttendeeList';
import EventNavigationMenu from '../../../../components/radix/components/EventNavigationMenu';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { EventSettingsHeader } from '../../../../components/settings/EventSettingsHeader';

const AttendeesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { attendees, isAttendeesLoading } = useAttendeesQuery(String(eid));
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();

	if (
		isAttendeesLoading ||
		isAttendeesLoading ||
		isUserLoading ||
		isOrganizerLoading ||
		isEventLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Attendees</title>
			</Head>

			<Navigation />

			<Column>
				{event && <EventSettingsHeader event={event} />}

				<EventNavigationMenu eid={String(eid)} />

				<div>
					<FlexRowBetween>
						<span className="text-3xl font-bold">Attendees</span>

						<div>
							<Link href={`/events/${eid}/admin/attendees/create`} passHref>
								<LinkButton padding="medium">Create</LinkButton>
							</Link>
						</div>
					</FlexRowBetween>

					{attendees && <AttendeeList eid={String(eid)} attendees={attendees} />}
				</div>
			</Column>
		</PageWrapper>
	);
};

export default AttendeesAdminPage;
