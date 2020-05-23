import Link from 'next/link';
import React from 'react';

export const Footer = () => {
	return (
		<footer className="bg-white border-t border-gray-200 shadow-sm">
			<div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
				<nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
					<div className="px-5 py-2">
						<Link href="/about">
							<a className="text-base text-gray-500 hover:text-gray-900">About</a>
						</Link>
					</div>

					<div className="px-5 py-2">
						<Link href="/pricing">
							<a className="text-base text-gray-500 hover:text-gray-900">Pricing</a>
						</Link>
					</div>

					<div className="px-5 py-2">
						<Link href="/contact">
							<a className="text-base text-gray-500 hover:text-gray-900">Contact</a>
						</Link>
					</div>

					<div className="px-5 py-2">
						<Link href="/guides">
							<a className="text-base text-gray-500 hover:text-gray-900">Guides</a>
						</Link>
					</div>

					<div className="px-5 py-2">
						<Link href="/partners">
							<a className="text-base text-gray-500 hover:text-gray-900">Partners</a>
						</Link>
					</div>

					<div className="px-5 py-2">
						<Link href="/jobs">
							<a className="text-base text-gray-500 hover:text-gray-900">Jobs</a>
						</Link>
					</div>
				</nav>

				<div className="flex items-center justify-center my-5">
					<span className="flex flex-row items-center">
						<img
							src="https://cdn.evental.app/images/logo.svg"
							className="w-12 h-12 pr-3"
							alt="logo"
						/>
						<strong
							className="text-2xl tracking-tight font-bold font-display"
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
