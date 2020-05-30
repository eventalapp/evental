import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { Footer } from '../../../components/Footer';
import { AspectImage } from '../../../components/guides/AspectImage';
import { GuideSection } from '../../../components/guides/GuideSection';
import { GuideSectionHeader } from '../../../components/guides/GuideSectionHeader';
import { StillNeedHelp } from '../../../components/guides/StillNeedHelp';
import { TableOfContents } from '../../../components/guides/TableOfContents';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';

const AttendingASessionGuidePage: NextPage = () => {
	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Attending a session — Evental"
				description={`Learn how to attend a session on evental.`}
				openGraph={{
					url: 'https://evental.app/guides/attendee/attending-a-session',
					title: 'Attending a session — Evental',
					description: `Learn how to attend a session on evental.`,
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
					<h1 className="text-2xl md:text-3xl font-bold">Attending a session</h1>
					<p className="text-gray-100 text-md mt-4">Learn how to attend a session on evental.</p>
				</Column>
			</div>

			<Column>
				<TableOfContents
					items={[
						{
							text: 'Find an event',
							relativeLink: '/guides/attendee/attending-a-session#find-an-event'
						},
						{
							text: 'Find a session',
							relativeLink: '/guides/attendee/attending-a-session#find-your-event'
						},
						{
							text: 'Register for a session',
							relativeLink: '/guides/attendee/attending-a-session#register-for-a-session'
						}
					]}
				/>

				<GuideSection id="find-an-event">
					<GuideSectionHeader
						text="Find an event"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/attendee/attending-a-session#find-an-event`}
					/>

					<p className="text-gray-700 mb-4">
						Before registering for a session, you will need to{' '}
						<Link href="/guides/attendee/attending-an-event">
							<a className="underline text-gray-900">find & register for an event</a>
						</Link>
						.
					</p>

					<AspectImage
						ratio={1580 / 502}
						imageUrl={'https://cdn.evental.app/images/upcoming-events.png'}
						alt={'Upcoming events page'}
					/>
				</GuideSection>

				<GuideSection id="find-a-session">
					<GuideSectionHeader
						text="Find a session"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/attendee/attending-a-session#find-a-session`}
					/>

					<p className="text-gray-700 mb-4">
						After registering for the event, you can find a session on the events sessions page.
					</p>

					<AspectImage
						ratio={1602 / 753}
						imageUrl={'https://cdn.evental.app/images/find-a-session.png'}
						alt={'Find a session'}
					/>
				</GuideSection>

				<GuideSection id="register-for-a-session">
					<GuideSectionHeader
						text="Registering for a session"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/attendee/attending-a-session#register-for-a-session`}
					/>

					<p className="text-gray-700 mb-4">
						Once you have found a session, you can attend it by hovering on the session you want to
						attend, and clicking the <span className="font-medium">"Register"</span> button.
					</p>

					<AspectImage
						ratio={1594 / 730}
						imageUrl={'https://cdn.evental.app/images/register-for-a-session1.png'}
						alt={'Register for a session 1'}
					/>

					<p className="text-gray-700 my-4">
						Or you can click on the session you want to attend, and select the{' '}
						<span className="font-medium">"Attend this session"</span> button.
					</p>

					<AspectImage
						ratio={1599 / 537}
						imageUrl={'https://cdn.evental.app/images/register-for-a-session2.png'}
						alt={'Register for a session 2'}
					/>
				</GuideSection>

				<GuideSection>
					<StillNeedHelp />
				</GuideSection>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default AttendingASessionGuidePage;
