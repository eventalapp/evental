import { convert } from 'html-to-text';
import mjml2html from 'mjml';

import { GenerateTemplateArgs } from '../generateTemplates';

const template = `
<mjml>
  <mj-head>
    <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" />
  </mj-head>

  <mj-body>
    <mj-section padding-bottom="0">
      <mj-column>
        <mj-image href="https://evental.app" target="_blank" width="40px" src="{{eventImageUrl}}" />

        <mj-text font-weight="medium" font-size="20px" color="#777777" align="center" font-family="Inter, Roboto, Arial" line-height="1.4">
          <a href="{{eventUrl}}" style="text-decoration:none;color: #777777;">{{eventName}}</a>
        </mj-text>

        <mj-divider border-color="#CDCDCD" border-width="1px" />
      </mj-column>
    </mj-section>

    <mj-section padding="0">
      <mj-column>
        <mj-text font-weight="bold" font-size="30px" color="#111827" align="center" font-family="Inter, Roboto, Arial" line-height="1.2">{{title}}
        </mj-text>

        <mj-text font-size="16px" color="#777777" font-family="Inter, Roboto, Arial" line-height="1.4">{{body}}
        </mj-text>
        
           <mj-text font-size="13px" color="#777777" font-family="Inter, Roboto, Arial" line-height="1.4" align="right">
             <a href="{{messageUrl}}" style="color: #0066FF; text-decoration:none;">
               View Full Message
             </a>
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section padding="0 0 20px 0">
      <mj-column>
        <mj-divider border-color="#CDCDCD" border-width="1px" />

        <mj-text font-size="12px" color="#777777" font-family="Inter, Roboto, Arial" line-height="1.4" align="center">
          You are receiving this email because you are attending <a href="{{eventUrl}}" style="color: #0066FF; text-decoration:none;">{{eventName}}</a>
          
          <br />
          
          To stop receiving emails from <a href="{{eventUrl}}" style="color: #0066FF; text-decoration:none;">{{eventName}}</a>, either leave the event, or delete your account.
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

export const eventMessage: GenerateTemplateArgs = {
	textPart: text,
	htmlPart: htmlOutput.html,
	subjectPart: '{{title}}',
	templateName: 'EventMessage'
};
