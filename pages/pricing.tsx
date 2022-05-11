import type { NextPage } from 'next';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Controller, useForm } from 'react-hook-form';
import Slider from '../components/radix/components/Slider';
import Link from 'next/link';
import { LinkButton } from '../components/form/LinkButton';
import { attendeesToPrice } from '../utils/price';
import { NextSeo } from 'next-seo';

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

				<div className="flex flex-col items-center space-y-3 my-8">
					<p className="text-lg">How many attendees do you expect?</p>
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
				<div className="bg-white border-gray-300 border rounded shadow-sm p-5 flex flex-col justify-between items-center space-y-4 max-w-[450px] min-h-[350px]">
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
						<p className="font-bold text-xl text-center">${attendeesToPrice(attendees)}</p>
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
			</Column>
			<div className="bg-primary text-white">
				<Column className="flex items-center justify-center">
					<div className="flex flex-row items-center justify-center space-x-4">
						<p className="text-lg">
							<span className="font-medium">Organizing multiple events?</span> Subscriptions are
							available from $1000/year.
						</p>
						<Link href="/contact">
							<LinkButton variant="inversePrimary">Contact Sales</LinkButton>
						</Link>
					</div>
				</Column>
			</div>
			<Column>
				<div className="flex flex-row items-center">
					<strong
						className="text-2xl tracking-tight font-bold font-display mr-2"
						aria-label="evental homepage"
					>
						Evental
					</strong>
					<span className="bg-primary text-white px-2 py-1 font-medium text-xs rounded">PRO</span>
				</div>

				<div className="space-y-4 mt-3">
					<div>
						<h3 className="text-xl font-medium mb-1">Publish Features</h3>
						<ul>
							<li>Event website</li>
							<li>Customizable event branding</li>
							<li>Control event privacy & access</li>
							<li>Unlimited sessions, venues, and roles</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-1">Virtual & Hybrid Events</h3>
						<ul>
							<li>Use Evental with any webinar or video platform</li>
							<li>Control access to webinar or video content</li>
							<li>Allow attendees to update schedule to their time zone</li>
							<li>Provide post-event access to session recordings</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium mb-1">Speaker, Sponsor & Exhibitor Management</h3>
						<ul>
							<li>Speaker profiles</li>
							<li>Speaker tools</li>
							<li>Sponsor & exhibitor profiles</li>
						</ul>
					</div>
				</div>
			</Column>
		</PageWrapper>
	);
};

export default PricingPage;
