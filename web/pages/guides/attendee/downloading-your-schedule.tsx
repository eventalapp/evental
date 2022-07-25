import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { useUser } from '@eventalapp/shared/hooks';

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
	const { data: user } = useUser();

	return (
		<>
			<Navigation />

			<PageWrapper>
				<NextSeo
					title="Downloading your schedule — Evental"
					description={`Learn how to view and download your schedule on evental.`}
					openGraph={{
						url: 'https://evental.app/guides/attendee/downloading-your-schedule',
						title: 'Downloading your schedule — Evental',
						description: `Learn how to view and download your schedule on evental.`,
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
						<Heading>Downloading your schedule</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to view and download your schedule on evental.
						</p>
					</Column>
				</div>

				<Column>
					<TableOfContents
						items={[
							{
								text: 'View your schedule',
								relativeLink: '/guides/attendee/downloading-your-schedule#view-your-schedule'
							},
							{
								text: 'Download your schedule',
								relativeLink: '/guides/attendee/downloading-your-schedule#download-your-schedule'
							},
							{
								text: 'Create a session',
								relativeLink: '/guides/session/creating-a-session#create-a-session'
							}
						]}
					/>

					<GuideSection id="view-your-schedule">
						<GuideSectionHeader
							text="View your schedule"
							url={`/guides/attendee/downloading-your-schedule#view-your-schedule`}
						/>

						<p className="mb-4 text-gray-700">
							You can view your schedule at the{' '}
							{user ? (
								<Link href={`/users/${user.slug}/schedule`}>
									<a className="text-gray-900 underline">my schedule page</a>
								</Link>
							) : (
								'my schedule page, which can be found by signing in and clicking the top right user icon and selecting "Schedule"'
							)}
							.
						</p>
					</GuideSection>

					<GuideSection id="download-your-schedule">
						<GuideSectionHeader
							text="Download your schedule"
							url={`/guides/attendee/downloading-your-schedule#download-your-schedule`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the schedule page, you can download your schedule by clicking the{' '}
							<span className="font-medium">"Download Schedule (Excel)"</span> button. If you would
							like more export options, please fill out a feature request{' '}
							<Link href="/support">
								<a className="text-gray-900 underline">support ticket</a>
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

export default AttendingASessionGuidePage;
