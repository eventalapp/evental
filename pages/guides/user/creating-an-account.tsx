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

const AttendingAnEventGuidePage: NextPage = () => {
	return (
		<PageWrapper variant="white">
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
			<Navigation />

			<div className="dark-topography text-white">
				<Column className="flex flex-col items-center">
					<h1 className="text-2xl md:text-3xl font-bold">Creating an account</h1>
					<p className="text-gray-100 text-md mt-4">
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
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/user/creating-an-account#create-an-account`}
					/>

					<p className="text-gray-700 mb-4">
						Before registering for an event, you will need to{' '}
						<Link href="/auth/signup">
							<a className="underline text-gray-900">create an account</a>
						</Link>
						.
					</p>

					<AspectImage
						ratio={1666 / 656}
						imageUrl={'https://cdn.evental.app/images/attend-this-event.png'}
						alt={'Signup for evental'}
					/>
				</GuideSection>

				<GuideSection id="verify-your-account">
					<GuideSectionHeader
						text="Verify your account"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/user/creating-an-account#verify-your-account`}
					/>

					<p className="text-gray-700 mb-4">
						After creating an account, you will receive an email asking you to verify your account.
						If you need to request another verification email, do you this in the{' '}
						<Link href="/settings">
							<a className="underline text-gray-900">user settings page</a>
						</Link>
						.
					</p>

					<AspectImage
						className={'lg:w-3/5 m-auto'}
						ratio={855 / 482}
						imageUrl={'https://cdn.evental.app/images/verify-your-account.png'}
						alt={'Verify your account'}
					/>
				</GuideSection>

				<GuideSection id="customize-your-profile">
					<GuideSectionHeader
						text="Customize your profile"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/user/creating-an-account#customize-your-profile`}
					/>

					<p className="text-gray-700 mb-4">
						After verifying your email, you can customize your profile to include your social
						contacts and add more information about you.
					</p>

					<AspectImage
						className={'lg:w-3/5 m-auto'}
						ratio={862 / 961}
						imageUrl={'https://cdn.evental.app/images/editing-your-profile.png'}
						alt={'Editing your profile'}
					/>
				</GuideSection>

				<GuideSection id="attending-a-session">
					<p className="text-gray-700 mb-4">
						After customizing your profile, you can{' '}
						<Link href="/guides/attendee/attending-an-event">
							<a className="underline text-gray-900">attend an event</a>
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

export default AttendingAnEventGuidePage;