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

				<div className="bg-primary-700 text-white">
					<Column className="flex flex-col items-center">
						<Heading>Inviting Organizers</Heading>
						<p className="mt-4 text-base text-gray-100">
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
							url={`/guides/organizer/inviting-organizers#navigate-to-the-dashboard`}
						/>

						<p className="mb-4 text-gray-700">
							First navigate to your event and sign in (if required).
						</p>

						<p className="mb-4 text-gray-700">
							Then navigate to the events admin dashboard by clicking the{' '}
							<span className="font-medium">"manage this event"</span> button.
						</p>
					</GuideSection>

					<GuideSection id="navigate-to-the-organizer-dashboard">
						<GuideSectionHeader
							text="Navigate to the organizer dashboard"
							url={`/guides/organizer/inviting-organizers#navigate-to-the-organizer-dashboard`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the events dashboard, click the{' '}
							<span className="font-medium">"Organizers"</span> page.
						</p>
					</GuideSection>

					<GuideSection id="invite-an-organizer">
						<GuideSectionHeader
							text="Invite an organizer"
							url={`/guides/organizer/inviting-organizers#invite-an-organizer`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the organizer dashboard page, click the{' '}
							<span className="font-medium">"Invite Organizer"</span> button. This will navigate you
							to the organizer invite page, where you can fill out the form and invite an organizer
							to your event.
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
