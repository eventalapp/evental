import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
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

const sections: Section[] = [
	{ anchor: 'navigate-to-the-dashboard', title: 'Navigate to the dashboard' },
	{ anchor: 'navigate-to-the-sessions-page', title: 'Navigate to the sessions page' },
	{ anchor: 'select-a-session', title: 'Select a session' },
	{ anchor: 'attach-a-role-member', title: 'Attach a role member' }
];

const InvitingSessionMemberGuidePage: NextPage = () => {
	return (
		<PageWrapper variant="white">
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
			<Navigation />

			<div className="dark-topography text-white">
				<Column className="flex flex-col items-center">
					<h1 className="text-2xl md:text-3xl font-bold">Attach a role member — Evental</h1>
					<p className="text-gray-100 text-md mt-4">
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
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/attaching-a-role-member#${sections[0].anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						To attach a role member to a session, navigate to the events admin dashboard by clicking
						the <span className="font-medium">"manage this event"</span> button.
					</p>

					<AspectImage
						ratio={1603 / 798}
						imageUrl={'https://cdn.evental.app/images/manage-this-event.png'}
						alt={'Manage this event'}
					/>
				</GuideSection>

				<GuideSection id={sections[1].anchor}>
					<GuideSectionHeader
						text={sections[1].title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/attaching-a-role-member#${sections[1].anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the events dashboard, click the{' '}
						<span className="font-medium">"Sessions"</span> link in the top navigation.
					</p>
				</GuideSection>

				<GuideSection id={sections[2].anchor}>
					<GuideSectionHeader
						text={sections[2].title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/attaching-a-role-member#${sections[2].anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the sessions dashboard page, select the session you wish to attach role
						to.
					</p>
				</GuideSection>
				<GuideSection id={sections[3].anchor}>
					<GuideSectionHeader
						text={sections[3].title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/attaching-a-role-member#${sections[3].anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						After selecting and viewing a session. Select the{' '}
						<span className="font-medium">"Edit"</span> button
					</p>

					<p className="text-gray-700 mb-4">
						After visting the edit session form. Select the{' '}
						<span className="font-medium">"Attach People"</span> button
					</p>

					<p className="text-gray-700 mb-4">
						A modal will appear, and you can start typing in the attendees name, and once you see
						the desired attendee, click the plus button. If you do not see the attendee you are
						looking for, they may not be attending you event. See the{' '}
						<Link href="/guides/role/inviting-a-role-member">
							<a className="underline text-gray-900">invite a role member guide</a>
						</Link>{' '}
						or{' '}
						<Link href="/guides/role/creating-a-role-member">
							<a className="underline text-gray-900">create a role member guide</a>
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
	);
};

export default InvitingSessionMemberGuidePage;
