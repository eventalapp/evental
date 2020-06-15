import Prisma from '@prisma/client';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { LoadingInner } from '../../../../../components/error/LoadingInner';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventNavigation } from '../../../../../components/events/navigation';
import { Footer } from '../../../../../components/Footer';
import { Button } from '../../../../../components/form/Button';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useCreateSessionAttendeeMutation } from '../../../../../hooks/mutations/useCreateSessionAttendeeMutation';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useSessionQuery } from '../../../../../hooks/queries/useSessionQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { ssrGetUser } from '../../../../../utils/api';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { getEvent } from '../../../../api/events/[eid]';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';
import { getPages } from '../../../../api/events/[eid]/pages';
import { getRoles } from '../../../../api/events/[eid]/roles';
import { SessionWithVenue } from '../../../../api/events/[eid]/sessions';
import { getSession } from '../../../../api/events/[eid]/sessions/[sid]';

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialSession: SessionWithVenue | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
	initialOrganizer: boolean;
};

const SessionRegisterPage: NextPage<Props> = (props) => {
	const {
		initialUser,
		initialSession,
		initialEvent,
		initialRoles,
		initialPages,
		initialOrganizer
	} = props;
	const router = useRouter();
	const { eid, sid } = router.query;
	const { session, isSessionLoading, sessionError } = useSessionQuery(
		String(eid),
		String(sid),
		initialSession
	);
	const { user } = useUser(initialUser);
	const { createSessionAttendeeMutation } = useCreateSessionAttendeeMutation(
		String(eid),
		String(sid),
		user?.id,
		{ redirectUrl: `/events/${eid}/sessions/${sid}` }
	);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialOrganizer);
	const { handleSubmit } = useForm();

	if (
		isSessionLoading ||
		isEventLoading ||
		isRolesLoading ||
		isPagesLoading ||
		isOrganizerLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!session) {
		return <NotFoundPage message="Session not found." />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (sessionError || rolesError || eventError) {
		return <ViewErrorPage errors={[sessionError, rolesError, eventError]} />;
	}

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			<NextSeo
				title={`Register for ${session.name} — ${event.name}`}
				description={`Register for the ${session.name} session at ${event.name}`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/sessions/${session.slug}/register`,
					title: `Register for ${session.name} — ${event.name}`,
					description: `Register for the ${session.name} session at ${event.name}`,
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
				<h1 className="text-2xl md:text-3xl font-medium">Register for {session.name}</h1>

				<p className="text-gray-700">
					To attend this session, please click the register button below.
				</p>

				<form
					onSubmit={handleSubmit(() => {
						createSessionAttendeeMutation.mutate();
					})}
				>
					<div className="flex flex-row justify-end">
						<Button type="button" variant="no-bg" onClick={router.back}>
							Cancel
						</Button>
						<Button
							type="submit"
							className="ml-4"
							variant="primary"
							padding="medium"
							disabled={createSessionAttendeeMutation.isLoading}
						>
							{createSessionAttendeeMutation.isLoading ? <LoadingInner /> : 'Register'}
						</Button>
					</div>
				</form>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, sid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialSession = (await getSession(String(eid), String(sid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSession,
			initialEvent,
			initialRoles,
			initialOrganizer,
			initialPages
		}
	};
};

export default SessionRegisterPage;
