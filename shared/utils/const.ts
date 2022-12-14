export const copy = {
	tooltip: {
		defaultRole:
			'You can set this role to the default role. When new members join your event, they will be given this role.',
		sendType:
			'The send type will determine who will receive this message. Select role to send this message to a role, or everyone to send it to everyone.',
		sendTypeRole: 'When the send type is role, select the role to send this message to.',
		category:
			'A session category is used to categorize sessions. If you do not wish to set a category, select "No Category"',
		color: 'Pick a color for your event to push your brand. We recommend you pick a darker color.',
		venue:
			'A venue is used to group sessions by location. If you do not wish to set a venue, select "No Venue"',
		maxAttendees:
			'You can specify the max attendees to limit how many people can attend a session. Leave the input blank if you do not want to set an attendee limit.',
		topLevel: 'A top level page is displayed on the main navigation for the event.',
		attachPeople:
			'You can attach people to a session, they will be listed under their role. If a user has the Speaker role, they will show as a Speaker for this session.',
		typeColor: 'A color is used to identify a session category.',
		eventType: 'You can specify whether your event is In-Person, Hybrid, or Virtual.',
		eventPrivacy:
			'If your event is Public, it will be displayed on the public events page. If your event is Unlisted, only users with the link to the event will be able to view it. And if it is Private, only organizers can view your event.',
		eventTimeZone:
			'You can specify the timezone for your event, all times will be displayed in the users timezone regardless.',
		eventSlug:
			'You can set the slug for your event, which will dictate the link/url for your event.',
		eventWebsite:
			'You can set the external website for your event, this will be displayed to all viewers of your event.',
		eventCategory:
			'You can define the category for your event, which will help identify which kind of event you are hosting.',
		userPosition:
			'You can specify your position here, this could be your job title, or your role in the event.',
		userCompany:
			'You can specify your company here, this could be your company name, or your organization.',
		userSlug:
			'You can set the username for your account, which will dictate the link/url for your profile.',
		userWebsite:
			'You can set the external website for your profile, this will be displayed to all viewers of your profile.',
		tinyImage:
			'You can set a tiny image for this role, this user images will be small when displayed in the role member list view.'
	}
};

