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
	{ anchor: 'navigate-to-the-roles-page', title: 'Navigate to the roles page' },
	{ anchor: 'select-a-role', title: 'Select a role' },
	{ anchor: 'invite-a-member', title: 'Invite a role member' }
];

const InvitingRoleMemberGuidePage: NextPage = () => {
	return (
		<>
			<Navigation />

			<PageWrapper>
				<NextSeo
					title="Inviting a role member — Evental"
					description={`Learn how to invite a role member to your event on Evental.`}
					openGraph={{
						url: 'https://evental.app/guides/role/inviting-a-role-member',
						title: 'Inviting a role member — Evental',
						description: `Learn how to invite a role member to your event on Evental.`,
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
						<Heading>Inviting a role member</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to invite a role member to your event on Evental
						</p>
					</Column>
				</div>

				<Column>
					<TableOfContents
						items={[
							{
								text: sections[0].title,
								relativeLink: `/guides/role/inviting-a-role-member#${sections[0].anchor}`
							},
							{
								text: sections[1].title,
								relativeLink: `/guides/role/inviting-a-role-member#${sections[1].anchor}`
							},
							{
								text: sections[2].title,
								relativeLink: `/guides/role/inviting-a-role-member#${sections[2].anchor}`
							},
							{
								text: sections[3].title,
								relativeLink: `/guides/role/inviting-a-role-member#${sections[3].anchor}`
							}
						]}
					/>

					<GuideSection id={sections[0].anchor}>
						<GuideSectionHeader
							text={sections[0].title}
							url={`/guides/role/inviting-a-role-member#${sections[0].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							To invite a speaker or role member, navigate to the events admin dashboard by clicking
							the <span className="font-medium">"manage this event"</span> button.
						</p>
					</GuideSection>

					<GuideSection id={sections[1].anchor}>
						<GuideSectionHeader
							text={sections[1].title}
							url={`/guides/role/inviting-a-role-member#${sections[1].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the events dashboard, click the{' '}
							<span className="font-medium">"Roles"</span> link in the top navigation.
						</p>
					</GuideSection>

					<GuideSection id={sections[2].anchor}>
						<GuideSectionHeader
							text={sections[2].title}
							url={`/guides/role/inviting-a-role-member#${sections[2].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							After visiting the roles dashboard page, select the role you wish to invite members
							to.
						</p>
					</GuideSection>
					<GuideSection id={sections[3].anchor}>
						<GuideSectionHeader
							text={sections[3].title}
							url={`/guides/role/inviting-a-role-member#${sections[3].anchor}`}
						/>

						<p className="mb-4 text-gray-700">
							Select the <span className="font-medium">"Invite"</span> button, then enter the users
							email and select invite.
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

export default InvitingRoleMemberGuidePage;
