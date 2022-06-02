import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
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

const CreatingASessionTypeGuidePage: NextPage = () => {
	return (
		<PageWrapper>
			<NextSeo
				title="Inviting Organizers — Evental"
				description={`Learn how to invite additional organizers to assist you in setting up your event.`}
				openGraph={{
					url: 'https://evental.app/guides/organizer/inviting-organizers',
					title: 'Inviting Organizers — Evental',
					description: `Learn how to invite additional organizers to assist you in setting up your event.`,
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
					<h1 className="text-2xl md:text-3xl font-bold">Inviting Organizers</h1>
					<p className="text-gray-100 text-md mt-4">
						Learn how to invite additional organizers to assist you in setting up your event.
					</p>
				</Column>
			</div>

			<Column>
				<TableOfContents
					items={[
						{
							text: 'Navigate to the events dashboard',
							relativeLink: '/guides/organizer/inviting-organizers#navigate-to-the-dashboard'
						},

						{
							text: 'Navigate to the organizer dashboard',
							relativeLink:
								'/guides/organizer/inviting-organizers#navigate-to-the-organizer-dashboard'
						},
						{
							text: 'Invite an organizer',
							relativeLink: '/guides/organizer/inviting-organizers#invite-an-organizer'
						}
					]}
				/>

				<GuideSection id="navigate-to-the-dashboard">
					<GuideSectionHeader
						text="Navigate to the dashboard"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/organizer/inviting-organizers#navigate-to-the-dashboard`}
					/>

					<p className="text-gray-700 mb-4">
						First navigate to your event and sign in (if required).
					</p>

					<p className="text-gray-700 mb-4">
						Then navigate to the events admin dashboard by clicking the{' '}
						<span className="font-medium">"manage this event"</span> button.
					</p>

					<AspectImage
						ratio={1603 / 798}
						imageUrl={'https://cdn.evental.app/images/manage-this-event.png'}
						alt={'Manage this event'}
					/>
				</GuideSection>

				<GuideSection id="navigate-to-the-organizer-dashboard">
					<GuideSectionHeader
						text="Navigate to the organizer dashboard"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/organizer/inviting-organizers#navigate-to-the-organizer-dashboard`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the events dashboard, click the{' '}
						<span className="font-medium">"Organizers"</span> page.
					</p>

					<AspectImage
						ratio={1606 / 408}
						imageUrl={'https://cdn.evental.app/images/organizer-dashboard.png'}
						alt={'Organizer dashboard'}
					/>
				</GuideSection>

				<GuideSection id="invite-an-organizer">
					<GuideSectionHeader
						text="Invite an organizer"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/organizer/inviting-organizers#invite-an-organizer`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the organizer dashboard page, click the{' '}
						<span className="font-medium">"Invite Organizer"</span> button. This will navigate you
						to the organizer invite page, where you can fill out the form and invite an organizer to
						your event.
					</p>

					<AspectImage
						ratio={1604 / 473}
						imageUrl={'https://cdn.evental.app/images/invite-organizer-form.png'}
						alt={'Invite organizer form'}
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

export default CreatingASessionTypeGuidePage;
