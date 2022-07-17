import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
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

const CreatingASessionCategoryGuidePage: NextPage = () => {
	return (
		<>
			<Navigation />

			<PageWrapper>
				<NextSeo
					title="Creating a session category — Evental"
					description={`Learn how to create a session category for your event on Evental.`}
					openGraph={{
						url: 'https://evental.app/guides/session/creating-a-session-type',
						title: 'Creating a session category — Evental',
						description: `Learn how to create a session category for your event on Evental.`,
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
						<Heading>Creating a session category</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to create a session category for your event on Evental.
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
								text: 'Navigate to the session categories dashboard',
								relativeLink:
									'/guides/session/creating-a-session-type#navigate-to-the-session-dashboard'
							},
							{
								text: 'Create a session category',
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
							text="Navigate to the session categories dashboard"
							url={`/guides/session/creating-a-session-type#navigate-to-the-session-dashboard`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the events dashboard, click the{' '}
							<span className="font-medium">"Types"</span> page.
						</p>
					</GuideSection>

					<GuideSection id="create-a-type">
						<GuideSectionHeader
							text="Create a session category"
							url={`/guides/session/creating-a-session-type#create-a-type`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the session category dashboard page, click the{' '}
							<span className="font-medium">"Create Type"</span> button. This will navigate you to
							the create session category page, where you can create a type/category to group
							sessions.
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
		</>
	);
};

export default CreatingASessionCategoryGuidePage;
