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
	navigateRoles: { anchor: 'navigate-to-the-roles-page', title: 'Navigate to the roles page' },
	createRole: { anchor: 'create-a-role', title: 'Create a role' }
};

const CreatingARoleGuidePage: NextPage = () => {
	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Creating a role — Evental"
				description={`Learn how to create a role for your event on Evental.`}
				openGraph={{
					url: 'https://evental.app/guides/role/creating-a-role',
					title: 'Creating a role — Evental',
					description: `Learn how to create a role for your event on Evental.`,
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
					<h1 className="text-2xl font-bold md:text-3xl">Creating a role</h1>
					<p className="mt-4 text-base text-gray-100">
						Learn how to create a role for your event on Evental.
					</p>
				</Column>
			</div>

			<Column>
				<TableOfContents
					items={[
						{
							text: sections.navigateDashboard.title,
							relativeLink: `/guides/role/creating-a-role#${sections.navigateDashboard.anchor}`
						},
						{
							text: sections.navigateRoles.title,
							relativeLink: `/guides/role/creating-a-role#${sections.navigateRoles.anchor}`
						},
						{
							text: sections.createRole.title,
							relativeLink: `/guides/role/creating-a-role#${sections.createRole.anchor}`
						}
					]}
				/>

				<GuideSection id={sections.navigateDashboard.anchor}>
					<GuideSectionHeader
						text={sections.navigateDashboard.title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/role/creating-a-role#${sections.navigateDashboard.anchor}`}
					/>

					<p className="mb-4 text-gray-700">
						To create a role, navigate to the events admin dashboard by clicking the{' '}
						<span className="font-medium">"manage this event"</span> button.
					</p>

					<AspectImage
						ratio={1603 / 798}
						imageUrl={'https://cdn.evental.app/images/manage-this-event.png'}
						alt={'Manage this event'}
					/>
				</GuideSection>

				<GuideSection id={sections.navigateRoles.anchor}>
					<GuideSectionHeader
						text={sections.navigateRoles.title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/role/creating-a-role#${sections.navigateRoles.anchor}`}
					/>

					<p className="mb-4 text-gray-700">
						After visiting the events dashboard, click the{' '}
						<span className="font-medium">"Roles"</span> link in the top navigation.
					</p>
				</GuideSection>

				<GuideSection id={sections.createRole.anchor}>
					<GuideSectionHeader
						text={sections.createRole.title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/role/creating-a-role#${sections.createRole.anchor}`}
					/>

					<p className="mb-4 text-gray-700">
						After visiting the roles dashboard page, select the{' '}
						<span className="font-medium">"Create"</span> button.
					</p>

					<p className="mb-4 text-gray-700">
						After selecting the "Create" button. You will be navigated to a form. Fill out that form
						to create a role.
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

export default CreatingARoleGuidePage;
