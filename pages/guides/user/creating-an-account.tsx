import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { toast } from 'react-toastify';

import { Footer } from '../../../components/Footer';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import Tooltip from '../../../components/radix/components/Tooltip';

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
				<h3 className="font-bold text-xl mb-2">Table of contents</h3>
				<ul className="list-disc pl-5 space-y-0.5 text-gray-700">
					<li>
						<Link href="/guides/user/creating-an-account#create-an-account">
							<a>Create an account</a>
						</Link>
					</li>
					<li>
						<Link href="/guides/user/creating-an-account#verify-your-account">
							<a>Verify your account</a>
						</Link>
					</li>
					<li>
						<Link href="/guides/user/creating-an-account#customize-your-profile">
							<a>Customize your profile</a>
						</Link>
					</li>
				</ul>

				<div id="create-an-account" className="my-7">
					<Link href="/guides/user/creating-an-account#create-an-account">
						<a className="text-xl font-bold mb-2 block">
							Create an account{' '}
							<Tooltip side={'top'} message={`Copy link to clipboard`}>
								<span
									className="text-primary font-bold cursor-pointer ml-1.5"
									onClick={() => {
										navigator.clipboard
											.writeText(
												`${
													process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
												}/guides/user/creating-an-account#create-an-account`
											)
											.then(() => {
												toast.success('Link successfully copied to clipboard.');
											});
									}}
								>
									#
								</span>
							</Tooltip>
						</a>
					</Link>

					<p className="text-gray-700 mb-4">
						Before registering for an event, you will need to{' '}
						<Link href="/auth/signup">
							<a className="underline text-gray-900">create an account</a>
						</Link>
						.
					</p>

					<div className="w-full relative border border-gray-200 shadow-sm rounded-md">
						<AspectRatio.Root ratio={1666 / 656}>
							<Image
								alt="Signup for evental"
								src={'https://cdn.evental.app/images/evental-signup.png'}
								className="rounded-md"
								layout="fill"
							/>
						</AspectRatio.Root>
					</div>
				</div>

				<div id="verify-your-account" className="my-7">
					<Link href="/guides/user/creating-an-account#verify-your-account">
						<a className="text-xl font-bold mb-2 block">
							Verify your account{' '}
							<Tooltip side={'top'} message={`Copy link to clipboard`}>
								<span
									className="text-primary font-bold cursor-pointer ml-1.5"
									onClick={() => {
										navigator.clipboard
											.writeText(
												`${
													process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
												}/guides/user/creating-an-account#verify-your-account`
											)
											.then(() => {
												toast.success('Link successfully copied to clipboard.');
											});
									}}
								>
									#
								</span>
							</Tooltip>
						</a>
					</Link>

					<p className="text-gray-700 mb-4">
						After creating an account, you will receive an email asking you to verify your account.
						If you need to request another verification email, do you this in the{' '}
						<Link href="/settings">
							<a className="underline text-gray-900">user settings page</a>
						</Link>
						.
					</p>

					<div className="lg:w-3/5 m-auto w-full relative border border-gray-200 shadow-sm rounded-md">
						<AspectRatio.Root ratio={855 / 482}>
							<Image
								alt="Upcoming events page"
								src={'https://cdn.evental.app/images/verify-your-account.png'}
								className="rounded-md"
								layout="fill"
							/>
						</AspectRatio.Root>
					</div>
				</div>

				<div id="customize-your-profile" className="my-7">
					<Link href="/guides/user/creating-an-account#customize-your-profile">
						<a className="text-xl font-bold mb-2 block">
							Customize your profile{' '}
							<Tooltip side={'top'} message={`Copy link to clipboard`}>
								<span
									className="text-primary font-bold cursor-pointer ml-1.5"
									onClick={() => {
										navigator.clipboard
											.writeText(
												`${
													process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
												}/guides/user/creating-an-account#customize-your-profile`
											)
											.then(() => {
												toast.success('Link successfully copied to clipboard.');
											});
									}}
								>
									#
								</span>
							</Tooltip>
						</a>
					</Link>

					<p className="text-gray-700 mb-4">
						After verifying your email, you can customize your profile to include your social
						contacts and add more information about you.
					</p>

					<div className="lg:w-3/5 m-auto w-full relative border border-gray-200 shadow-sm rounded-md">
						<AspectRatio.Root ratio={862 / 961}>
							<Image
								alt="Attend this event"
								src={'https://cdn.evental.app/images/editing-your-profile.png'}
								className="rounded-md"
								layout="fill"
							/>
						</AspectRatio.Root>
					</div>
				</div>

				<div id="attending-a-session" className="my-7">
					<p className="text-gray-700 mb-4">
						After customizing your profile, you can{' '}
						<Link href="/guides/attendee/attending-an-event">
							<a className="underline text-gray-900">attend an event</a>
						</Link>
						.
					</p>
				</div>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default AttendingAnEventGuidePage;
