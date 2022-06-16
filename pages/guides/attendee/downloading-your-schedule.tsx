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
import { useUser } from '../../../hooks/queries/useUser';

const AttendingASessionGuidePage: NextPage = () => {
	const { user } = useUser();

	return (
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
			<Navigation />

			<div className="text-white dark-topography">
				<Column className="flex flex-col items-center">
					<h1 className="text-2xl font-bold md:text-3xl">Downloading your schedule</h1>
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
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/attendee/downloading-your-schedule#view-your-schedule`}
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

					<AspectImage
						ratio={1610 / 548}
						imageUrl={'https://cdn.evental.app/images/my-schedule.png'}
						alt={'My Schedule'}
					/>
				</GuideSection>

				<GuideSection id="download-your-schedule">
					<GuideSectionHeader
						text="Download your schedule"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/attendee/downloading-your-schedule#download-your-schedule`}
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

					<AspectImage
						ratio={1613 / 606}
						imageUrl={'https://cdn.evental.app/images/download-your-schedule.png'}
						alt={'Download your schedule'}
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
