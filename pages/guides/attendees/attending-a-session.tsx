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
				title="Attending a session — Evental"
				description={`Learn how to attend a session on evental.`}
				openGraph={{
					url: 'https://evental.app/guides/attendees/attending-a-session',
					title: 'Attending a session — Evental',
					description: `Learn how to attend a session on evental.`,
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
					<h1 className="text-2xl md:text-3xl font-bold">Attending a session</h1>
					<p className="text-gray-100 text-md mt-4">Learn how to attend a session on evental.</p>
				</Column>
			</div>

			<Column>
				<h3 className="font-bold text-xl mb-2">Table of contents</h3>
				<ul className="list-disc pl-5 space-y-0.5 text-gray-700">
					<li>
						<Link href="/guides/attendees/attending-a-session#find-an-event">
							<a>Find an event</a>
						</Link>
					</li>
					<li>
						<Link href="/guides/attendees/attending-a-session#find-your-event">
							<a>Find a session</a>
						</Link>
					</li>
					<li>
						<Link href="/guides/attendees/attending-a-session#registering-for-an-event">
							<a>Attend a session</a>
						</Link>
					</li>
				</ul>

				<div id="find-an-event" className="my-7">
					<Link href="/guides/attendees/attending-a-session#find-an-event">
						<a className="text-xl font-bold mb-2 block">
							Find an event{' '}
							<Tooltip side={'top'} message={`Copy link to clipboard`}>
								<span
									className="text-primary font-bold cursor-pointer ml-1.5"
									onClick={() => {
										navigator.clipboard
											.writeText(
												`${
													process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
												}/guides/attendees/attending-a-session#find-an-event`
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
						Before registering for a session, you will need to{' '}
						<Link href="/guides/attendees/attending-an-event">
							<a className="underline text-gray-900">find & register for an event</a>
						</Link>
						.
					</p>

					<div className="w-full relative border border-gray-200 shadow-sm rounded-md">
						<AspectRatio.Root ratio={1580 / 502}>
							<Image
								src={'https://cdn.evental.app/images/upcoming-events.png'}
								className="rounded-md"
								layout="fill"
							/>
						</AspectRatio.Root>
					</div>
				</div>

				<div id="find-a-session" className="my-7">
					<Link href="/guides/attendees/attending-a-session#find-a-session">
						<a className="text-xl font-bold mb-2 block">
							Find a session{' '}
							<Tooltip side={'top'} message={`Copy link to clipboard`}>
								<span
									className="text-primary font-bold cursor-pointer ml-1.5"
									onClick={() => {
										navigator.clipboard
											.writeText(
												`${
													process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
												}/guides/attendees/attending-a-session#find-a-session`
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
						After registering for the event, you can find a session on the events page.
					</p>

					<div className="w-full relative border border-gray-200 shadow-sm rounded-md">
						<AspectRatio.Root ratio={1602 / 753}>
							<Image
								src={'https://cdn.evental.app/images/find-a-session.png'}
								className="rounded-md"
								layout="fill"
							/>
						</AspectRatio.Root>
					</div>
				</div>

				<div id="registering-for-an-event" className="my-7">
					<Link href="/guides/attendees/attending-a-session#registering-for-an-event">
						<a className="text-xl font-bold mb-2 block">
							Registering for an event{' '}
							<Tooltip side={'top'} message={`Copy link to clipboard`}>
								<span
									className="text-primary font-bold cursor-pointer ml-1.5"
									onClick={() => {
										navigator.clipboard
											.writeText(
												`${
													process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
												}/guides/attendees/attending-a-session#registering-for-an-event`
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
						Once you have found an event, you can attend it by clicking the{' '}
						<span className="font-medium">"Registering here" button</span>
					</p>

					<div className="w-full relative border border-gray-200 shadow-sm rounded-md">
						<AspectRatio.Root ratio={1613 / 651}>
							<Image
								src={'https://cdn.evental.app/images/attend-this-event.png'}
								className="rounded-md"
								layout="fill"
							/>
						</AspectRatio.Root>
					</div>
				</div>

				<div id="attending-a-session" className="my-7">
					<p className="text-gray-700 mb-4">
						After registering for the event{' '}
						<Link href="/guides/attendees/attending-a-session">
							<a className="underline text-gray-900">attend a session</a>
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
