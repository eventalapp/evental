import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { EventalProCard } from '../components/EventalProCard';
import { Footer } from '../components/Footer';
import { LinkButton } from '../components/form/LinkButton';
import { AspectImage } from '../components/guides/AspectImage';
import Column from '../components/layout/Column';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';
import { Heading } from '../components/typography/Heading';
import { Paragraph } from '../components/typography/Paragraph';
import { eduAttendeePricing, proAttendeePricing } from '../utils/const';

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
				<Heading variant="sm" level={6} className="text-primary text-center">
					EVENT MANAGEMENT APP
				</Heading>
				<Heading variant="4xl" className="mb-3 mt-1 text-center">
					Host Outstanding Events
				</Heading>
				<Paragraph className="mt-1 mb-6 text-center max-w-4xl text-gray-600" variant="xl">
					Event management software that's highly intuitive. Your attendees and organizers will love
					using Evental for your in-person, hybrid, and virtual events.
				</Paragraph>
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
						className="bg-white"
						imageUrl={'https://cdn.evental.app/images/event-showcase.jpg'}
					/>
				</div>
			</Column>

			<div className="bg-primary-600 text-white">
				<Column>
					<Heading variant="sm" level={6} className="text-gray-300 mb-3">
						GETTING STARTED
					</Heading>
					<Heading level={3} className="mb-3 tracking-normal">
						Creating events couldn't be easier
					</Heading>
					<Paragraph className="text-gray-100">
						In 3 quick steps, you can get your event up and running
					</Paragraph>

					<div className="mt-6 grid grid-cols-1 gap-7 border-t-2 border-primary-500 pt-6 lg:grid-cols-2 xl:grid-cols-3">
						<div>
							<Heading level={5} variant="sm" className="text-gray-300">
								1.
							</Heading>
							<Heading level={4} className="my-2" variant="xl">
								Create an event
							</Heading>
							<Paragraph className="text-gray-200">
								Start by{' '}
								<Link href="/events/create">
									<a className="underline">creating an event</a>
								</Link>
								, implement your branding and configure your event.
							</Paragraph>
						</div>
						<div>
							<Heading level={5} variant="sm" className="text-gray-300">
								2.
							</Heading>
							<Heading level={4} className="my-2" variant="xl">
								Create a session
							</Heading>
							<Paragraph className="text-gray-200">
								Then create a session, attach speakers, setup a venue, and add a session category.
							</Paragraph>
						</div>
						<div>
							<Heading level={5} variant="sm" className="text-gray-300">
								3.
							</Heading>
							<Heading level={4} className="my-2" variant="xl">
								Invite your attendees
							</Heading>
							<Paragraph className="text-gray-200">
								Then invite organizers, attendees, and speakers/role members to your event.
							</Paragraph>
						</div>
					</div>
				</Column>
			</div>

			<Column>
				<div className="flex flex-col items-center">
					<Heading variant="sm" level={6} className="text-primary mb-3">
						PRICING
					</Heading>
					<Heading level={2} variant="3xl" className="mb-3">
						Competitive Pricing
					</Heading>

					<Paragraph variant="lg" className="mb-3 max-w-3xl text-center text-gray-600">
						<span className="font-medium">Evental Pro plans</span> start at $
						{proAttendeePricing[250].price}, and{' '}
						<span className="font-medium">Evental Education plans</span> start at Evental Pro plans
						start at ${eduAttendeePricing[250].price}. See the{' '}
						<Link href="/pricing">
							<a className="underline">pricing page</a>
						</Link>{' '}
						for more information about our one-time and yearly event pricing and features.
					</Paragraph>

					<div className="relative">
						<div className="relative mx-auto max-w-full sm:w-full sm:max-w-[1200px]">
							<div className="absolute top-[30px] h-32 w-full overflow-visible sm:top-[100px]">
								<div className="bloom small bloom-one left-0" />
								<div className="bloom small bloom-three left-[34%] top-[150%]" />
								<div className="bloom small bloom-two right-0" />
							</div>
						</div>

						<EventalProCard attendees={250} className="relative">
							<Link href="/events/create">
								<LinkButton>Start Free Trial</LinkButton>
							</Link>
						</EventalProCard>
					</div>
				</div>
			</Column>

			<div className="bg-primary-600">
				<Column>
					<div className="flex flex-col items-center text-white">
						<Heading variant="sm" level={6} className="text-gray-200 mb-3">
							BRANDING
						</Heading>
						<Heading level={2} variant="3xl" className="mb-3">
							Custom Event Branding
						</Heading>
						<Paragraph variant="lg" className="mb-3 max-w-3xl text-center text-gray-200">
							Use the Evental Organizer dashboard to customize your events branding to fit your
							organizations needs. You can customize your event color/branding, logo, and more. Set
							links to your website, social media, and more for all of your attendees to see.
						</Paragraph>
					</div>
				</Column>
			</div>

			<Column>
				<div className="flex flex-col items-center">
					<Heading variant="sm" level={6} className="text-primary mb-3">
						ROLES
					</Heading>
					<Heading level={2} variant="3xl" className="mb-3">
						Custom Attendee Roles
					</Heading>
					<Paragraph variant="lg" className="mb-3 max-w-3xl text-center text-gray-600">
						Create highly customizable roles for your attendees to categorize them into groups. You
						are not restrained by "Speaker" or "Exhibitor" roles for your event. See{' '}
						<Link href="/guides/role/creating-a-role">
							<a className="underline">creating a role</a>
						</Link>
					</Paragraph>
				</div>
			</Column>

			<div className="bg-primary-600">
				<Column>
					<div className="flex flex-col items-center text-white">
						<Heading variant="sm" level={6} className="text-gray-200 mb-3">
							SUPPORT
						</Heading>
						<Heading level={2} variant="3xl" className="mb-3">
							Guides & Documentation
						</Heading>
						<Paragraph variant="lg" className="mb-3 max-w-3xl text-center text-gray-200">
							If you are in need of assistance, first see{' '}
							<Link href="/guides">
								<a className="underline">our guides</a>
							</Link>
							. We have a collection of guides that will help you navigate the Evental organizer
							dashboard and manage your event. After reading the guides, If you are still in need of
							help you may{' '}
							<Link href="/contact">
								<a className="underline">contact us</a>
							</Link>
							. We are more than happy to help you setup your event or answer any questions you may
							have.
						</Paragraph>
					</div>
				</Column>
			</div>

			<Footer />
		</PageWrapper>
	);
};

export default HomePage;
