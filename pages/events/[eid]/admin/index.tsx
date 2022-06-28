import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Footer } from '../../../../components/Footer';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { EditEventForm } from '../../../../components/events/EditEventForm';
import { EventSettingsNavigation } from '../../../../components/events/settingsNavigation';
import { LinkButton } from '../../../../components/form/LinkButton';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { Heading } from '../../../../components/typography/Heading';
import { useEditEventMutation } from '../../../../hooks/mutations/useEditEventMutation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';

const EditEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { editEventMutation } = useEditEventMutation(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Event Settings</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column>
				<Heading>Settings</Heading>

				<EditEventForm
					eid={String(eid)}
					eventError={eventError}
					editEventMutation={editEventMutation}
					event={event}
					isEventLoading={isEventLoading}
				/>

				<p className="mt-5 mb-3 text-lg font-bold text-red-600">Danger Zone</p>

				<div className="rounded-md border shadow-sm p-4">
					<Link href={`/events/${eid}/admin/delete`} passHref>
						<LinkButton variant="danger">Delete Event</LinkButton>
					</Link>
				</div>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default EditEventPage;
