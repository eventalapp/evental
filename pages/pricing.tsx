import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { EventalProCard } from '../components/EventalProCard';
import { Footer } from '../components/Footer';
import { LinkButton } from '../components/form/LinkButton';
import Column from '../components/layout/Column';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';
import { PricingAccordion } from '../components/radix/components/PricingAccordion';
import Slider from '../components/radix/components/Slider';
import Button from '../components/radix/components/shared/Button';
import { Heading } from '../components/typography/Heading';
import { proAttendeePricing } from '../utils/const';

const PricingPage: NextPage = () => {
	const { control, watch } = useForm({ defaultValues: { attendees: 250 } });
	const [isEducation, setIsEducation] = useState(false);

	const attendees = watch('attendees');

	return (
		<PageWrapper>
			<NextSeo
				title="Pricing — Evental"
				description={`Single Event Plans & Pricing. Starting at ${proAttendeePricing[250].price} USD.`}
				openGraph={{
					url: 'https://evental.app/pricing',
					title: 'Pricing — Evental',
					description: `Single Event Plans & Pricing. Starting at ${proAttendeePricing[250].price} USD.`,
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
					<Heading>Single Event Plans &amp; Pricing</Heading>
					<p className="mt-4 max-w-2xl text-center text-base text-gray-100">
						View pricing for single event plans for standard and nonprofit or educational events.
					</p>
				</Column>
			</div>

			<Column className="flex flex-col items-center">
				<div className="mb-4 space-x-4">
					<Button
						variant={isEducation ? 'default' : 'primary'}
						onClick={() => {
							setIsEducation(false);
						}}
					>
						Standard
					</Button>
					<Button
						variant={isEducation ? 'primary' : 'default'}
						onClick={() => {
							setIsEducation(true);
						}}
					>
						Nonprofit/Education
					</Button>
				</div>

				<div className="relative">
					<div className="relative mx-auto max-w-full sm:w-full sm:max-w-[1200px]">
						<div className="absolute top-[30px] h-32 w-full overflow-visible sm:top-[100px]">
							<div className="bloom small bloom-one left-0" />
							<div className="bloom small bloom-three left-[34%] top-[120%]" />
							<div className="bloom small bloom-two right-0" />
						</div>
					</div>

					<EventalProCard attendees={attendees} isEducation={isEducation} className="relative">
						<Link href="/events/create">
							<LinkButton>Start Free Trial</LinkButton>
						</Link>
					</EventalProCard>
				</div>

				<div className="mt-4 flex flex-col items-center space-y-3 z-10 relative">
					<p className="text-lg font-medium">How many attendees are you expecting?</p>
					<Controller
						control={control}
						name="attendees"
						render={({ field }) => (
							<Slider
								onChange={(val) => {
									field.onChange(val);
								}}
								value={field.value}
								max={5000}
								min={250}
								step={250}
							/>
						)}
					/>

					{attendees >= 5000 && (
						<p className="text-gray-600">
							Expecting more than 5,000 people?{' '}
							<Link href="/contact">
								<a className="font-medium text-primary">Ask us for a same-day quote.</a>
							</Link>
						</p>
					)}

					<p className="text-xl">
						<strong>{attendees}</strong> Attendees
					</p>
				</div>
			</Column>

			<div className="dark-topography text-white">
				<Column className="flex items-center justify-center">
					<div className="flex flex-row flex-wrap items-center justify-center space-x-4">
						<p className="my-1.5 text-center text-sm font-medium md:text-lg">
							<span className="font-bold">Organizing several events?</span> We offer subscriptions
							from ${isEducation ? '800' : '1000'}/year.
						</p>
						<Link href="/contact">
							<LinkButton variant="default" className="my-1.5 border-0 text-primary-600">
								Contact Us
							</LinkButton>
						</Link>
					</div>
				</Column>
			</div>

			<Column>
				<div className="mb-6 flex flex-col items-center justify-center">
					<div className="flex flex-row items-center">
						<strong
							className="mr-2 font-display text-2xl font-bold tracking-tight lg:text-3xl"
							aria-label="evental homepage"
						>
							Evental
						</strong>
						<span className="rounded bg-primary py-1 px-2 text-xs font-medium text-white lg:text-base">
							{isEducation ? 'EDU' : 'PRO'}
						</span>
					</div>
					<p className="text-gray-600">Perks and features</p>
				</div>

				<div className="mt-3 grid grid-cols-1 gap-8 gap-x-6 lg:grid-cols-2">
					<div>
						<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">
							Publish Features
						</h3>
						<ul className="list-disc space-y-0.5 pl-5 text-gray-600">
							<li>Responsive event website</li>
							<li>Customizable event branding</li>
							<li>Control event privacy &amp; access</li>
							<li>Unlimited sessions, venues, pages, types, and roles</li>
							<li>Create custom top-level and standard pages</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">
							Attendee Experience
						</h3>
						<ul className="list-disc space-y-0.5 pl-5 text-gray-600">
							<li>Generate and export personal schedule</li>
							<li>View event from any device</li>
							<li>Sync personal schedule to calendar</li>
							<li>Create customizable user profile using the profile builder</li>
							<li>Browse attendee and role lists</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">
							Virtual &amp; Hybrid Events
						</h3>
						<ul className="list-disc space-y-0.5 pl-5 text-gray-600">
							<li>Use Evental with any webinar or video platform</li>
							<li>Automatically display times in users timezone</li>
							<li>Provide post-event access to session recordings</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">
							Role Management
						</h3>
						<ul className="list-disc space-y-0.5 pl-5 text-gray-600">
							<li>Create custom roles for speakers, artists, and exhibitors</li>
							<li>Attach role members to sessions</li>
							<li>Top level pages for role members</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">
							Communication
						</h3>
						<ul className="list-disc space-y-0.5 pl-5 text-gray-600">
							<li>Custom email builder to develop responsive emails</li>
							<li>Create a welcome email to automatically send to attendees</li>
							<li>Notify attendees when they have an upcoming session</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">
							Session Registration
						</h3>
						<ul className="list-disc space-y-0.5 pl-5 text-gray-600">
							<li>Attendees can register for sessions</li>
							<li>Filter sessions by date, type, venue, etc.</li>
							<li>Attach role members/speakers to sessions</li>
							<li>Set session max attendee limits and wait lists</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">
							Administration
						</h3>
						<ul className="list-disc space-y-0.5 pl-5 text-gray-600">
							<li>Remove attendees from your event</li>
							<li>Create organizers to assist you in running your event</li>
							<li>Export event and session data</li>
							<li>Access to Evental API</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">Support</h3>
						<ul className="list-disc space-y-0.5 pl-5 text-gray-600">
							<li>Organizer and attendee support guides</li>
							<li>24/7 Email support</li>
							<li>Dedicated account manager</li>
							<li>Post-event review session</li>
						</ul>
					</div>
				</div>
			</Column>

			<div className="dark-topography text-white">
				<Column className="flex items-center justify-center">
					<div className="flex flex-row flex-wrap items-center justify-center space-x-4">
						<p className="my-1.5 text-center text-sm font-medium md:text-lg">
							<span className="font-bold">Ready to start?</span> Get started building your event
							now!
						</p>
						<Link href="/events/create">
							<LinkButton variant="default" className="my-1.5 border-0 text-primary-600">
								Start Trial
							</LinkButton>
						</Link>
					</div>
				</Column>
			</div>

			<Column className="grid grid-cols-4 md:gap-6">
				<h3 className="col-span-4 mb-3 font-display text-2xl font-bold tracking-tight md:col-span-1">
					Frequently Asked Questions
				</h3>

				<PricingAccordion
					className="col-span-4 md:col-span-3"
					items={[
						{
							header: 'Do you offer a nonprofit or education plans?',
							content: (
								<p>
									Yes, we offer nonprofit and educational plans. Please{' '}
									<Link href="/contact">
										<a className="underline">Contact Us</a>
									</Link>{' '}
									if you are interested in learning more and accessing this plan.
								</p>
							)
						},

						{
							header: 'Is event setup assistance offered?',
							content: (
								<p>
									Yes, we offer event setup assistance. You can first review our{' '}
									<Link href="/guides">
										<a className="underline">Support Guides</a>
									</Link>
									, if you still need help, please{' '}
									<Link href="/contact">
										<a className="underline">Contact Us</a>
									</Link>
									.
								</p>
							)
						},
						{
							header: 'Do you offer any subscriptions plans?',
							content: (
								<p>
									Yes, we offer several subscription plans for and organizations/individuals who
									plan to hold several events in a year.
								</p>
							)
						},
						{
							header: 'What payment methods do you support?',
							content: (
								<p>
									We accept credit cards, debit cards, checks, wire transfers, ACH, and checks. If
									you are unsure if your payment method is supported. Please{' '}
									<Link href="/contact">
										<a className="underline">Contact Us</a>
									</Link>
									.
								</p>
							)
						},

						{
							header: 'How long of events can I host?',
							content: (
								<p>
									Currently we have a 1 month length limit on events. The event will still be
									viewable after the event end date for attendees, speakers, and organizers to view
									after the event.
								</p>
							)
						},
						{
							header: 'Do you provide quotes?',
							content: (
								<p>
									Yes, we can provide a quote. Please{' '}
									<Link href="/contact">
										<a className="underline">Contact Us</a>
									</Link>{' '}
									to receive a quote.
								</p>
							)
						},
						{
							header: 'How are your plans priced?',
							content: (
								<p>
									Our pricing is based off of the plan level you choose, and the number of attendees
									you are expecting. If you would like to learn more about our pricing, Please{' '}
									<Link href="/contact">
										<a className="underline">Contact Us</a>
									</Link>
									.
								</p>
							)
						},

						{
							header: 'Is there any training/support offered?',
							content: (
								<p>
									Yes, we offer several training and learning opportunities to allow you to easily
									setup and publish your event. Which includes administration, attendee, and speaker
									guides at the{' '}
									<Link href="/guides">
										<a className="underline">Support Guides</a>
									</Link>{' '}
									page.
								</p>
							)
						},
						{
							header: 'Is a free trial offered?',
							content: (
								<p>
									Yes, we offer a{' '}
									<Link href="/events/create">
										<a className="underline">Free Trial</a>
									</Link>{' '}
									so you can create roles, pages, sessions, invite organizers, and customize your
									event before purchasing a premium plan. If you have any questions regarding the
									free trial,{' '}
									<Link href="/contact">
										<a className="underline">Contact Us</a>
									</Link>
									.
								</p>
							)
						}
					]}
				/>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default PricingPage;
