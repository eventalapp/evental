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

const sections: Section[] = [
	{ anchor: 'navigate-to-the-dashboard', title: 'Navigate to the dashboard' },
	{ anchor: 'navigate-to-the-attendees-page', title: 'Navigate to the attendees page' },
	{ anchor: 'select-an-attendee', title: 'Select an attendee' },
	{ anchor: 'edit-an-attendee', title: 'Edit an attendee' }
];

const InvitingSessionMemberGuidePage: NextPage = () => {
	return (
		<>
			<Navigation />

			<PageWrapper>
				<NextSeo
					title="Granting the Organizer role — Evental"
					description={`Learn how to grant the organizer role to an attendee for your event on Evental.`}
					openGraph={{
						url: 'https://evental.app/guides/organizer/granting-the-organizer-role',
						title: 'Granting the Organizer role — Evental',
						description: `Learn how to grant the organizer role to an attendee for your event on Evental.`,
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
						<Heading>Granting the Organizer role — Evental</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to grant the organizer role to an attendee for your event on Evental
						</p>
					</Column>
				</div>

				<Column>
					<TableOfContents
						items={[
							{
								text: sections[0].title,
								relativeLink: `/guides/organizer/granting-the-organizer-role#${sections[0].anchor}`
							},
							{
								text: sections[1].title,
								relativeLink: `/guides/organizer/granting-the-organizer-role#${sections[1].anchor}`
							},
							{
								text: sections[2].title,
								relativeLink: `/guides/organizer/granting-the-organizer-role#${sections[2].anchor}`
							},
							{
								text: sections[3].title,
								relativeLink: `/guides/organizer/granting-the-organizer-role#${sections[3].anchor}`
							}
						]}
					/>

					<GuideSection id={sections[0].anchor}>
						<GuideSectionHeader
							text={sections[0].title}
							url={`/guides/organizer/granting-the-organizer-role#${sections[0].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							To grant the organizer permission role to an attendee, navigate to the events admin
							dashboard by clicking the <span className="font-medium">"manage this event"</span>{' '}
							button.
						</p>
					</GuideSection>

					<GuideSection id={sections[1].anchor}>
						<GuideSectionHeader
							text={sections[1].title}
							url={`/guides/organizer/granting-the-organizer-role#${sections[1].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the events dashboard, click the{' '}
							<span className="font-medium">"Attendees"</span> link in the top navigation.
						</p>
					</GuideSection>

					<GuideSection id={sections[2].anchor}>
						<GuideSectionHeader
							text={sections[2].title}
							url={`/guides/organizer/granting-the-organizer-role#${sections[2].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the attendees dashboard page, select the attendee you wish to grant the
							organizer role to.
						</p>
					</GuideSection>
					<GuideSection id={sections[3].anchor}>
						<GuideSectionHeader
							text={sections[3].title}
							url={`/guides/organizer/granting-the-organizer-role#${sections[3].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After selecting and viewing an attendee. Select the{' '}
							<span className="font-medium">"Edit"</span> button
						</p>

						<p className="mb-4 text-gray-700">
							After visiting the edit attendee form. Select the{' '}
							<span className="font-medium">"Permission Role"</span> dropdown, and select{' '}
							<span className="font-medium">"Organizer"</span>
						</p>

						<p className="mb-4 text-gray-700">
							After selecting the organizer option in the permission role dropdown, click the{' '}
							<span className="font-medium">"Save"</span> button.
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

export default InvitingSessionMemberGuidePage;
