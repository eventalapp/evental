import Link from 'next/link';
import React from 'react';

export const Footer = () => {
	return (
		<footer className="bg-white border-t border-gray-200 shadow-sm-bottom">
			<div className="overflow-hidden py-12 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<nav className="flex flex-wrap justify-center -my-2 -mx-5" aria-label="Footer">
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

				<div className="flex justify-center items-center my-5">
					<span className="flex flex-row items-center">
						<img
							src="https://cdn.evental.app/images/logo.svg"
							className="pr-3 w-12 h-12"
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

				<p className="text-base text-center text-gray-400">
					&copy; {new Date().getFullYear()} Evental, Inc. All rights reserved.
				</p>
			</div>
		</footer>
	);
};
