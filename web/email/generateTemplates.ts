import * as fs from 'fs';

import { claimProfile } from './templates/claimProfile';
import { eventMessage } from './templates/eventMessage';
import { inviteOrganizer } from './templates/inviteOrganizer';
import { inviteRole } from './templates/inviteRole';
import { resetPassword } from './templates/resetPassword';
import { sales } from './templates/sales';
import { verifyEmail } from './templates/verifyEmail';
import { welcome } from './templates/welcome';

export type GenerateTemplateArgs = {
	templateName: string;
	subjectPart: string;
	textPart: string;
	htmlPart: string;
};

export const generateTemplates = (args: GenerateTemplateArgs) => {
	const { templateName, subjectPart, textPart, htmlPart } = args;

	fs.mkdirSync(`./email/output/${templateName}`, { recursive: true });

	const template = `{
    "Template": {
      "TemplateName": ${JSON.stringify(templateName)},
      "SubjectPart": ${JSON.stringify(subjectPart)},
      "TextPart": ${JSON.stringify(textPart)},
      "HtmlPart": ${JSON.stringify(htmlPart)}
    }
  }`;

	fs.writeFileSync(`./email/output/${templateName}/template.json`, template);

	const getInsideDoubleCurly = (str: string) =>
		str
			.split('{{')
			.filter((val) => val.includes('}}'))
			.map((val) => val.substring(0, val.indexOf('}}')));

	const argsText = new Set(getInsideDoubleCurly(htmlPart));

	const argObject: Record<string, string> = {};

	argsText.forEach((val) => {
		argObject[val] = val;
	});

	const operation = `{
		"Source": "notifications@evental.app",
		"Template": ${JSON.stringify(templateName)},
		"Destination": {
			"ToAddresses": [ "email@gmail.com" ]
		},
		"TemplateData": ${JSON.stringify(JSON.stringify(argObject))}
  }`;

	fs.writeFileSync(`./email/output/${templateName}/operation.json`, operation);
};

const templatesToGenerate = [
	eventMessage,
	claimProfile,
	welcome,
	verifyEmail,
	inviteOrganizer,
	inviteRole,
	resetPassword,
	sales
];

templatesToGenerate.forEach((template) => {
	generateTemplates(template);
});

// CLI CRUD

// aws ses send-templated-email --cli-input-json file://operation.json

// aws ses create-template --cli-input-json file://template.json

// aws ses delete-template --template-name EventMessage

//aws ses update-template --cli-input-json file://template.json
