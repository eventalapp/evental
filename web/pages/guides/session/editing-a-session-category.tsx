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
	navigateSessionCategories: {
		anchor: 'navigate-to-the-session-categories-page',
		title: 'Navigate to the session categories page'
	},
	editSessionCategory: { anchor: 'edit-a-session-type', title: 'Edit a session category' }
};

const EditingASessionCategoryGuidePage: NextPage = () => {
	return (
		<>
			<Navigation />

			<PageWrapper>
				<NextSeo
					title="Editing a session category — Evental"
					description={`Learn how to edit a session category for your event on Evental.`}
					openGraph={{
						url: 'https://evental.app/guides/session/editing-a-session-type',
						title: 'Editing a session category — Evental',
						description: `Learn how to edit a session category for your event on Evental.`,
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
						<Heading>Editing a session category</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to edit a session category for your event on Evental.
						</p>
					</Column>
				</div>

				<Column>
					<TableOfContents
						items={[
							{
								text: sections.navigateDashboard.title,
								relativeLink: `/guides/session/editing-a-session-type#${sections.navigateDashboard.anchor}`
							},
							{
								text: sections.navigateSessionCategories.title,
								relativeLink: `/guides/session/editing-a-session-type#${sections.navigateSessionCategories.anchor}`
							},
							{
								text: sections.editSessionCategory.title,
								relativeLink: `/guides/session/editing-a-session-type#${sections.editSessionCategory.anchor}`
							}
						]}
					/>

					<GuideSection id={sections.navigateDashboard.anchor}>
						<GuideSectionHeader
							text={sections.navigateDashboard.title}
							url={`/guides/session/editing-a-session-type#${sections.navigateDashboard.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							To edit a session category, navigate to the events admin dashboard by clicking the{' '}
							<span className="font-medium">"manage this event"</span> button.
						</p>
					</GuideSection>

					<GuideSection id={sections.navigateSessionCategories.anchor}>
						<GuideSectionHeader
							text={sections.navigateSessionCategories.title}
							url={`/guides/session/editing-a-session-type#${sections.navigateSessionCategories.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the events dashboard, click the{' '}
							<span className="font-medium">"Types"</span> link in the top navigation.
						</p>
					</GuideSection>

					<GuideSection id={sections.editSessionCategory.anchor}>
						<GuideSectionHeader
							text={sections.editSessionCategory.title}
							url={`/guides/session/editing-a-session-type#${sections.editSessionCategory.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the session categories dashboard page, select the session category you
							wish to edit by clicking the session category.
						</p>
						<p className="mb-4 text-gray-700">
							After selecting a session category, select the{' '}
							<span className="font-medium">"Edit"</span> button.
						</p>

						<p className="mb-4 text-gray-700">
							After selecting the "Edit" button. You will be navigated to the edit session category
							form. Fill out the edit session category form to edit a session category.
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

export default EditingASessionCategoryGuidePage;
