import { SESV2 } from 'aws-sdk';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';
import { NextkitError } from 'nextkit';

import { sendEmail } from '../../utils/email';
import { StrippedUser } from '../../utils/user';
import { GenerateTemplateArgs } from '../generateTemplates';

type WelcomeTemplateArgs = {
	name: string;
	createEventLink: string;
	updateProfileLink: string;
	viewEventsPageLink: string;
};

export const template = `
<mjml>
   <mj-head>
     <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
     <mj-style inline="inline">
       .link-button {
       text-decoration: none;
       background-color: #0066FF;
       color: #ffffff;
       padding: 8px 15px;
       border-radius: 5px
       }
       .link {
       text-decoration: none;
       color: #0066FF;
       padding: 0px 15px;
       margin: 0 5px;
       border-radius: 5px
       }
     </mj-style>
   </mj-head>

   <mj-body>
     <mj-section>
       <mj-column>
         <mj-image width="150px" src="https://cdn.evental.app/images/logo-text.png" />

         <mj-divider border-color="#CDCDCD" border-width='3px' />

         <mj-text font-weight="bold" font-size="30px" color="#111827" align="center" font-family="Inter, Roboto, Arial">Welcome {{name}}!
         </mj-text>

         <mj-text padding-bottom="10px" font-size="16px" color="#111827" font-family="Inter, Roboto, Arial">To get started, try out one of the following:
         </mj-text>

         <mj-text font-size="16px" padding-top="0" font-family="Inter, Roboto, Arial">
           <ul>
             <li><a class="link" href="{{viewEventPageLink}}" target="_blank">View Events</a></li>
             <li style="padding-top: 5px"><a class="link" href="{{updateProfileLink}}" target="_blank">Update your profile</a></li>
             <li style="padding-top: 5px"><a class="link" href="{{createEventLink}}" target="_blank">Create an Event</a></li>
           </ul>
         </mj-text>

       </mj-column>
     </mj-section>
   </mj-body>
 </mjml>
`;

const htmlOutput = mjml2html(template);

const text = convert(htmlOutput.html, {
	wordwrap: 130
});

export const welcome: GenerateTemplateArgs = {
	textPart: text,
	htmlPart: htmlOutput.html,
	subjectPart: 'Welcome to Evental',
	templateName: 'Welcome'
};

type SendWelcomeArgs = {
	toAddresses: string[];
	user: StrippedUser;
};

export const sendWelcome = async (args: SendWelcomeArgs) => {
	const { user, toAddresses } = args;

	if (toAddresses.length === 0) {
		throw new NextkitError(400, 'No recipients specified');
	}

	const templateData: WelcomeTemplateArgs = {
		name: user.name,
		viewEventsPageLink: 'https://evental.app/events',
		updateProfileLink: `https://evental.app/settings`,
		createEventLink: `https://evental.app/events/create`
	};

	const params: SESV2.SendEmailRequest = {
		FromEmailAddress: `"Evental" <messages@evental.app>`,
		ReplyToAddresses: ['"Evental Support" <support@evental.app>'],
		Destination: {
			ToAddresses: toAddresses
		},
		Content: {
			Template: {
				TemplateData: JSON.stringify(templateData),
				TemplateName: welcome.templateName
			}
		}
	};

	await sendEmail(params).catch((err) => {
		throw new NextkitError(500, err);
	});
};
