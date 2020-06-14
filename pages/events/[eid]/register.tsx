import Prisma from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { CreateAttendeeForm } from '../../../components/attendees/CreateAttendeeForm';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../components/error/PrivatePage';
import { UnauthorizedPage } from '../../../components/error/UnauthorizedPage';
import { Footer } from '../../../components/Footer';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { useCreateAttendeeMutation } from '../../../hooks/mutations/useCreateAttendeeMutation';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../hooks/queries/useIsOrganizerQuery';
import { useUser } from '../../../hooks/queries/useUser';
import { ssrGetUser } from '../../../utils/api';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { getEvent } from '../../api/events/[eid]';
import { getIsOrganizer } from '../../api/events/[eid]/organizer';

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialOrganizer: boolean;
};

const EventRegisterPage: NextPage<Props> = (props) => {
	const { initialUser, initialEvent, initialOrganizer } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { createAttendeeMutation } = useCreateAttendeeMutation(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialOrganizer);
	const { user } = useUser(initialUser);

	if (isEventLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			<NextSeo
				title={`Register for ${event.name} — Evental`}
				description={`Fill out the form below to register for ${
					event.name
				} taking place from ${formatInTimeZone(
					event.startDate,
					event.timeZone,
					'MMMM do'
				)} to ${formatInTimeZone(event.endDate, event.timeZone, 'MMMM do')}.`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/regsister`,
					title: `Register for ${event.name} — Evental`,
					description: `Fill out the form below to register for ${
						event.name
					} taking place from ${formatInTimeZone(
						event.startDate,
						event.timeZone,
						'MMMM do'
					)} to ${formatInTimeZone(event.endDate, event.timeZone, 'MMMM do')}.`,
					images: [
						{
							url: `https://cdn.evental.app${event.image}`,
							width: 300,
							height: 300,
							alt: `${event.name} Logo Alt`,
							type: 'image/jpeg'
						}
					]
				}}
			/>
			<Navigation />
			<Column variant="halfWidth">
				<h1 className="text-2xl md:text-3xl font-bold">Register for {event.name}</h1>

				<p className="text-gray-700 mt-2">
					To attend this event, please click the register button below.
				</p>

				<CreateAttendeeForm
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
					createAttendeeMutation={createAttendeeMutation}
				/>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialEvent,
			initialOrganizer
		}
	};
};

export default EventRegisterPage;
