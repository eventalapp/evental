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
	navigatePages: {
		anchor: 'navigate-to-the-pages-page',
		title: 'Navigate to the pages dashboard page'
	},
	createPage: { anchor: 'create-a-page', title: 'Create a page' }
};

const CreatingAPageGuidePage: NextPage = () => {
	return (
		<>
			<Navigation />

			<PageWrapper>
				<NextSeo
					title="Creating a page — Evental"
					description={`Learn how to create a page for your event on Evental.`}
					openGraph={{
						url: 'https://evental.app/guides/page/creating-a-page',
						title: 'Creating a page — Evental',
						description: `Learn how to create a page for your event on Evental.`,
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
						<Heading>Creating a page</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to create a page for your event on Evental.
						</p>
					</Column>
				</div>

				<Column>
					<TableOfContents
						items={[
							{
								text: sections.navigateDashboard.title,
								relativeLink: `/guides/page/creating-a-page#${sections.navigateDashboard.anchor}`
							},
							{
								text: sections.navigatePages.title,
								relativeLink: `/guides/page/creating-a-page#${sections.navigatePages.anchor}`
							},
							{
								text: sections.createPage.title,
								relativeLink: `/guides/page/creating-a-page#${sections.createPage.anchor}`
							}
						]}
					/>

					<GuideSection id={sections.navigateDashboard.anchor}>
						<GuideSectionHeader
							text={sections.navigateDashboard.title}
							url={`/guides/page/creating-a-page#${sections.navigateDashboard.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							To create a page, navigate to the events admin dashboard by clicking the{' '}
							<span className="font-medium">"manage this event"</span> button.
						</p>
					</GuideSection>

					<GuideSection id={sections.navigatePages.anchor}>
						<GuideSectionHeader
							text={sections.navigatePages.title}
							url={`/guides/page/creating-a-page#${sections.navigatePages.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the events dashboard, click the{' '}
							<span className="font-medium">"Pages"</span> link in the top navigation.
						</p>
					</GuideSection>

					<GuideSection id={sections.createPage.anchor}>
						<GuideSectionHeader
							text={sections.createPage.title}
							url={`/guides/page/creating-a-page#${sections.createPage.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the pages dashboard page, select the{' '}
							<span className="font-medium">"Create"</span> button.
						</p>

						<p className="mb-4 text-gray-700">
							After selecting the "Create" button. You will be navigated to a form. Fill out that
							form to create a page.
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

export default CreatingAPageGuidePage;
