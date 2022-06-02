import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { BlankLink } from '../../components/BlankLink';
import { Footer } from '../../components/Footer';
import { GuideCategoryCard } from '../../components/guides/GuideCategoryCard';
import { GuideCategoryCardWrapper } from '../../components/guides/GuideCategoryCardWrapper';
import { UnorderedIconLinkList } from '../../components/guides/UnorderedIconLinkList';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';

const GuidesPage: NextPage = () => {
	return (
		<PageWrapper>
			<NextSeo
				title="Guides — Evental"
				description={`Need help getting started as an organizer or an attendee? Check out our guides.`}
				openGraph={{
					url: 'https://evental.app/guides',
					title: 'Guides — Evental',
					description: `Need help getting started as an organizer or an attendee? Check out our guides.`,
					images: [
						{
							url: 'https://cdn.evental.app/images/logo.jpg',
							width: 389,
							height: 389,
							alt: 'Evental Logo Alt',
							type: 'image/jpeg'
						}
					]
				}}
			/>
			<Navigation />

			<div className="dark-topography text-white">
				<Column className="flex flex-col items-center">
					<h1 className="text-2xl md:text-3xl font-bold">Support Guides</h1>
					<p className="text-gray-100 text-md mt-4">
						Need help getting started as an organizer, speaker or an attendee? Check out our guides.
					</p>
				</Column>
			</div>

			<Column>
				<h2 className="text-2xl md:text-3xl font-bold mb-3">Guides for Attendees & Speakers</h2>
				<GuideCategoryCardWrapper className="mb-7 md:mb-14">
					<GuideCategoryCard>
						<span className="block text-xl md:text-2xl mb-1 font-bold text-center">Attendees</span>
						<p className="text-gray-600 text-sm">
							Checkout the following guides below, if you are still in need help, reach out to us at{' '}
							<BlankLink href="mailto:support@evental.app" className="underline text-gray-900">
								support@evental.app
							</BlankLink>{' '}
							or fill out a{' '}
							<Link href="/support">
								<a className="underline text-gray-900">support ticket</a>
							</Link>
							.
						</p>

						<UnorderedIconLinkList
							items={[
								{
									text: 'Attending an event',
									relativeLink: '/guides/attendee/attending-an-event'
								},
								{
									text: 'Attending a session',
									relativeLink: '/guides/attendee/attending-a-session'
								},
								{
									text: 'Viewing & Downloading your schedule',
									relativeLink: '/guides/attendee/downloading-your-schedule'
								},
								{
									text: 'Creating & Customizing your profile',
									relativeLink: '/guides/user/creating-an-account'
								}
							]}
						/>
					</GuideCategoryCard>
					<GuideCategoryCard className="border border-gray-200 p-5 rounded-md shadow-sm">
						<span className="block text-xl md:text-2xl mb-1 font-bold text-center">Speakers</span>
						<p className="text-gray-600 text-sm">
							Considering using Evental? Not sure if Evental will meet your needs? Reach out to our
							team by booking a call or demo below, or email us at{' '}
							<BlankLink href="mailto:sales@evental.app" className="underline text-gray-900">
								sales@evental.app
							</BlankLink>
						</p>
					</GuideCategoryCard>
				</GuideCategoryCardWrapper>

				<h2 className="text-2xl md:text-3xl font-bold mb-3">Guides for Organizers</h2>
				<GuideCategoryCardWrapper>
					<GuideCategoryCard>
						<span className="block text-xl md:text-2xl mb-1 font-bold text-center">Sessions</span>
						<p className="text-gray-600 text-sm">
							Checkout the following guides for organizing sessions below, if you are still in need
							help, reach out to us at{' '}
							<BlankLink href="mailto:support@evental.app" className="underline text-gray-900">
								support@evental.app
							</BlankLink>{' '}
							or fill out a{' '}
							<Link href="/support">
								<a className="underline text-gray-900">support ticket</a>
							</Link>
							.
						</p>

						<UnorderedIconLinkList
							items={[
								{
									text: 'Creating a session',
									relativeLink: '/guides/session/creating-a-session'
								},
								{
									text: 'Creating a session type',
									relativeLink: '/guides/session/creating-a-session-type'
								}
							]}
						/>
					</GuideCategoryCard>
					<GuideCategoryCard className="border border-gray-200 p-5 rounded-md shadow-sm">
						<span className="block text-xl md:text-2xl mb-1 font-bold text-center">Organizers</span>
						<p className="text-gray-600 text-sm">
							Checkout the following guides for inviting organizers below, if you are still in need
							help, reach out to us at{' '}
							<BlankLink href="mailto:support@evental.app" className="underline text-gray-900">
								support@evental.app
							</BlankLink>{' '}
							or fill out a{' '}
							<Link href="/support">
								<a className="underline text-gray-900">support ticket</a>
							</Link>
							.
						</p>

						<UnorderedIconLinkList
							items={[
								{
									text: 'Inviting organizers',
									relativeLink: '/guides/organizer/inviting-organizers'
								}
							]}
						/>
					</GuideCategoryCard>
				</GuideCategoryCardWrapper>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default GuidesPage;
