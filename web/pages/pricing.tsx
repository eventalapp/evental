import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { EventalProCard } from '../components/billing/EventalProCard';
import { FaqAccordion } from '../components/billing/FaqAccordion';
import { FeatureList } from '../components/billing/FeatureList';
import Column from '../components/layout/Column';
import { Footer } from '../components/layout/Footer';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';
import { Button } from '../components/primitives/Button';
import { Heading } from '../components/primitives/Heading';
import { LinkButton } from '../components/primitives/LinkButton';
import Slider from '../components/primitives/Slider';
import { proAttendeePricing } from '../utils/price';

const PricingPage: NextPage = () => {
	const { control, watch } = useForm({ defaultValues: { attendees: 250 } });
	const [isEducation, setIsEducation] = useState(false);

	const attendees = watch('attendees');

	return (
		<>
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

			<PageWrapper>
				<div className="bg-primary-700 text-white">
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
								<LinkButton variant="primary">Start Free Trial</LinkButton>
							</Link>
						</EventalProCard>
					</div>

					<div className="relative z-10 mt-4 flex flex-col items-center space-y-3">
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

				<div className="bg-primary-700 text-white">
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

					<FeatureList />
				</Column>

				<div className="bg-primary-700 text-white">
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
					<Heading level={3} className="col-span-4 mb-3 md:col-span-1">
						Frequently Asked Questions
					</Heading>

					<FaqAccordion />
				</Column>
			</PageWrapper>

			<Footer />
		</>
	);
};

export default PricingPage;
