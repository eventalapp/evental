import type { NextPage } from 'next';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Controller, useForm } from 'react-hook-form';
import Slider from '../components/radix/components/Slider';
import Link from 'next/link';
import { LinkButton } from '../components/form/LinkButton';
import { NextSeo } from 'next-seo';
import { proAttendeePricing } from '../utils/const';
import { PricingAccordion } from '../components/radix/components/PricingAccordion';
import Button from '../components/radix/components/shared/Button';
import { Footer } from '../components/Footer';

const PricingPage: NextPage = () => {
	const { control, watch } = useForm({ defaultValues: { attendees: 250 } });

	const attendees = watch('attendees');

	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Pricing"
				description="Single Event Plans & Pricing. Starting at $430 USD."
				openGraph={{
					url: 'https://evental.app/pricing',
					title: 'Pricing',
					description: 'Single Event Plans & Pricing. Starting at $430 USD.',
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
				<h1 className="text-2xl md:text-3xl font-bold">Single Event Plans & Pricing</h1>

				<div className="my-4 space-x-4">
					<Button>Standard</Button>
					<Button>Nonprofit/Education</Button>
				</div>

				<div className="bg-white border-gray-300 border rounded shadow-sm p-5 flex flex-col justify-between items-center space-y-4 max-w-[450px] min-h-[350px] my-3">
					<div className="flex flex-row items-center">
						<strong
							className="text-2xl tracking-tight font-bold font-display mr-2"
							aria-label="evental homepage"
						>
							Evental
						</strong>
						<span className="bg-primary text-white px-2 py-1 font-medium text-xs rounded">PRO</span>
					</div>

					<p className="text-gray-700">
						The pro plan allows event organizers to create unlimited events, sessions, venues, and
						pages. It also allows you to invite additional organizers to help you manage your event.
					</p>

					<div>
						<p className="font-bold text-xl text-center">${proAttendeePricing[attendees].price}</p>
						<p className="text-gray-600 text-sm text-center">Includes {attendees} attendees</p>
					</div>

					<Link href="/events/create">
						<LinkButton>Start Free Trial</LinkButton>
					</Link>
					<Link href="/contact">
						<a className="text-sm text-gray-500">
							Need help? <span className="text-gray-800 underline">Contact us</span>
						</a>
					</Link>
				</div>

				<div className="flex flex-col items-center space-y-3 mt-4">
					<p className="text-lg font-medium text-gray-700">How many attendees do you expect?</p>
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
							More than 5,000 people?{' '}
							<Link href="/contact">
								<a className="text-primary font-medium">Ask us for a same-day quote.</a>
							</Link>
						</p>
					)}

					<p className="text-xl">
						<strong>{attendees}</strong> Attendees
					</p>
				</div>
			</Column>

			<div className="bg-primary text-white">
				<Column className="flex items-center justify-center">
					<div className="flex flex-row flex-wrap items-center justify-center space-x-4">
						<p className="text-sm md:text-lg text-center my-1.5 font-medium">
							<span className="font-bold">Organizing multiple events?</span> Subscriptions are
							available from $1000/year.
						</p>
						<Link href="/contact">
							<LinkButton variant="inversePrimary" className="my-1.5">
								Contact Sales
							</LinkButton>
						</Link>
					</div>
				</Column>
			</div>

			<Column>
				<div className="flex items-center justify-center flex-col mb-6">
					<div className="flex flex-row items-center">
						<strong
							className="text-2xl lg:text-3xl tracking-tight font-bold font-display mr-2"
							aria-label="evental homepage"
						>
							Evental
						</strong>
						<span className="bg-primary text-white px-2 py-1 font-medium text-xs lg:text-md rounded">
							PRO
						</span>
					</div>
					<p className="text-gray-600">Perks and features</p>
				</div>

				<div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-8 gap-x-6">
					<div>
						<h3 className="text-xl font-medium mb-2 pb-1 border-b border-gray-300">
							Publish Features
						</h3>
						<ul className="list-disc pl-5 space-y-0.5">
							<li>Event website</li>
							<li>Customizable event branding</li>
							<li>Control event privacy & access</li>
							<li>Unlimited sessions, venues, and roles</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-2 pb-1 border-b border-gray-300">
							Virtual & Hybrid Events
						</h3>
						<ul className="list-disc pl-5 space-y-0.5">
							<li>Use Evental with any webinar or video platform</li>
							<li>Control access to webinar or video content</li>
							<li>Allow attendees to update Eventalule to their time zone</li>
							<li>Provide post-event access to session recordings</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-2 pb-1 border-b border-gray-300">
							Speaker, Sponsor & Exhibitor Management
						</h3>
						<ul className="list-disc pl-5 space-y-0.5">
							<li>Speaker profiles</li>
							<li>Speaker tools</li>
							<li>Sponsor & exhibitor profiles</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-2 pb-1 border-b border-gray-300">
							Communication
						</h3>
						<ul className="list-disc pl-5 space-y-0.5">
							<li>Send emails to event participants</li>
							<li>Automated schedule reminders</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-2 pb-1 border-b border-gray-300">
							Attendee Experience
						</h3>
						<ul className="list-disc pl-5 space-y-0.5">
							<li>Create personal schedule</li>
							<li>Access event from any device</li>
							<li>Sync schedule to calendar</li>
							<li>Create customizable user profile</li>
							<li>Browse attendee directory</li>
							<li>Access event Twitter feed</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-2 pb-1 border-b border-gray-300">
							Event Registration
						</h3>
						<ul className="list-disc pl-5 space-y-0.5">
							<li>Sign up for event on Evental</li>
							<li>Attendee registration form</li>
							<li>Google & Facebook single sign-on</li>
							<li>Email domain whitelisting</li>
							<li>Import attendees via spreadsheet upload</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-2 pb-1 border-b border-gray-300">
							Session Registration
						</h3>
						<ul className="list-disc pl-5 space-y-0.5">
							<li>Attendees can register for sessions</li>
							<li>Set session capacities and wait lists</li>
							<li>Prevent double booking of concurrent sessions</li>
							<li>Freeze attendee schedules</li>
							<li>Import attendees via spreadsheet upload</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-2 pb-1 border-b border-gray-300">
							Administration
						</h3>
						<ul className="list-disc pl-5 space-y-0.5">
							<li>Event data and reporting</li>
							<li>Gather session feedback</li>
							<li>Access to Evental API</li>
							<li>Session check-in data and reporting</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-2 pb-1 border-b border-gray-300">Support</h3>
						<ul className="list-disc pl-5 space-y-0.5">
							<li>Support guides</li>
							<li>Email support</li>
							<li>Live chat support</li>
							<li>Dedicated account manager</li>
							<li>Post-event review session</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-2 pb-1 border-b border-gray-300">
							Event Admins / Organizers
						</h3>
						<ul className="list-disc pl-5 space-y-0.5">
							<li>Up to 5 admins / organizers</li>
						</ul>
					</div>
				</div>
			</Column>

			<div className="bg-primary text-white">
				<Column className="flex items-center justify-center">
					<div className="flex flex-row flex-wrap items-center justify-center space-x-4">
						<p className="text-sm md:text-lg text-center my-1.5 font-medium">
							Get started building your event now!
						</p>
						<Link href="/events/create">
							<LinkButton variant="inversePrimary" className="my-1.5">
								Start Trial
							</LinkButton>
						</Link>
					</div>
				</Column>
			</div>

			<Column className="grid grid-cols-4 md:gap-6">
				<h3 className="text-2xl tracking-tight font-bold font-display mb-3 col-span-4 md:col-span-1">
					Frequently Asked Questions
				</h3>

				<PricingAccordion
					className="col-span-4 md:col-span-3"
					items={[
						{
							header: 'Do you offer a nonprofit or education pricing?',
							content: (
								<p>
									Yes, we offer nonprofit and educational pricing. You can view this here. Please
									contact us if you would like to access this pricing.
								</p>
							)
						},
						{
							header: 'Do you offer a 100% money-back guarantee?',
							content: (
								<p>
									Yes, we offer a 60-day, 100% money-back guarantee if you and your event
									administrators go through our support guides & video tutorials, view at least one
									webinar recording, and set up your event.
								</p>
							)
						},
						{
							header: 'What training, development or support do you offer?',
							content: (
								<p>
									We offer a variety of training and development opportunities for you and your
									team. This includes support guides, in-app. software tutorials, pre-recorded
									training videos, live training/support sessions, and ongoing and on-demand
									educational webinars.
								</p>
							)
						},
						{
							header: 'What forms of payment do you accept?',
							content: (
								<p>
									We accept credit cards, debit cards, ACH, wire transfers, purchase orders (POs),
									and checks. POs/checks are only available for approved organizations. Payment
									options are available after you sign up for a free trial.
								</p>
							)
						},
						{
							header: 'Do you offer subscriptions?',
							content: (
								<p>
									Yes, we offer subscriptions for organizations and individuals holding multiple
									events over time. Please contact us for questions about subscriptions.
								</p>
							)
						},
						{
							header: 'Do you offer payment plans?',
							content: (
								<p>
									Yes, we offer payment plans for approved organizations and individuals. Payment
									plans for approved organizations range from 30-90 days and typically require an
									initial payment of at least 33% upon delivery of service.
								</p>
							)
						},
						{
							header: 'Are you able to provide a quote?',
							content: <p>Yes, we can provide a quote. Please Contact Us to arrange this.</p>
						},
						{
							header: 'How does your pricing work?',
							content: (
								<p>
									Pricing is based on 1) the plan you choose and 2) the number of attendees you
									expect at your event. On each plan we have single event and annual subscription
									options available. Contact us if you would like to discuss your options.
								</p>
							)
						},
						{
							header: 'Are you GDPR and CCPA compliant?',
							content: (
								<p>
									Yes, we are compliant with these and other privacy and protection practices.
									Please contact us with any specific questions or concerns.
								</p>
							)
						},
						{
							header: 'What is the maximum length of an event?',
							content: (
								<p>
									The only limitation we have on length of your event is that, on a single event
									plan, an event can be no longer than 1 month. This relates only to the actual
									dates of the event itself (ie. from first to last session). You can have your
									event live as long as you would like before and after for your attendees to
									browse, sign up, access content etc. Contact Us for quote if you are looking at
									hosting a longer event.
								</p>
							)
						},
						{
							header: 'Do you offer setup and implementation assistance?',
							content: (
								<p>
									Yes, we offer setup and implementation assistance. You can review our Support
									Guides, contact our Support Team, or view our webinar recordings. If you wanted
									additional and dedicated help, you can arrange this through Evental Event
									Services.
								</p>
							)
						},
						{
							header: 'Do you offer a free trial?',
							content: (
								<p>
									Yes, we offer a 30-day free trial if you would like to test out Evental before
									purchasing. You can start creating your event here. You can also contact us if you
									require a longer free trial period. Note: You won’t have full functionality and/or
									a live event whilst you’re in the free trial mode but if you did want to test it
									in this capacity, contact us and we can set your event live for a few days.
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
