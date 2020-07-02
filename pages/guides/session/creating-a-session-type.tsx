import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { Footer } from '../../../components/Footer';
import { GuideSection } from '../../../components/guides/GuideSection';
import { GuideSectionHeader } from '../../../components/guides/GuideSectionHeader';
import { StillNeedHelp } from '../../../components/guides/StillNeedHelp';
import { TableOfContents } from '../../../components/guides/TableOfContents';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { Heading } from '../../../components/typography/Heading';

const CreatingASessionCategoryGuidePage: NextPage = () => {
	return (
		<PageWrapper>
			<NextSeo
				title="Creating a session type — Evental"
				description={`Learn how to create a session type for your event on Evental.`}
				openGraph={{
					url: 'https://evental.app/guides/session/creating-a-session-type',
					title: 'Creating a session type — Evental',
					description: `Learn how to create a session type for your event on Evental.`,
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
					<Heading>Creating a session type</Heading>
					<p className="mt-4 text-base text-gray-100">
						Learn how to create a session type for your event on Evental.
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
						url={`/guides/session/creating-a-session-type#navigate-to-the-dashboard`}
					/>

					<p className="mb-4 text-gray-700">
						To create a session, navigate to the events admin dashboard by clicking the{' '}
						<span className="font-medium">"manage this event"</span> button.
					</p>
				</GuideSection>

				<GuideSection id="navigate-to-the-session-dashboard">
					<GuideSectionHeader
						text="Navigate to the session types dashboard"
						url={`/guides/session/creating-a-session-type#navigate-to-the-session-dashboard`}
					/>

					<p className="mb-4 text-gray-700">
						After visiting the events dashboard, click the{' '}
						<span className="font-medium">"Types"</span> page.
					</p>
				</GuideSection>

				<GuideSection id="create-a-type">
					<GuideSectionHeader
						text="Create a session type"
						url={`/guides/session/creating-a-session-type#create-a-type`}
					/>

					<p className="mb-4 text-gray-700">
						After visiting the session type dashboard page, click the{' '}
						<span className="font-medium">"Create Type"</span> button. This will navigate you to the
						create session type page, where you can create a type/category to group sessions.
					</p>

					<p className="my-4 text-gray-700">
						Now that you are on the create a type form, fill out the form and click the{' '}
						<span className="font-medium">"Create Type"</span> button.
					</p>
				</GuideSection>

				<GuideSection>
					<StillNeedHelp />
				</GuideSection>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default CreatingASessionCategoryGuidePage;
