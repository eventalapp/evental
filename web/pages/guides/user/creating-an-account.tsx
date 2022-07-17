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

const AttendingAnEventGuidePage: NextPage = () => {
	return (
		<>
			<Navigation />

			<PageWrapper>
				<NextSeo
					title="Creating an account — Evental"
					description={`Learn how to create and customize your Evental account.`}
					openGraph={{
						url: 'https://evental.app/guides/user/creating-an-account',
						title: 'Creating an account — Evental',
						description: `Learn how to create and customize your Evental account.`,
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
						<Heading>Creating an account</Heading>
						<p className="mt-4 text-base text-gray-100">
							Learn how to create and customize your Evental account.
						</p>
					</Column>
				</div>

				<Column>
					<TableOfContents
						items={[
							{
								text: 'Create an account',
								relativeLink: '/guides/user/creating-an-account#create-an-account'
							},
							{
								text: 'Verify your account',
								relativeLink: '/guides/user/creating-an-account#verify-your-account'
							},
							{
								text: 'Customize your profile',
								relativeLink: '/guides/user/creating-an-account#customize-your-profile'
							}
						]}
					/>

					<GuideSection id="create-an-account">
						<GuideSectionHeader
							text="Create an account"
							url={`/guides/user/creating-an-account#create-an-account`}
						/>

						<p className="mb-4 text-gray-700">
							Before registering for an event, you will need to{' '}
							<Link href="/auth/signup">
								<a className="text-gray-900 underline">create an account</a>
							</Link>
							.
						</p>
					</GuideSection>

					<GuideSection id="verify-your-account">
						<GuideSectionHeader
							text="Verify your account"
							url={`/guides/user/creating-an-account#verify-your-account`}
						/>

						<p className="mb-4 text-gray-700">
							After creating an account, you will receive an email asking you to verify your
							account. If you need to request another verification email, do you this in the{' '}
							<Link href="/settings">
								<a className="text-gray-900 underline">user settings page</a>
							</Link>
							.
						</p>
					</GuideSection>

					<GuideSection id="customize-your-profile">
						<GuideSectionHeader
							text="Customize your profile"
							url={`/guides/user/creating-an-account#customize-your-profile`}
						/>

						<p className="mb-4 text-gray-700">
							After verifying your email, you can customize your profile to include your social
							contacts and add more information about you.
						</p>
					</GuideSection>

					<GuideSection id="attending-a-session">
						<p className="mb-4 text-gray-700">
							After customizing your profile, you can{' '}
							<Link href="/guides/attendee/attending-an-event">
								<a className="text-gray-900 underline">attend an event</a>
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

export default AttendingAnEventGuidePage;
