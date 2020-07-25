import { SESV2 } from 'aws-sdk';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';
import { NextkitError } from 'nextkit';

import { StrippedUser } from '@eventalapp/shared/utils';

import { sendEmail } from '../../utils/email';
import { GenerateTemplateArgs } from '../generateTemplates';

type WelcomeTemplateArgs = {
	name: string;
};

export const template = `
<mjml>
  <mj-head>
    <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" />
  </mj-head>

  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-weight="bold" font-size="30px" color="#111827" align="center" font-family="Inter, Roboto, Arial" line-height="1.2">Welcome, {{name}}!
        </mj-text>

        <mj-text font-size="16px" color="#777777" font-family="Inter, Roboto, Arial" line-height="1.4">We are happy you have decided to join us. If you have any questions feel free to reach us at <a href="mailto:support@evental.app" style="color: #0066FF; text-decoration:none;">
            support@evental.app
          </a> or <a href="https://evental.app/support" style="color: #0066FF; text-decoration:none;">
            create a support ticket</a>.
        </mj-text>

        <mj-text font-size="16px" color="#777777" font-family="Inter, Roboto, Arial" line-height="1.4">To get started using Evental:
          <ul style="margin: 10px auto 10px auto;">
            <li><a style="color: #0066FF; text-decoration:none;" href="https://evental.app/events/attending" target="_blank">View your events</a></li>
            <li style="padding-top: 3px"><a style="color: #0066FF; text-decoration:none;" href="https://evental.app/settings" target="_blank">Update your profile</a></li>
            <li style="padding-top: 3px"><a style="color: #0066FF; text-decoration:none;" href="https://evental.app/events/create" target="_blank">Create an event</a></li>
            <li style="padding-top: 3px"><a style="color: #0066FF; text-decoration:none;" href="https://evental.app/guides" target="_blank">Checkout our user guides</a></li>
          </ul>
        </mj-text>

      </mj-column>
    </mj-section>

    <mj-section padding="0 0 20px 0">
      <mj-column>
        <mj-divider border-color="#CDCDCD" border-width="1px" />

        <mj-text font-size="12px" color="#777777" font-family="Inter, Roboto, Arial" line-height="1.4" align="center">
          You are receiving this email because you signed up for <a href="https://evental.app/support" style="color: #202020; text-decoration:none;">Evental</a>. If you no longer would like to receive these emails, please <a href="https://evental.app/settings/notifications" style="color: #202020; text-decoration:none;">unsubscribe</a>.
        </mj-text>

        <mj-image href="https://evental.app" target="_blank" width="120px" src="https://cdn.evental.app/images/logo-text.png" />
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
	subjectPart: 'Welcome to Evental!',
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
		name: user.name
	};

	const params: SESV2.SendEmailRequest = {
		FromEmailAddress: `"Evental" <notifications@evental.app>`,
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
