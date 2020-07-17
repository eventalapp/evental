import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import Column from '../components/layout/Column';
import { Footer } from '../components/layout/Footer';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';
import { Heading } from '../components/primitives/Heading';
import { LinkButton } from '../components/primitives/LinkButton';

const ContactPage: NextPage = () => {
	return (
		<>
			<NextSeo
				title="Contact — Evental"
				description="Contact our team for support. We are here to help you with any questions you may have."
				openGraph={{
					url: 'https://evental.app/contact',
					title: 'Contact — Evental',
					description:
						'Contact our team for support. We are here to help you with any questions you may have.',
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
						<Heading>Contact Us</Heading>
						<p className="mt-4 max-w-2xl text-center text-base text-gray-100">
							Have some suggestions or feedback? Questions about Evental? Just want to have a chat?
							We'd love to hear from you.
						</p>
					</Column>
				</div>

				<Column className="flex flex-col items-center">
					<div className="mb-10 grid grid-cols-1 gap-12 md:mb-16 md:grid-cols-2">
						<div className="rounded-md border border-gray-200 p-5 shadow-sm">
							<span className="mb-1 block text-center text-xl font-bold md:text-2xl">
								Questions/Support
							</span>
							<p className="text-center text-gray-600">
								Have questions or need support regarding Evental? Reach out by filling out a support
								ticket or emailing us at{' '}
								<a
									href="mailto:support@evental.app"
									className="underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									support@evental.app
								</a>
							</p>
							<div className="mt-6 flex flex-col items-center justify-center space-y-1">
								<Link href="/support">
									<LinkButton variant="primary">Create a ticket</LinkButton>
								</Link>
								<span className="text-sm text-gray-500">or</span>
								<p className="text-gray-700">
									Email us at{' '}
									<a
										href="mailto:support@evental.app"
										className="text-gray-900 underline"
										target="_blank"
										rel="noopener noreferrer"
									>
										support@evental.app
									</a>
								</p>
							</div>
						</div>
						<div className="rounded-md border border-gray-200 p-5 shadow-sm">
							<span className="mb-1 block text-center text-xl font-bold md:text-2xl">
								Contact Sales
							</span>
							<p className="text-center text-gray-600">
								Considering using Evental? Not sure if Evental will meet your needs? Reach out to
								our team by booking a call or demo below, or email us at{' '}
								<a
									href="mailto:sales@evental.app"
									className="underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									sales@evental.app
								</a>
							</p>
							<div className="mt-6 flex flex-col items-center justify-center space-y-1">
								<Link href="/demo">
									<LinkButton variant="primary">Book a call or demo</LinkButton>
								</Link>
								<span className="text-sm text-gray-500">or</span>
								<p className="text-gray-700">
									Email us at{' '}
									<a
										href="mailto:sales@evental.app"
										className="text-gray-900 underline"
										target="_blank"
										rel="noopener noreferrer"
									>
										sales@evental.app
									</a>
								</p>
							</div>
						</div>
					</div>

					<div>
						<h3 className="mb-1 text-center text-xl font-bold md:text-2xl">
							Not sure where to start?
						</h3>
						<p className="text-gray-700">
							Start by saying hello! For general inquiries, reach out to us at{' '}
							<a
								href="mailto:hello@evental.app"
								className="text-gray-900 underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								hello@evental.app
							</a>
						</p>
					</div>
				</Column>
			</PageWrapper>

			<Footer />
		</>
	);
};

export default ContactPage;
