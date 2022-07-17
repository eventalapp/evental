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
	navigateSessions: {
		anchor: 'navigate-to-the-sessions-page',
		title: 'Navigate to the sessions page'
	},
	editSession: { anchor: 'edit-a-session', title: 'Edit a session' }
};

const EditingASessionGuidePage: NextPage = () => {
	return (
		<>
			<Navigation />

			<PageWrapper>
				<NextSeo
					title="Editing a session — Evental"
					description={`Learn how to edit a session for your event on Evental.`}
					openGraph={{
						url: 'https://evental.app/guides/session/editing-a-session',
						title: 'Editing a session — Evental',
						description: `Learn how to edit a session for your event on Evental.`,
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
						<Heading>Editing a session</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to edit a session for your event on Evental.
						</p>
					</Column>
				</div>

				<Column>
					<TableOfContents
						items={[
							{
								text: sections.navigateDashboard.title,
								relativeLink: `/guides/session/editing-a-session#${sections.navigateDashboard.anchor}`
							},
							{
								text: sections.navigateSessions.title,
								relativeLink: `/guides/session/editing-a-session#${sections.navigateSessions.anchor}`
							},
							{
								text: sections.editSession.title,
								relativeLink: `/guides/session/editing-a-session#${sections.editSession.anchor}`
							}
						]}
					/>

					<GuideSection id={sections.navigateDashboard.anchor}>
						<GuideSectionHeader
							text={sections.navigateDashboard.title}
							url={`/guides/session/editing-a-session#${sections.navigateDashboard.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							To edit a session, navigate to the events admin dashboard by clicking the{' '}
							<span className="font-medium">"manage this event"</span> button.
						</p>
					</GuideSection>

					<GuideSection id={sections.navigateSessions.anchor}>
						<GuideSectionHeader
							text={sections.navigateSessions.title}
							url={`/guides/session/editing-a-session#${sections.navigateSessions.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the events dashboard, click the{' '}
							<span className="font-medium">"Sessions"</span> link in the top navigation.
						</p>
					</GuideSection>

					<GuideSection id={sections.editSession.anchor}>
						<GuideSectionHeader
							text={sections.editSession.title}
							url={`/guides/session/editing-a-session#${sections.editSession.anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the sessions dashboard page, select the session you wish to edit by
							clicking the session.
						</p>
						<p className="mb-4 text-gray-700">
							After selecting a session, select the <span className="font-medium">"Edit"</span>{' '}
							button.
						</p>

						<p className="mb-4 text-gray-700">
							After selecting the "Edit" button. You will be navigated to the edit session form.
							Fill out the edit session form to edit a session.
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

export default EditingASessionGuidePage;
