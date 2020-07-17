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

const AttendingASessionGuidePage: NextPage = () => {
	return (
		<>
			<Navigation />

			<PageWrapper>
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

				<div className="bg-primary-700 text-white">
					<Column className="flex flex-col items-center">
						<Heading>Attending a session</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to attend a session on evental.
						</p>
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
							url={`/guides/attendee/attending-a-session#find-an-event`}
						/>

						<p className="mb-4 text-gray-700">
							Before registering for a session, you will need to{' '}
							<Link href="/guides/attendee/attending-an-event">
								<a className="text-gray-900 underline">find & register for an event</a>
							</Link>
							.
						</p>
					</GuideSection>

					<GuideSection id="find-a-session">
						<GuideSectionHeader
							text="Find a session"
							url={`/guides/attendee/attending-a-session#find-a-session`}
						/>

						<p className="mb-4 text-gray-700">
							After registering for the event, you can find a session on the events sessions page.
						</p>
					</GuideSection>

					<GuideSection id="register-for-a-session">
						<GuideSectionHeader
							text="Registering for a session"
							url={`/guides/attendee/attending-a-session#register-for-a-session`}
						/>

						<p className="mb-4 text-gray-700">
							Once you have found a session, you can attend it by hovering on the session you want
							to attend, and clicking the <span className="font-medium">"Register"</span> button.
						</p>

						<p className="my-4 text-gray-700">
							Or you can click on the session you want to attend, and select the{' '}
							<span className="font-medium">"Attend this session"</span> button.
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

export default AttendingASessionGuidePage;
