import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { GuideSection } from '../../../components/guides/GuideSection';
import { GuideSectionHeader } from '../../../components/guides/GuideSectionHeader';
import { StillNeedHelp } from '../../../components/guides/StillNeedHelp';
import { TableOfContents } from '../../../components/guides/TableOfContents';
import Column from '../../../components/layout/Column';
import { Footer } from '../../../components/layout/Footer';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { Heading } from '../../../components/primitives/Heading';

const AttendingAnEventGuidePage: NextPage = () => {
	return (
		<>
			<Navigation />

			<PageWrapper>
				<NextSeo
					title="Attending an event — Evental"
					description={`Learn how to get started as an attendee or a speaker.`}
					openGraph={{
						url: 'https://evental.app/guides/attendee/attending-an-event',
						title: 'Attending an event — Evental',
						description: `Learn how to get started as an attendee or a speaker.`,
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
						<Heading>Attending an event</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to get started as an attendee or a speaker.
						</p>
					</Column>
				</div>

				<Column>
					<TableOfContents
						items={[
							{
								text: 'Create an account',
								relativeLink: '/guides/attendee/attending-an-event#create-an-account'
							},
							{
								text: 'Find an event',
								relativeLink: '/guides/attendee/attending-an-event#find-your-event'
							},
							{
								text: 'Register for an event',
								relativeLink: '/guides/attendee/attending-an-event#registering-for-an-event'
							}
						]}
					/>

					<GuideSection id="create-an-account">
						<GuideSectionHeader
							text="Create an account"
							url={`/guides/attendee/attending-an-event#create-an-account`}
						/>

						<p className="mb-4 text-gray-700">
							Before registering for an event, you will need to{' '}
							<Link href="/auth/signup">
								<a className="text-gray-900 underline">create an account</a>
							</Link>
							. If you need a more detailed guide on creating an account, verifying your account, or
							customizing your account, visit the{' '}
							<Link href="/guides/user/creating-an-account">
								<a className="text-gray-900 underline">creating an account guide</a>
							</Link>
							.
						</p>
					</GuideSection>

					<GuideSection id="find-your-event">
						<GuideSectionHeader
							text="Find your event"
							url={`/guides/attendee/attending-an-event#find-your-event`}
						/>

						<p className="mb-4 text-gray-700">
							Reach out to the event organizer or find an event to attend on the{' '}
							<Link href="/events">
								<a className="text-gray-900 underline">upcoming events page</a>
							</Link>
							.
						</p>
					</GuideSection>

					<GuideSection id="registering-for-an-event" className="my-7">
						<GuideSectionHeader
							text="Registering for an event"
							url={`/guides/attendee/attending-an-event#registering-for-an-event`}
						/>

						<p className="mb-4 text-gray-700">
							Once you have found an event, you can attend it by clicking the{' '}
							<span className="font-medium">"Registering here"</span> button
						</p>
					</GuideSection>

					<GuideSection id="attending-a-session">
						<p className="mb-4 text-gray-700">
							After registering for the event, you can{' '}
							<Link href="/guides/attendee/attending-a-session">
								<a className="text-gray-900 underline">attend a session</a>
							</Link>
							.
						</p>
					</GuideSection>

					<GuideSection>
						<StillNeedHelp />
					</GuideSection>
				</Column>

				<Footer />
			</PageWrapper>
		</>
	);
};

export default AttendingAnEventGuidePage;
