import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
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
	{ anchor: 'navigate-to-the-sessions-page', title: 'Navigate to the sessions page' },
	{ anchor: 'select-a-session', title: 'Select a session' },
	{ anchor: 'attach-a-role-member', title: 'Attach a role member' }
];

const InvitingSessionMemberGuidePage: NextPage = () => {
	return (
		<>
			<Navigation />

			<PageWrapper>
				<NextSeo
					title="Attach a role member — Evental"
					description={`Learn how to attach a role member to your session on Evental.`}
					openGraph={{
						url: 'https://evental.app/guides/session/attaching-a-role-member',
						title: 'Attach a role member — Evental',
						description: `Learn how to attach a role member to your session on Evental.`,
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
						<Heading>Attach a role member — Evental</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to attach a role member to your session on Evental
						</p>
					</Column>
				</div>

				<Column>
					<TableOfContents
						items={[
							{
								text: sections[0].title,
								relativeLink: `/guides/session/attaching-a-role-member#${sections[0].anchor}`
							},
							{
								text: sections[1].title,
								relativeLink: `/guides/session/attaching-a-role-member#${sections[1].anchor}`
							},
							{
								text: sections[2].title,
								relativeLink: `/guides/session/attaching-a-role-member#${sections[2].anchor}`
							},
							{
								text: sections[3].title,
								relativeLink: `/guides/session/attaching-a-role-member#${sections[3].anchor}`
							}
						]}
					/>

					<GuideSection id={sections[0].anchor}>
						<GuideSectionHeader
							text={sections[0].title}
							url={`/guides/session/attaching-a-role-member#${sections[0].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							To attach a role member to a session, navigate to the events admin dashboard by
							clicking the <span className="font-medium">"manage this event"</span> button.
						</p>
					</GuideSection>

					<GuideSection id={sections[1].anchor}>
						<GuideSectionHeader
							text={sections[1].title}
							url={`/guides/session/attaching-a-role-member#${sections[1].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the events dashboard, click the{' '}
							<span className="font-medium">"Sessions"</span> link in the top navigation.
						</p>
					</GuideSection>

					<GuideSection id={sections[2].anchor}>
						<GuideSectionHeader
							text={sections[2].title}
							url={`/guides/session/attaching-a-role-member#${sections[2].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the sessions dashboard page, select the session you wish to attach role
							to.
						</p>
					</GuideSection>
					<GuideSection id={sections[3].anchor}>
						<GuideSectionHeader
							text={sections[3].title}
							url={`/guides/session/attaching-a-role-member#${sections[3].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After selecting and viewing a session. Select the{' '}
							<span className="font-medium">"Edit"</span> button
						</p>

						<p className="mb-4 text-gray-700">
							After visiting the edit session form. Select the{' '}
							<span className="font-medium">"Attach People"</span> button
						</p>

						<p className="mb-4 text-gray-700">
							A modal will appear, and you can start typing in the attendees name, and once you see
							the desired attendee, click the plus button. If you do not see the attendee you are
							looking for, they may not be attending you event. See the{' '}
							<Link href="/guides/role/inviting-a-role-member">
								<a className="text-gray-900 underline">invite a role member guide</a>
							</Link>{' '}
							or{' '}
							<Link href="/guides/role/creating-a-role-member">
								<a className="text-gray-900 underline">create a role member guide</a>
							</Link>
							.
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
