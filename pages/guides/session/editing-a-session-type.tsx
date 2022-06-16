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
	navigateSessionTypes: {
		anchor: 'navigate-to-the-session-types-page',
		title: 'Navigate to the session types page'
	},
	editSessionType: { anchor: 'edit-a-session-type', title: 'Edit a session type' }
};

const EditingASessionTypeGuidePage: NextPage = () => {
	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Editing a session type — Evental"
				description={`Learn how to edit a session type for your event on Evental.`}
				openGraph={{
					url: 'https://evental.app/guides/session/editing-a-session-type',
					title: 'Editing a session type — Evental',
					description: `Learn how to edit a session type for your event on Evental.`,
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
					<h1 className="text-2xl font-bold md:text-3xl">Editing a session type</h1>
					<p className="mt-4 text-base text-gray-100">
						Learn how to edit a session type for your event on Evental.
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
							text: sections.navigateSessionTypes.title,
							relativeLink: `/guides/session/editing-a-session-type#${sections.navigateSessionTypes.anchor}`
						},
						{
							text: sections.editSessionType.title,
							relativeLink: `/guides/session/editing-a-session-type#${sections.editSessionType.anchor}`
						}
					]}
				/>

				<GuideSection id={sections.navigateDashboard.anchor}>
					<GuideSectionHeader
						text={sections.navigateDashboard.title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/editing-a-session-type#${sections.navigateDashboard.anchor}`}
					/>

					<p className="mb-4 text-gray-700">
						To edit a session type, navigate to the events admin dashboard by clicking the{' '}
						<span className="font-medium">"manage this event"</span> button.
					</p>

					<AspectImage
						ratio={1603 / 798}
						imageUrl={'https://cdn.evental.app/images/manage-this-event.png'}
						alt={'Manage this event'}
					/>
				</GuideSection>

				<GuideSection id={sections.navigateSessionTypes.anchor}>
					<GuideSectionHeader
						text={sections.navigateSessionTypes.title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/editing-a-session-type#${sections.navigateSessionTypes.anchor}`}
					/>

					<p className="mb-4 text-gray-700">
						After visiting the events dashboard, click the{' '}
						<span className="font-medium">"Types"</span> link in the top navigation.
					</p>
				</GuideSection>

				<GuideSection id={sections.editSessionType.anchor}>
					<GuideSectionHeader
						text={sections.editSessionType.title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/editing-a-session-type#${sections.editSessionType.anchor}`}
					/>

					<p className="mb-4 text-gray-700">
						After visiting the session types dashboard page, select the session type you wish to
						edit by clicking the session type.
					</p>
					<p className="mb-4 text-gray-700">
						After selecting a session type, select the <span className="font-medium">"Edit"</span>{' '}
						button.
					</p>

					<p className="mb-4 text-gray-700">
						After selecting the "Edit" button. You will be navigated to the edit session type form.
						Fill out the edit session type form to edit a session type.
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

export default EditingASessionTypeGuidePage;