export const timeZoneList = [
	'Europe/Andorra',
	'Asia/Dubai',
	'Asia/Kabul',
	'Europe/Tirane',
	'Asia/Yerevan',
	'Antarctica/Casey',
	'Antarctica/Davis',
	'Antarctica/DumontDUrville',
	'Antarctica/Mawson',
	'Antarctica/Palmer',
	'Antarctica/Rothera',
	'Antarctica/Syowa',
	'Antarctica/Troll',
	'Antarctica/Vostok',
	'America/Argentina/Buenos_Aires',
	'America/Argentina/Cordoba',
	'America/Argentina/Salta',
	'America/Argentina/Jujuy',
	'America/Argentina/Tucuman',
	'America/Argentina/Catamarca',
	'America/Argentina/La_Rioja',
	'America/Argentina/San_Juan',
	'America/Argentina/Mendoza',
	'America/Argentina/San_Luis',
	'America/Argentina/Rio_Gallegos',
	'America/Argentina/Ushuaia',
	'Pacific/Pago_Pago',
	'Europe/Vienna',
	'Australia/Lord_Howe',
	'Antarctica/Macquarie',
	'Australia/Hobart',
	'Australia/Currie',
	'Australia/Melbourne',
	'Australia/Sydney',
	'Australia/Broken_Hill',
	'Australia/Brisbane',
	'Australia/Lindeman',
	'Australia/Adelaide',
	'Australia/Darwin',
	'Australia/Perth',
	'Australia/Eucla',
	'Asia/Baku',
	'America/Barbados',
	'Asia/Dhaka',
	'Europe/Brussels',
	'Europe/Sofia',
	'Atlantic/Bermuda',
	'Asia/Brunei',
	'America/La_Paz',
	'America/Noronha',
	'America/Belem',
	'America/Fortaleza',
	'America/Recife',
	'America/Araguaina',
	'America/Maceio',
	'America/Bahia',
	'America/Sao_Paulo',
	'America/Campo_Grande',
	'America/Cuiaba',
	'America/Santarem',
	'America/Porto_Velho',
	'America/Boa_Vista',
	'America/Manaus',
	'America/Eirunepe',
	'America/Rio_Branco',
	'America/Nassau',
	'Asia/Thimphu',
	'Europe/Minsk',
	'America/Belize',
	'America/St_Johns',
	'America/Halifax',
	'America/Glace_Bay',
	'America/Moncton',
	'America/Goose_Bay',
	'America/Blanc-Sablon',
	'America/Toronto',
	'America/Nipigon',
	'America/Thunder_Bay',
	'America/Iqaluit',
	'America/Pangnirtung',
	'America/Atikokan',
	'America/Winnipeg',
	'America/Rainy_River',
	'America/Resolute',
	'America/Rankin_Inlet',
	'America/Regina',
	'America/Swift_Current',
	'America/Edmonton',
	'America/Cambridge_Bay',
	'America/Yellowknife',
	'America/Inuvik',
	'America/Creston',
	'America/Dawson_Creek',
	'America/Fort_Nelson',
	'America/Vancouver',
	'America/Whitehorse',
	'America/Dawson',
	'Indian/Cocos',
	'Europe/Zurich',
	'Africa/Abidjan',
	'Pacific/Rarotonga',
	'America/Santiago',
	'America/Punta_Arenas',
	'Pacific/Easter',
	'Asia/Shanghai',
	'Asia/Urumqi',
	'America/Bogota',
	'America/Costa_Rica',
	'America/Havana',
	'Atlantic/Cape_Verde',
	'America/Curacao',
	'Indian/Christmas',
	'Asia/Nicosia',
	'Asia/Famagusta',
	'Europe/Prague',
	'Europe/Berlin',
	'Europe/Copenhagen',
	'America/Santo_Domingo',
	'Africa/Algiers',
	'America/Guayaquil',
	'Pacific/Galapagos',
	'Europe/Tallinn',
	'Africa/Cairo',
	'Africa/El_Aaiun',
	'Europe/Madrid',
	'Africa/Ceuta',
	'Atlantic/Canary',
	'Europe/Helsinki',
	'Pacific/Fiji',
	'Atlantic/Stanley',
	'Pacific/Chuuk',
	'Pacific/Pohnpei',
	'Pacific/Kosrae',
	'Atlantic/Faroe',
	'Europe/Paris',
	'Europe/London',
	'Asia/Tbilisi',
	'America/Cayenne',
	'Africa/Accra',
	'Europe/Gibraltar',
	'America/Godthab',
	'America/Danmarkshavn',
	'America/Scoresbysund',
	'America/Thule',
	'Europe/Athens',
	'Atlantic/South_Georgia',
	'America/Guatemala',
	'Pacific/Guam',
	'Africa/Bissau',
	'America/Guyana',
	'Asia/Hong_Kong',
	'America/Tegucigalpa',
	'America/Port-au-Prince',
	'Europe/Budapest',
	'Asia/Jakarta',
	'Asia/Pontianak',
	'Asia/Makassar',
	'Asia/Jayapura',
	'Europe/Dublin',
	'Asia/Jerusalem',
	'Asia/Kolkata',
	'Indian/Chagos',
	'Asia/Baghdad',
	'Asia/Tehran',
	'Atlantic/Reykjavik',
	'Europe/Rome',
	'America/Jamaica',
	'Asia/Amman',
	'Asia/Tokyo',
	'Africa/Nairobi',
	'Asia/Bishkek',
	'Pacific/Tarawa',
	'Pacific/Enderbury',
	'Pacific/Kiritimati',
	'Asia/Pyongyang',
	'Asia/Seoul',
	'Asia/Almaty',
	'Asia/Qyzylorda',
	'Asia/Qostanay',
	'Asia/Aqtobe',
	'Asia/Aqtau',
	'Asia/Atyrau',
	'Asia/Oral',
	'Asia/Beirut',
	'Asia/Colombo',
	'Africa/Monrovia',
	'Europe/Vilnius',
	'Europe/Luxembourg',
	'Europe/Riga',
	'Africa/Tripoli',
	'Africa/Casablanca',
	'Europe/Monaco',
	'Europe/Chisinau',
	'Pacific/Majuro',
	'Pacific/Kwajalein',
	'Asia/Yangon',
	'Asia/Ulaanbaatar',
	'Asia/Hovd',
	'Asia/Choibalsan',
	'Asia/Macau',
	'America/Martinique',
	'Europe/Malta',
	'Indian/Mauritius',
	'Indian/Maldives',
	'America/Mexico_City',
	'America/Cancun',
	'America/Merida',
	'America/Monterrey',
	'America/Matamoros',
	'America/Mazatlan',
	'America/Chihuahua',
	'America/Ojinaga',
	'America/Hermosillo',
	'America/Tijuana',
	'America/Bahia_Banderas',
	'Asia/Kuala_Lumpur',
	'Asia/Kuching',
	'Africa/Maputo',
	'Africa/Windhoek',
	'Pacific/Noumea',
	'Pacific/Norfolk',
	'Africa/Lagos',
	'America/Managua',
	'Europe/Amsterdam',
	'Europe/Oslo',
	'Asia/Kathmandu',
	'Pacific/Nauru',
	'Pacific/Niue',
	'Pacific/Auckland',
	'Pacific/Chatham',
	'America/Panama',
	'America/Lima',
	'Pacific/Tahiti',
	'Pacific/Marquesas',
	'Pacific/Gambier',
	'Pacific/Port_Moresby',
	'Pacific/Bougainville',
	'Asia/Manila',
	'Asia/Karachi',
	'Europe/Warsaw',
	'America/Miquelon',
	'Pacific/Pitcairn',
	'America/Puerto_Rico',
	'Asia/Gaza',
	'Asia/Hebron',
	'Europe/Lisbon',
	'Atlantic/Madeira',
	'Atlantic/Azores',
	'Pacific/Palau',
	'America/Asuncion',
	'Asia/Qatar',
	'Indian/Reunion',
	'Europe/Bucharest',
	'Europe/Belgrade',
	'Europe/Kaliningrad',
	'Europe/Moscow',
	'Europe/Simferopol',
	'Europe/Kirov',
	'Europe/Astrakhan',
	'Europe/Volgograd',
	'Europe/Saratov',
	'Europe/Ulyanovsk',
	'Europe/Samara',
	'Asia/Yekaterinburg',
	'Asia/Omsk',
	'Asia/Novosibirsk',
	'Asia/Barnaul',
	'Asia/Tomsk',
	'Asia/Novokuznetsk',
	'Asia/Krasnoyarsk',
	'Asia/Irkutsk',
	'Asia/Chita',
	'Asia/Yakutsk',
	'Asia/Khandyga',
	'Asia/Vladivostok',
	'Asia/Ust-Nera',
	'Asia/Magadan',
	'Asia/Sakhalin',
	'Asia/Srednekolymsk',
	'Asia/Kamchatka',
	'Asia/Anadyr',
	'Asia/Riyadh',
	'Pacific/Guadalcanal',
	'Indian/Mahe',
	'Africa/Khartoum',
	'Europe/Stockholm',
	'Asia/Singapore',
	'America/Paramaribo',
	'Africa/Juba',
	'Africa/Sao_Tome',
	'America/El_Salvador',
	'Asia/Damascus',
	'America/Grand_Turk',
	'Africa/Ndjamena',
	'Indian/Kerguelen',
	'Asia/Bangkok',
	'Asia/Dushanbe',
	'Pacific/Fakaofo',
	'Asia/Dili',
	'Asia/Ashgabat',
	'Africa/Tunis',
	'Pacific/Tongatapu',
	'Europe/Istanbul',
	'America/Port_of_Spain',
	'Pacific/Funafuti',
	'Asia/Taipei',
	'Europe/Kiev',
	'Europe/Uzhgorod',
	'Europe/Zaporozhye',
	'Pacific/Wake',
	'America/New_York',
	'America/Detroit',
	'America/Kentucky/Louisville',
	'America/Kentucky/Monticello',
	'America/Indiana/Indianapolis',
	'America/Indiana/Vincennes',
	'America/Indiana/Winamac',
	'America/Indiana/Marengo',
	'America/Indiana/Petersburg',
	'America/Indiana/Vevay',
	'America/Chicago',
	'America/Indiana/Tell_City',
	'America/Indiana/Knox',
	'America/Menominee',
	'America/North_Dakota/Center',
	'America/North_Dakota/New_Salem',
	'America/North_Dakota/Beulah',
	'America/Denver',
	'America/Boise',
	'America/Phoenix',
	'America/Los_Angeles',
	'America/Anchorage',
	'America/Juneau',
	'America/Sitka',
	'America/Metlakatla',
	'America/Yakutat',
	'America/Nome',
	'America/Adak',
	'Pacific/Honolulu',
	'America/Montevideo',
	'Asia/Samarkand',
	'Asia/Tashkent',
	'America/Caracas',
	'Asia/Ho_Chi_Minh',
	'Pacific/Efate',
	'Pacific/Wallis',
	'Pacific/Apia',
	'Africa/Johannesburg'
];

export const timeZoneOptions = timeZoneList.map((timeZone) => ({
	value: timeZone,
	label: timeZone.replace(/_/g, ' ')
}));

export const FIFTEEN_MINUTES = 15 * 60 * 1000;

export const MAX_ATTENDEES = 5000;
