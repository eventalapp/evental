import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { Footer } from '../components/Footer';
import { LinkButton } from '../components/form/LinkButton';
import { AspectImage } from '../components/guides/AspectImage';
import Column from '../components/layout/Column';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';

const HomePage: NextPage = () => {
	return (
		<PageWrapper>
			<NextSeo
				title="Evental — Event management software from the future"
				description="Event management software that's highly intuitive. Your attendees and organizers will love using Evental for your in-person, hybrid, and virtual events."
				openGraph={{
					url: 'https://evental.app',
					title: 'Evental — Event management software from the future',
					description:
						"Event management software that's highly intuitive. Your attendees and organizers will love using Evental for your in-person, hybrid, and virtual events.",
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

			<Column className="flex flex-col items-center">
				<h1 className="mb-3 px-2 text-center text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
					Host Outstanding Events
				</h1>
				<p className="mt-1 mb-6 max-w-4xl text-center text-base text-gray-600 lg:text-xl lg:leading-8">
					Event management software that's highly intuitive. Your attendees and organizers will love
					using Evental for your in-person, hybrid, and virtual events.
				</p>
				<div className="z-10 grid grid-cols-2 gap-3">
					<Link href="/events/create" passHref>
						<LinkButton variant="primary" padding="large">
							Host An Event
						</LinkButton>
					</Link>
					<Link href="/events" passHref>
						<LinkButton variant="default" padding="large">
							View All Events
						</LinkButton>
					</Link>
				</div>

				<div className="relative mt-7 w-full rounded-md bg-white md:mt-14">
					<div className="relative mx-auto max-w-full sm:w-full sm:max-w-[1200px]">
						<div className="absolute top-[30px] h-32 w-full overflow-visible sm:top-[75px]">
							<div className="bloom bloom-one left-0" />
							<div className="bloom bloom-three left-[34%]" />
							<div className="bloom bloom-two right-0" />
						</div>
					</div>

					<AspectImage
						alt="Event Overview"
						ratio={1632 / 858}
						imageUrl={'https://cdn.evental.app/images/event-showcase.jpg'}
					/>
				</div>
			</Column>

			<div className="bg-primary-600 text-white">
				<Column>
					<h3 className="text-xl font-bold md:text-2xl">Creating events couldn't be easier</h3>
					<p className="mt-1 text-base text-gray-100 md:text-lg">
						In 3 quick steps, you can get your event up and running
					</p>
					<div className="mt-6 grid grid-cols-1 gap-5 border-t-2 border-primary-500 pt-6 lg:grid-cols-2 xl:grid-cols-3">
						<div>
							<span className="text-sm font-bold text-gray-300">1.</span>
							<h4 className="my-2 text-xl font-bold">Create an event</h4>
							<p className="text-gray-200">
								Start by{' '}
								<Link href="/events/create">
									<a className="underline">creating an event</a>
								</Link>
								, implement your branding and configure your event.
							</p>
						</div>
						<div>
							<span className="text-sm font-bold text-gray-300">2.</span>
							<h4 className="my-2 text-xl font-bold">Create a session</h4>
							<p className="text-gray-200">
								Then create a session, attach speakers, setup a venue, and add a session category.
							</p>
						</div>
						<div>
							<span className="text-sm font-bold text-gray-300">3.</span>
							<h4 className="my-2 text-xl font-bold">Invite your attendees</h4>
							<p className="text-gray-200">
								Then invite organizers, attendees, and speakers/role members to your event.
							</p>
						</div>
					</div>
				</Column>
			</div>

			<Column>
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<div className="flex flex-col justify-center">
						<h3 className="text-xl font-bold md:text-2xl">Organizer experience</h3>
						<p className="mt-3 text-gray-700">
							The Evental admin dashboard has been made with simplicity and ease-of-use in mind.
						</p>
						<ul className="my-5 list-disc space-y-0.5 pl-5 text-gray-600">
							<li>Manager attendees/speakers</li>
							<li>Create custom event pages</li>
							<li>Create and customize sessions</li>
						</ul>

						<div>
							<Link href="/events/create">
								<LinkButton padding="large">Start Trial</LinkButton>
							</Link>
						</div>
					</div>
					<div>
						<div className="h-72 rounded-md bg-gray-200" />
					</div>
				</div>
			</Column>

			<Column>
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<div>
						<div className="h-72 rounded-md bg-gray-200" />
					</div>
					<div className="flex flex-col justify-center">
						<h3 className="text-xl font-bold md:text-2xl">Attendee experience</h3>
						<p className="mt-3 text-gray-700">
							Allow attendees to easily attendee sessions, view venues, and learn more information
							about your event.
						</p>
						<ul className="my-5 list-disc space-y-0.5 pl-5 text-gray-600">
							<li>Signup for sessions</li>
							<li>Create and export your schedule</li>
							<li>View event pages, venues, sessions</li>
						</ul>

						<div>
							<Link href="/events/create">
								<LinkButton padding="large">Start Trial</LinkButton>
							</Link>
						</div>
					</div>
				</div>
			</Column>

			<Column>
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<div className="flex flex-col justify-center">
						<h3 className="text-xl font-bold md:text-2xl">Speaker experience</h3>
						<p className="mt-3 text-gray-700">
							Speakers can easily create and manage their user profile and sessions
						</p>
						<ul className="my-5 list-disc space-y-0.5 pl-5 text-gray-600">
							<li>Add speaker contact information</li>
							<li>Build a custom profile to showcase yourself</li>
							<li>Attach speakers/role members to sessions</li>
						</ul>

						<div>
							<Link href="/events/create">
								<LinkButton padding="large">Start Trial</LinkButton>
							</Link>
						</div>
					</div>
					<div>
						<div className="h-72 rounded-md bg-gray-200" />
					</div>
				</div>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default HomePage;
