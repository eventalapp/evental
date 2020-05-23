import type { NextPage } from 'next';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { NextSeo } from 'next-seo';
import { Footer } from '../components/Footer';
import { LinkButton } from '../components/form/LinkButton';
import Link from 'next/link';

const ContactPage: NextPage = () => {
	return (
		<PageWrapper variant="white">
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

			<Column className="flex flex-col items-center">
				<h1 className="text-2xl md:text-3xl font-bold">Contact Us</h1>

				<p className="text-lg text-gray-600 max-w-2xl text-center mt-3">
					Have some suggestions or feedback? Questions about Evental? Just want to have a chat? We'd
					love to hear from you.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-10 md:my-16">
					<div>
						<span className="block text-xl md:text-2xl mb-1 font-bold text-center">
							Questions/Support
						</span>
						<p className="text-gray-600 text-center">
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
						<div className="flex flex-col items-center justify-center mt-6 space-y-1">
							<Link href="/support">
								<LinkButton>Create a ticket</LinkButton>
							</Link>
							<span className="text-gray-500 text-sm">or</span>
							<p className="text-gray-700">
								Email us at{' '}
								<a
									href="mailto:support@evental.app"
									className="underline text-gray-900"
									target="_blank"
									rel="noopener noreferrer"
								>
									support@evental.app
								</a>
							</p>
						</div>
					</div>
					<div>
						<span className="block text-xl md:text-2xl mb-1 font-bold text-center">
							Contact Sales
						</span>
						<p className="text-gray-600 text-center">
							Considering using Evental? Not sure if Evental will meet your needs? Reach out to our
							team by booking a call or demo below, or email us at{' '}
							<a
								href="mailto:sales@evental.app"
								className="underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								sales@evental.app
							</a>
						</p>
						<div className="flex flex-col items-center justify-center mt-6 space-y-1">
							<Link href="/demo">
								<LinkButton>Book a call or demo</LinkButton>
							</Link>
							<span className="text-gray-500 text-sm">or</span>
							<p className="text-gray-700">
								Email us at{' '}
								<a
									href="mailto:sales@evental.app"
									className="underline text-gray-900"
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
					<h3 className="text-xl md:text-2xl mb-1 font-bold text-center">
						Not sure where to start?
					</h3>
					<p className="text-gray-700">
						Start by saying hello! For general inquiries, reach out to us at{' '}
						<a
							href="mailto:hello@evental.app"
							className="underline text-gray-900"
							target="_blank"
							rel="noopener noreferrer"
						>
							hello@evental.app
						</a>
					</p>
				</div>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default ContactPage;
