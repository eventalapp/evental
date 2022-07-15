import { SESV2 } from 'aws-sdk';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';
import { NextkitError } from 'nextkit';

import { sendEmail } from '../../utils/email';
import { GenerateTemplateArgs } from '../generateTemplates';

type SalesTemplateArgs = {
	eventName: string;
	organizationName: string;
};

export const template = `
<mjml>
  <mj-head>
    <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" />
  </mj-head>

  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px" color="#545454" font-family="Inter, Roboto, Arial" line-height="1.4">
          Greetings, {{organizationName}}!<br /><br />

          I recently caught word of {{eventName}}, and wanted to reach out on behalf of <a style="color: #0066FF;" href="https://evental.app">Evental</a> and see if you had all of your current/future event management needs sorted out.<br /><br />

          Here at Evental, we felt that event management software needs to be highly intuitive for organizers, attendees, speakers, etc. but the current event management solutions that exist are either overpriced, unintuitive and/or have poor user interface/experience.<br /><br />

          So we decided to build Evental with all of those pain points in mind, and now we are looking for some great organizations to utilize our new platform.<br /><br />

          To use our platform, we are offering <a style="color: #0066FF;" href="https://evental.app/pricing">Evental Pro</a> for <span style="font-weight: 900;">free</span> until October 31st, 2022. If you are hosting an event later than this date, we are happy to extend that offer! And we always offer a free trial to test our platform, and/or set up your event.<br /><br />

          Do you have a few minutes this week or next to chat regarding this offer and/or your event management needs?<br /><br />

          Thanks for the time,<br />

          Jack Kelly
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section padding="0 0 20px 0">
      <mj-column>
        <mj-divider border-color="#CDCDCD" border-width="1px" />


        <mj-text font-weight="bold" font-size="18px" color="#1f1f1f" font-family="Inter, Roboto, Arial" align="left">
          Jack Kelly
        </mj-text>


        <mj-text font-size="13px" color="#545454" font-family="Inter, Roboto, Arial" line-height="1.7" align="left">
          Email: <a style="color: #0066FF; text-decoration:none; font-weight: 500;" href="mailto:jack@evental.app">jack@evental.app</a> <br />
          Mobile: <a style="color: #0066FF; text-decoration:none; font-weight: 500;" href="tel:913-230-7925">+1 (913)-230-7925</a>
        </mj-text>


        <mj-image align="left" href="https://evental.app" target="_blank" width="120px" src="https://cdn.evental.app/images/logo-text.png" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

const htmlOutput = mjml2html(template);

const text = convert(htmlOutput.html, {
	wordwrap: 130
});

export const sales: GenerateTemplateArgs = {
	textPart: text,
	htmlPart: htmlOutput.html,
	subjectPart: 'Congrats on {{eventName}}!',
	templateName: 'Sales'
};

export type SendSalesArgs = {
	toAddresses: string[];
	eventName: string;
	organizationName: string;
};

export const sendSales = async (args: SendSalesArgs) => {
	const { organizationName, eventName, toAddresses } = args;

	if (toAddresses.length === 0) {
		throw new NextkitError(400, 'No recipients specified');
	}

	const templateData: SalesTemplateArgs = {
		organizationName,
		eventName
	};

	const params: SESV2.SendEmailRequest = {
		FromEmailAddress: `"Jack Kelly" <jack@evental.app>`,
		Destination: {
			ToAddresses: toAddresses,
			BccAddresses: ['jack@evental.app']
		},
		Content: {
			Template: {
				TemplateData: JSON.stringify(templateData),
				TemplateName: sales.templateName
			}
		}
	};

	await sendEmail(params).catch((err) => {
		throw new NextkitError(500, err);
	});
};
