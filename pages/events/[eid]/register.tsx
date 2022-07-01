import { formatInTimeZone } from 'date-fns-tz';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';

import { Footer } from '../../../components/Footer';
import { CreateAttendeeForm } from '../../../components/attendees/CreateAttendeeForm';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../components/error/PrivatePage';
import { EventNavigation } from '../../../components/events/Navigation';
import { Button } from '../../../components/form/Button';
import { LinkButton } from '../../../components/form/LinkButton';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { Heading } from '../../../components/typography/Heading';
import { useCreateAttendeeMutation } from '../../../hooks/mutations/useCreateAttendeeMutation';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../hooks/queries/useIsOrganizerQuery';
import { useUser } from '../../../hooks/queries/useUser';

const EventRegisterPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { createAttendeeMutation } = useCreateAttendeeMutation(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { user } = useUser();

	if (!user?.id) {
		let params = new URLSearchParams();

		params.append('redirectUrl', String(router.asPath));

		return (
			<PageWrapper>
				{event && (
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
							url: `https://evental.app/events/${event.slug}/register`,
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
				)}

				<Navigation />

				<Column variant="halfWidth">
					<div className="space-y-5">
						<Heading>Create an account</Heading>
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

				<Footer color={event?.color} />
			</PageWrapper>
		);
	}

	if (!event && !isEventLoading) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			{event && (
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
						url: `https://evental.app/events/${event.slug}/register`,
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
			)}

			<EventNavigation eid={String(eid)} />

			<Column variant="halfWidth" className="space-y-5">
				<Heading>
					{event ? `Register for ${event.name}` : <Skeleton className="w-full max-w-xl" />}
				</Heading>

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

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default EventRegisterPage;
