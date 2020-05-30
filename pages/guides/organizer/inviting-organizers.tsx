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
		<PageWrapper variant="white">
			<NextSeo
				title="Inviting Organizers — Evental"
				description={`Learn how to invite additional organizers to assist you in setting up your event.`}
				openGraph={{
					url: 'https://evental.app/guides/session/creating-a-session-type',
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
							relativeLink: '/guides/session/creating-a-session-type#navigate-to-the-dashboard'
						},

						{
							text: 'Navigate to the session types dashboard',
							relativeLink:
								'/guides/session/creating-a-session-type#navigate-to-the-session-dashboard'
						},
						{
							text: 'Create a session type',
							relativeLink: '/guides/session/creating-a-session-type#create-a-type'
						}
					]}
				/>

				<GuideSection id="navigate-to-the-dashboard">
					<GuideSectionHeader
						text="Navigate to the dashboard"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/creating-a-session-type#navigate-to-the-dashboard`}
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

				<GuideSection id="navigate-to-the-session-dashboard">
					<GuideSectionHeader
						text="Navigate to the session types dashboard"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/creating-a-session-type#navigate-to-the-session-dashboard`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the events dashboard, click the{' '}
						<span className="font-medium">"Types"</span> page.
					</p>

					<AspectImage
						ratio={1597 / 475}
						imageUrl={'https://cdn.evental.app/images/types-dashboard.png'}
						alt={'Manage this event'}
					/>
				</GuideSection>

				<GuideSection id="create-a-type">
					<GuideSectionHeader
						text="Create a session type"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/creating-a-session-type#create-a-type`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the session type dashboard page, click the{' '}
						<span className="font-medium">"Create Type"</span> button. This will navigate you to the
						create session type page, where you can create a type/category to group sessions.
					</p>

					<AspectImage
						ratio={1602 / 493}
						imageUrl={'https://cdn.evental.app/images/create-a-type.png'}
						alt={'Create a type'}
					/>

					<p className="text-gray-700 my-4">
						Now that you are on the create a type form, fill out the form and click the{' '}
						<span className="font-medium">"Create Type"</span> button.
					</p>

					<AspectImage
						ratio={1607 / 468}
						imageUrl={'https://cdn.evental.app/images/create-type-form.png'}
						alt={'Create a type form'}
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
