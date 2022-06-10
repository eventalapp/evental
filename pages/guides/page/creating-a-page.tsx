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
		<PageWrapper variant="white">
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
			<Navigation />

			<div className="dark-topography text-white">
				<Column className="flex flex-col items-center">
					<h1 className="text-2xl md:text-3xl font-bold">Creating a page</h1>
					<p className="text-gray-100 text-md mt-4">
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
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/page/creating-a-page#${sections.navigateDashboard.anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						To create a page, navigate to the events admin dashboard by clicking the{' '}
						<span className="font-medium">"manage this event"</span> button.
					</p>

					<AspectImage
						ratio={1603 / 798}
						imageUrl={'https://cdn.evental.app/images/manage-this-event.png'}
						alt={'Manage this event'}
					/>
				</GuideSection>

				<GuideSection id={sections.navigatePages.anchor}>
					<GuideSectionHeader
						text={sections.navigatePages.title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/page/creating-a-page#${sections.navigatePages.anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the events dashboard, click the{' '}
						<span className="font-medium">"Pages"</span> link in the top navigation.
					</p>
				</GuideSection>

				<GuideSection id={sections.createPage.anchor}>
					<GuideSectionHeader
						text={sections.createPage.title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/page/creating-a-page#${sections.createPage.anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the pages dashboard page, select the{' '}
						<span className="font-medium">"Create"</span> button.
					</p>

					<p className="text-gray-700 mb-4">
						After selecting the "Create" button. You will be navigated to a form. Fill out that form
						to create a page.
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

export default CreatingAPageGuidePage;