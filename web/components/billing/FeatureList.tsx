import React from 'react';

export const FeatureList: React.FC = () => {
	return (
		<div className="mt-3 grid grid-cols-1 gap-8 gap-x-6 lg:grid-cols-2">
			<div>
				<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">Publish Features</h3>
				<ul className="list-disc space-y-0.5 pl-5 text-gray-600">
					<li>Responsive event website</li>
					<li>Customizable event branding</li>
					<li>Control event privacy &amp; access</li>
					<li>Unlimited sessions, venues, pages, categories, and roles</li>
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
				<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">Role Management</h3>
				<ul className="list-disc space-y-0.5 pl-5 text-gray-600">
					<li>Create custom roles for speakers, artists, and exhibitors</li>
					<li>Attach role members to sessions</li>
					<li>Top level pages for role members</li>
				</ul>
			</div>
			<div>
				<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">Communication</h3>
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
				<h3 className="mb-2 border-b border-gray-300 pb-1 text-xl font-medium">Administration</h3>
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
	);
};
