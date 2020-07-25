import { formatInTimeZone } from 'date-fns-tz';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useEvent, useIsOrganizer, useUser } from '@eventalapp/shared/hooks';

import { CreateAttendeeForm } from '../../../components/attendees/CreateAttendeeForm';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../components/error/PrivatePage';
import { EventNavigation } from '../../../components/events/Navigation';
import Column from '../../../components/layout/Column';
import { Footer } from '../../../components/layout/Footer';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { Button } from '../../../components/primitives/Button';
import { Heading } from '../../../components/primitives/Heading';
import { LinkButton } from '../../../components/primitives/LinkButton';

const EventRegisterPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data: event, isLoading: isEventLoading } = useEvent({ eid: String(eid) });
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });
	const { data: user } = useUser();

	const Seo = event && (
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
	);

	if (!user?.id) {
		let params = new URLSearchParams();

		params.append('redirectUrl', String(router.asPath));

		return (
			<>
				{Seo}

				<Navigation />

				<PageWrapper>
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
									<LinkButton padding="large" variant="primary">
										Sign in
									</LinkButton>
								</Link>
							</div>
						</div>
					</Column>
				</PageWrapper>

				<Footer color={event?.color} />
			</>
		);
	}

	if (!event && !isEventLoading) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<>
			{Seo}

			<EventNavigation eid={String(eid)} />

			<PageWrapper>
				{Seo}

				<EventNavigation eid={String(eid)} />

				<Column variant="halfWidth" className="space-y-5">
					<Heading>
						{event ? `Register for ${event.name}` : <Skeleton className="w-full max-w-xl" />}
					</Heading>

					<p className="text-gray-700">
						To attend this event, please click the register button below.
					</p>

					{event && <CreateAttendeeForm event={event} eid={String(eid)} />}
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default EventRegisterPage;
