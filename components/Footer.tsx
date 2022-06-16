import Link from 'next/link';
import React from 'react';

export const Footer = () => {
	return (
		<footer className="shadow-sm-bottom border-t border-gray-200 bg-white">
			<div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
				<nav className="-my-2 -mx-5 flex flex-wrap justify-center" aria-label="Footer">
					<div className="py-2 px-5">
						<Link href="/about">
							<a className="text-base text-gray-500 hover:text-gray-900">About</a>
						</Link>
					</div>

					<div className="py-2 px-5">
						<Link href="/pricing">
							<a className="text-base text-gray-500 hover:text-gray-900">Pricing</a>
						</Link>
					</div>

					<div className="py-2 px-5">
						<Link href="/contact">
							<a className="text-base text-gray-500 hover:text-gray-900">Contact</a>
						</Link>
					</div>

					<div className="py-2 px-5">
						<Link href="/guides">
							<a className="text-base text-gray-500 hover:text-gray-900">Guides</a>
						</Link>
					</div>

					<div className="py-2 px-5">
						<Link href="/events">
							<a className="text-base text-gray-500 hover:text-gray-900">Events</a>
						</Link>
					</div>
				</nav>

				<div className="my-5 flex items-center justify-center">
					<span className="flex flex-row items-center">
						<img
							src="https://cdn.evental.app/images/logo.svg"
							className="h-12 w-12 pr-3"
							alt="logo"
						/>
						<strong
							className="font-display text-2xl font-bold tracking-tight"
							aria-label="evental homepage"
						>
							Evental
						</strong>
					</span>
				</div>

				<p className="text-center text-base text-gray-400">
					&copy; {new Date().getFullYear()} Evental, Inc. All rights reserved.
				</p>
			</div>
		</footer>
	);
};
