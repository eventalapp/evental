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
import { useUser } from '../../../hooks/queries/useUser';

const AttendingASessionGuidePage: NextPage = () => {
	const { user } = useUser();

	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Downloading your schedule — Evental"
				description={`Learn how to view and download your schedule on evental.`}
				openGraph={{
					url: 'https://evental.app/guides/attendee/downloading-your-schedule',
					title: 'Downloading your schedule — Evental',
					description: `Learn how to view and download your schedule on evental.`,
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
					<h1 className="text-2xl md:text-3xl font-bold">Downloading your schedule</h1>
					<p className="text-gray-100 text-md mt-4">
						Learn how to view and download your schedule on evental.
					</p>
				</Column>
			</div>

			<Column>
				<h3 className="font-bold text-xl mb-2">Table of contents</h3>
				<ul className="list-disc pl-5 space-y-0.5 text-gray-700">
					<li>
						<Link href="/guides/attendee/downloading-your-schedule#view-your-schedule">
							<a>View your schedule</a>
						</Link>
					</li>
					<li>
						<Link href="/guides/attendee/downloading-your-schedule#download-your-schedule">
							<a>Download your schedule</a>
						</Link>
					</li>
				</ul>

				<div id="view-your-schedule" className="my-7">
					<Link href="/guides/attendee/downloading-your-schedule#view-your-schedule">
						<a className="text-xl font-bold mb-2 block">
							View your schedule{' '}
							<Tooltip side={'top'} message={`Copy link to clipboard`}>
								<span
									className="text-primary font-bold cursor-pointer ml-1.5"
									onClick={() => {
										navigator.clipboard
											.writeText(
												`${
													process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
												}/guides/attendee/downloading-your-schedule#view-your-schedule`
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
						You can view your schedule at the{' '}
						{user ? (
							<Link href={`/users/${user.slug}/schedule`}>
								<a className="underline text-gray-900">my schedule page</a>
							</Link>
						) : (
							'my schedule page, which can be found by signing in and clicking the top right user icon and selecting "Schedule"'
						)}
						.
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

				<div id="download-your-schedule" className="my-7">
					<Link href="/guides/attendee/downloading-your-schedule#download-your-schedule">
						<a className="text-xl font-bold mb-2 block">
							Download your schedule{' '}
							<Tooltip side={'top'} message={`Copy link to clipboard`}>
								<span
									className="text-primary font-bold cursor-pointer ml-1.5"
									onClick={() => {
										navigator.clipboard
											.writeText(
												`${
													process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
												}/guides/attendee/downloading-your-schedule#download-your-schedule`
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
						After visiting the schedule page, you can download your schedule by clicking the{' '}
						<span className="font-medium">"Download Schedule (Excel)"</span> button. If you would
						like more export options, please fill out a feature request{' '}
						<Link href="/support">
							<a className="underline text-gray-900">support ticket</a>
						</Link>
						.
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

export default AttendingASessionGuidePage;
