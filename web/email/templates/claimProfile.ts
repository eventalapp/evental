import * as Prisma from '@prisma/client';
import { SESV2 } from 'aws-sdk';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';
import { NextkitError } from 'nextkit';

import { sendEmail } from '../../utils/email';
import { GenerateTemplateArgs } from '../generateTemplates';

type ClaimProfileTemplateArgs = {
	inviterName: string;
	roleName: string;
	eventName: string;
	claimLink: string;
};

export const template = `
 <mjml>
  <mj-head>
    <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" />
  </mj-head>

  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-weight="bold" font-size="30px" color="#111827" align="center" font-family="Inter, Roboto, Arial" line-height="1.2">Claim your profile
        </mj-text>

        <mj-text font-size="16px" color="#777777" font-family="Inter, Roboto, Arial" line-height="1.4">{{inviterName}} has created a profile for you as a {{roleName}} for the {{eventName}} event.
        </mj-text>

        <mj-text font-size="16px" color="#5C41FF" font-family="Inter, Roboto, Arial" align="center" padding-top="15px" padding-bottom="15px">
          <a href="{{claimLink}}" target="_blank" style="text-decoration: none; background-color: #0066FF; color: #ffffff; padding: 8px 15px; border-radius: 5px;">Claim profile</a>
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section padding="0 0 20px 0">
      <mj-column>
        <mj-divider border-color="#CDCDCD" border-width="1px" />

        <mj-text font-size="12px" color="#777777" font-family="Inter, Roboto, Arial" line-height="1.4" align="center">
          You are receiving this email because an account has been created for you on <a href="https://evental.app/support" style="color: #202020; text-decoration:none;">Evental</a>. If you no longer would like to receive these emails, please <a href="https://evental.app/settings/notifications" style="color: #202020; text-decoration:none;">unsubscribe</a>.
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

export const claimProfile: GenerateTemplateArgs = {
	textPart: text,
	htmlPart: htmlOutput.html,
	subjectPart: 'Claim your profile',
	templateName: 'ClaimProfile'
};

type SendClaimProfileArgs = {
	toAddresses: string[];
	event: Prisma.Event;
	inviterName: string;
	role: Prisma.EventRole;
	claimCode: string;
};

export const sendClaimProfile = async (args: SendClaimProfileArgs) => {
	const { event, inviterName, role, toAddresses, claimCode } = args;

	if (toAddresses.length === 0) {
		throw new NextkitError(400, 'No recipients specified');
	}

	const templateData: ClaimProfileTemplateArgs = {
		eventName: event.name,
		claimLink: `https://${
			process.env.NEXT_PUBLIC_VERCEL_URL ?? 'evental.app'
		}/auth/claim?code=${claimCode}`,
		roleName: role.name,
		inviterName: inviterName
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
				TemplateName: claimProfile.templateName
			}
		}
	};

	await sendEmail(params).catch((err) => {
		throw new NextkitError(500, err);
	});
};
