import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { GuideCategoryCard } from '../../components/guides/GuideCategoryCard';
import { GuideCategoryCardWrapper } from '../../components/guides/GuideCategoryCardWrapper';
import { GuideSection } from '../../components/guides/GuideSection';
import { StillNeedHelp } from '../../components/guides/StillNeedHelp';
import { UnorderedIconLinkList } from '../../components/guides/UnorderedIconLinkList';
import Column from '../../components/layout/Column';
import { Footer } from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/primitives/Heading';

const GuidesPage: NextPage = () => {
	return (
		<>
			<Navigation />

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

				<div className="bg-primary-700 text-white">
					<Column className="flex flex-col items-center">
						<Heading>Support Guides</Heading>
						<p className="mt-4 text-base text-gray-100">
							Need help getting started as an organizer, speaker or an attendee? Check out our
							guides.
						</p>
					</Column>
				</div>

				<Column>
					<Heading level={2} className="mb-4">
						Guides for Attendees & Speakers
					</Heading>
					<GuideCategoryCardWrapper className="mb-7 md:mb-14">
						<GuideCategoryCard>
							<span className="mb-1 block text-center text-xl font-bold md:text-2xl">
								Attendees
							</span>
							<p className="text-sm text-gray-600">
								Attending an event on Evental and need some extra help? Checkout the following
								attendee guides below.
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
						<GuideCategoryCard>
							<span className="mb-1 block text-center text-xl font-bold md:text-2xl">Speakers</span>
							<p className="text-sm text-gray-600">
								Are you speaking at an event that is using Evental? Check out the following guides
								below to help you get started.
							</p>

							<UnorderedIconLinkList
								items={[
									{
										text: 'Creating & Customizing your profile',
										relativeLink: '/guides/user/creating-an-account'
									}
								]}
							/>
						</GuideCategoryCard>
					</GuideCategoryCardWrapper>

					<Heading level={2} className="mb-4">
						Guides for Organizers
					</Heading>
					<GuideCategoryCardWrapper className="mb-7 md:mb-14">
						<GuideCategoryCard>
							<span className="mb-1 block text-center text-xl font-bold md:text-2xl">Sessions</span>
							<p className="text-sm text-gray-600">
								Sessions are specific talks/events occurring at your event. Attendees can register
								for these sessions. Checkout the following guides for organizing sessions below.
							</p>

							<UnorderedIconLinkList
								items={[
									{
										text: 'Creating a session',
										relativeLink: '/guides/session/creating-a-session'
									},
									{
										text: 'Creating a session category',
										relativeLink: '/guides/session/creating-a-session-category'
									},
									{
										text: 'Editing a session',
										relativeLink: '/guides/session/editing-a-session'
									},
									{
										text: 'Editing a session category',
										relativeLink: '/guides/session/editing-a-session-category'
									},
									{
										text: 'Attaching role members to a session',
										relativeLink: '/guides/session/attaching-a-role-member'
									}
								]}
							/>
						</GuideCategoryCard>

						<GuideCategoryCard>
							<span className="mb-1 block text-center text-xl font-bold md:text-2xl">Roles</span>
							<p className="text-sm text-gray-600">
								Roles are used to categorize and display attendees such as speakers, sponsors,
								exhibitors, artists, etc. Checkout the following organizer guides for organizers
								below.
							</p>

							<UnorderedIconLinkList
								items={[
									{
										text: 'Creating a role',
										relativeLink: '/guides/role/creating-a-role'
									},
									{
										text: 'Editing a role',
										relativeLink: '/guides/role/editing-a-role'
									},
									{
										text: 'Inviting a role member',
										relativeLink: '/guides/role/inviting-a-role-member'
									},
									{
										text: 'Creating a role member',
										relativeLink: '/guides/role/creating-a-role-member'
									}
								]}
							/>
						</GuideCategoryCard>

						<GuideCategoryCard>
							<span className="mb-1 block text-center text-xl font-bold md:text-2xl">
								Organizers
							</span>
							<p className="text-sm text-gray-600">
								As the event founder, you can invite additional organizers to assist you in setting
								up your event. Checkout the following guides for inviting organizers below.
							</p>

							<UnorderedIconLinkList
								items={[
									{
										text: 'Inviting organizers',
										relativeLink: '/guides/organizer/inviting-organizers'
									},
									{
										text: 'Granting the organizer role',
										relativeLink: '/guides/organizer/granting-the-organizer-role'
									}
								]}
							/>
						</GuideCategoryCard>

						<GuideCategoryCard>
							<span className="mb-1 block text-center text-xl font-bold md:text-2xl">Venues</span>
							<p className="text-sm text-gray-600">
								Venues are used to group sessions by location. Checkout the following organizer
								guides for venues below.
							</p>

							<UnorderedIconLinkList
								items={[
									{
										text: 'Creating a venue',
										relativeLink: '/guides/venue/creating-a-venue'
									},
									{
										text: 'Editing a venue',
										relativeLink: '/guides/venue/editing-a-venue'
									}
								]}
							/>
						</GuideCategoryCard>
						<GuideCategoryCard>
							<span className="mb-1 block text-center text-xl font-bold md:text-2xl">Pages</span>
							<p className="text-sm text-gray-600">
								Pages can be used to make event specific information such as hotels nearby, or a map
								of the convention available. Checkout the following organizer guides for pages
								below.
							</p>

							<UnorderedIconLinkList
								items={[
									{
										text: 'Creating a page',
										relativeLink: '/guides/page/creating-a-page'
									},
									{
										text: 'Editing a page',
										relativeLink: '/guides/page/editing-a-page'
									}
								]}
							/>
						</GuideCategoryCard>
					</GuideCategoryCardWrapper>

					<GuideSection>
						<StillNeedHelp />
					</GuideSection>
				</Column>

				<Footer />
			</PageWrapper>
		</>
	);
};

export default GuidesPage;
