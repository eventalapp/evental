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

type Section = {
	anchor: string;
	title: string;
};

const sections: Record<string, Section> = {
	navigateDashboard: { anchor: 'navigate-to-the-dashboard', title: 'Navigate to the dashboard' },
	navigateVenues: { anchor: 'navigate-to-the-venues-page', title: 'Navigate to the venues page' },
	createVenue: { anchor: 'create-a-venue', title: 'Create a venue' }
};

const CreatingASessionGuidePage: NextPage = () => {
	return (
		<>
			<Navigation />

			<PageWrapper>
				<NextSeo
					title="Creating a venue — Evental"
					description={`Learn how to create a venue for your event on Evental.`}
					openGraph={{
						url: 'https://evental.app/guides/venue/creating-a-venue',
						title: 'Creating a venue — Evental',
						description: `Learn how to create a venue for your event on Evental.`,
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
						<Heading>Creating a venue</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to create a venue for your event on Evental.
						</p>
					</Column>
				</div>

				<Column>
					<TableOfContents
						items={[
							{
								text: sections.navigateDashboard.title,
								relativeLink: `/guides/venue/creating-a-venue#${sections.navigateDashboard.anchor}`
							},
							{
								text: sections.navigateVenues.title,
								relativeLink: `/guides/venue/creating-a-venue#${sections.navigateVenues.anchor}`
							},
							{
								text: sections.createVenue.title,
								relativeLink: `/guides/venue/creating-a-venue#${sections.createVenue.anchor}`
							}
						]}
					/>

					<GuideSection id={sections.navigateDashboard.anchor}>
						<GuideSectionHeader
							text={sections.navigateDashboard.title}
							url={`/guides/venue/creating-a-venue#${sections.navigateDashboard.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							To create a session, navigate to the events admin dashboard by clicking the{' '}
							<span className="font-medium">"manage this event"</span> button.
						</p>
					</GuideSection>

					<GuideSection id={sections.navigateVenues.anchor}>
						<GuideSectionHeader
							text={sections.navigateVenues.title}
							url={`/guides/venue/creating-a-venue#${sections.navigateVenues.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the events dashboard, click the{' '}
							<span className="font-medium">"Venues"</span> link in the top navigation.
						</p>
					</GuideSection>

					<GuideSection id={sections.createVenue.anchor}>
						<GuideSectionHeader
							text={sections.createVenue.title}
							url={`/guides/venue/creating-a-venue#${sections.createVenue.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the venues dashboard page, select the{' '}
							<span className="font-medium">"Create"</span> button.
						</p>

						<p className="mb-4 text-gray-700">
							After selecting the "Create" button. You will be navigated to the create venue form.
							Fill out the create venue form to create a venue.
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

export default CreatingASessionGuidePage;
