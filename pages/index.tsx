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
				<h1 className="px-2 mb-3 text-4xl sm:text-5xl font-black leading-tight text-center lg:text-6xl tracking-tight">
					Host Outstanding Events
				</h1>
				<p className="max-w-4xl mt-1 mb-6 text-center text-base text-base lg:text-xl leading-2 lg:leading-8 text-gray-600">
					Event management software that's highly intuitive. Your attendees and organizers will love
					using Evental for your in-person, hybrid, and virtual events.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 z-10">
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

				<div className="bg-white w-full mt-7 md:mt-14 rounded-md relative">
					<div className="relative max-w-full sm:w-full sm:max-w-[1200px] mx-auto">
						<div className="absolute w-full overflow-visible top-[30px] sm:top-[75px] h-32">
							<div className="left-0 bloom bloom-one" />
							<div className="left-[34%] bloom bloom-three" />
							<div className="right-0 bloom bloom-two" />
						</div>
					</div>

					<AspectImage
						alt="Event Overview"
						ratio={1632 / 858}
						imageUrl={'https://cdn.evental.app/images/event-showcase.png'}
					/>
				</div>
			</Column>

			<div className="dark-topography text-white">
				<Column>
					<h3 className="text-xl md:text-2xl font-bold">Creating events couldn't be easier</h3>
					<p className="text-md md:text-lg text-gray-100 mt-1">
						In 3 quick steps, you can get your event up and running
					</p>
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-6 pt-6 border-t-2 border-primary-500">
						<div>
							<span className="text-gray-300 text-sm font-bold">1.</span>
							<h4 className="font-bold text-xl my-2">Create an event</h4>
							<p className="text-gray-200">
								Start by{' '}
								<Link href="/events/create">
									<a className="underline">creating an event</a>
								</Link>
								, implement your branding and configure your event.
							</p>
						</div>
						<div>
							<span className="text-gray-300 text-sm font-bold">2.</span>
							<h4 className="font-bold text-xl my-2">Create a session</h4>
							<p className="text-gray-200">
								Then create a session, attach speakers, setup a venue, and add a session category.
							</p>
						</div>
						<div>
							<span className="text-gray-300 text-sm font-bold">3.</span>
							<h4 className="font-bold text-xl my-2">Invite your attendees</h4>
							<p className="text-gray-200">
								Then invite organizers, attendees, and speakers/role members to your event.
							</p>
						</div>
					</div>
				</Column>
			</div>

			<Column>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="flex flex-col justify-center">
						<h3 className="text-xl md:text-2xl font-bold">Organizer experience</h3>
						<p className="mt-3 text-gray-700">
							The Evental admin dashboard has been made with simplicity and ease-of-use in mind.
						</p>
						<ul className="list-disc pl-5 space-y-0.5 my-5 text-gray-600">
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
						<div className="bg-gray-200 h-72 rounded-md" />
					</div>
				</div>
			</Column>

			<Column>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div>
						<div className="bg-gray-200 h-72 rounded-md" />
					</div>
					<div className="flex flex-col justify-center">
						<h3 className="text-xl md:text-2xl font-bold">Attendee experience</h3>
						<p className="mt-3 text-gray-700">
							Allow attendees to easily attendee sessions, view venues, and learn more information
							about your event.
						</p>
						<ul className="list-disc pl-5 space-y-0.5 my-5 text-gray-600">
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
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="flex flex-col justify-center">
						<h3 className="text-xl md:text-2xl font-bold">Speaker experience</h3>
						<p className="mt-3 text-gray-700">
							Speakers can easily create and manage their user profile and sessions
						</p>
						<ul className="list-disc pl-5 space-y-0.5 my-5 text-gray-600">
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
						<div className="bg-gray-200 h-72 rounded-md" />
					</div>
				</div>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default HomePage;
