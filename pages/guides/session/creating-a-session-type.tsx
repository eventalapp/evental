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

const CreatingASessionTypeGuidePage: NextPage = () => {
	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Creating a session type — Evental"
				description={`Learn how to create a session type for your event on Evental.`}
				openGraph={{
					url: 'https://evental.app/guides/session/creating-a-session-type',
					title: 'Creating a session type — Evental',
					description: `Learn how to create a session type for your event on Evental.`,
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
					<h1 className="text-2xl md:text-3xl font-bold">Creating a session type</h1>
					<p className="text-gray-100 text-md mt-4">
						Learn how to create a session type for your event on Evental.
					</p>
				</Column>
			</div>

			<Column>
				<h3 className="font-bold text-xl mb-2">Table of contents</h3>
				<ul className="list-disc pl-5 space-y-0.5 text-gray-700">
					<li>
						<Link href="/guides/session/creating-a-session-type#navigate-to-the-dashboard">
							<a>Navigate to the events dashboard</a>
						</Link>
					</li>
					<li>
						<Link href="/guides/session/creating-a-session-type#navigate-to-the-session-dashboard">
							<a>Navigate to the session types dashboard</a>
						</Link>
					</li>
					<li>
						<Link href="/guides/session/creating-a-session-type#create-a-type">
							<a>Create a session type</a>
						</Link>
					</li>
				</ul>

				<div id="navigate-to-the-dashboard" className="my-7">
					<Link href="/guides/session/creating-a-session-type#navigate-to-the-dashboard">
						<a className="text-xl font-bold mb-2 block">
							Navigate to the events dashboard{' '}
							<Tooltip side={'top'} message={`Copy link to clipboard`}>
								<span
									className="text-primary font-bold cursor-pointer ml-1.5"
									onClick={() => {
										navigator.clipboard
											.writeText(
												`${
													process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
												}/guides/session/creating-a-session-type#navigate-to-the-dashboard`
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
						To create a session, navigate to the events admin dashboard by clicking the{' '}
						<span className="font-medium">"manage this event"</span> button.
					</p>

					<div className="w-full relative border border-gray-200 shadow-sm rounded-md">
						<AspectRatio.Root ratio={1610 / 548}>
							<Image
								alt="Upcoming events page"
								src={'https://cdn.evental.app/images/my-schedule.png'}
								className="rounded-md"
								layout="fill"
							/>
						</AspectRatio.Root>
					</div>
				</div>

				<div id="navigate-to-the-session-dashboard" className="my-7">
					<Link href="/guides/session/creating-a-session-type#navigate-to-the-session-dashboard">
						<a className="text-xl font-bold mb-2 block">
							Navigate to the session types dashboard{' '}
							<Tooltip side={'top'} message={`Copy link to clipboard`}>
								<span
									className="text-primary font-bold cursor-pointer ml-1.5"
									onClick={() => {
										navigator.clipboard
											.writeText(
												`${
													process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
												}/guides/session/creating-a-session-type#navigate-to-the-session-dashboard`
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
						After visiting the events dashboard, click the{' '}
						<span className="font-medium">"Types"</span> page.
					</p>

					<div className="w-full relative border border-gray-200 shadow-sm rounded-md">
						<AspectRatio.Root ratio={1613 / 606}>
							<Image
								alt="Find a session"
								src={'https://cdn.evental.app/images/download-your-schedule.png'}
								className="rounded-md"
								layout="fill"
							/>
						</AspectRatio.Root>
					</div>
				</div>

				<div id="create-a-type" className="my-7">
					<Link href="/guides/session/creating-a-session-type#create-a-type">
						<a className="text-xl font-bold mb-2 block">
							Create a type{' '}
							<Tooltip side={'top'} message={`Copy link to clipboard`}>
								<span
									className="text-primary font-bold cursor-pointer ml-1.5"
									onClick={() => {
										navigator.clipboard
											.writeText(
												`${
													process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
												}/guides/session/creating-a-session-type#create-a-type`
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
						After visiting the session type dashboard page, click the{' '}
						<span className="font-medium">"Create Type"</span> button. This will navigate you to the
						create session type page, where you can create a type/category to group sessions.
					</p>

					<div className="w-full relative border border-gray-200 shadow-sm rounded-md">
						<AspectRatio.Root ratio={1613 / 606}>
							<Image
								alt="Find a session"
								src={'https://cdn.evental.app/images/download-your-schedule.png'}
								className="rounded-md"
								layout="fill"
							/>
						</AspectRatio.Root>
					</div>
				</div>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default CreatingASessionTypeGuidePage;
