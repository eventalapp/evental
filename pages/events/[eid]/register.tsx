import Prisma from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { CreateAttendeeForm } from '../../../components/attendees/CreateAttendeeForm';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../components/error/PrivatePage';
import { EventNavigation } from '../../../components/events/navigation';
import { Footer } from '../../../components/Footer';
import { Button } from '../../../components/form/Button';
import { LinkButton } from '../../../components/form/LinkButton';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { useCreateAttendeeMutation } from '../../../hooks/mutations/useCreateAttendeeMutation';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../hooks/queries/useUser';
import { ssrGetUser } from '../../../utils/api';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { getEvent } from '../../api/events/[eid]';
import { getIsOrganizer } from '../../api/events/[eid]/organizer';
import { getPages } from '../../api/events/[eid]/pages';
import { getRoles } from '../../api/events/[eid]/roles';

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialOrganizer: boolean;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
};

const EventRegisterPage: NextPage<Props> = (props) => {
	const { initialUser, initialEvent, initialOrganizer, initialPages, initialRoles } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { createAttendeeMutation } = useCreateAttendeeMutation(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialOrganizer);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const { handleSubmit } = useForm();

	if (isEventLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (!event) {
		return <NotFoundPage />;
	}

	if (!user?.id) {
		let params = new URLSearchParams();

		params.append('redirectUrl', String(router.asPath));

		return (
			<PageWrapper>
				<Navigation />

				<Column variant="halfWidth">
					<div className="space-y-5">
						<h1 className="text-2xl font-bold md:text-3xl">Create an account</h1>
						<p className="text-gray-700">
							To register for this event, please{' '}
							<Link href={`/auth/signup?${params}`}>
								<a className="text-gray-900 underline">create an account</a>
							</Link>{' '}
							or{' '}
							<Link href={`/auth/signin?${params}`}>
								<a className="text-gray-900 underline">sign in</a>
							</Link>{' '}
							with your existing account.
						</p>
						<div className="flex flex-row justify-end">
							<Button type="button" variant="no-bg" className="mr-3" onClick={router.back}>
								Cancel
							</Button>
							<Link href={`/auth/signin?${params}`} passHref>
								<LinkButton padding="large">Sign in</LinkButton>
							</Link>
						</div>
					</div>
				</Column>

				<Footer />
			</PageWrapper>
		);
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

			<EventNavigation event={event} roles={roles} user={user} pages={pages} />

			<Column variant="halfWidth" className="space-y-5">
				<h1 className="text-2xl font-bold md:text-3xl">Register for {event.name}</h1>

				<p className="text-gray-700">
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
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialEvent,
			initialOrganizer,
			initialPages,
			initialRoles
		}
	};
};

export default EventRegisterPage;
