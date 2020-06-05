import Prisma from '@prisma/client';

type EventMessageTemplateArgs = {
	sentBy?: string;
	title: string;
	body: string;
	event: Prisma.Event;
};

export const eventMessageTemplate = (args: EventMessageTemplateArgs) => {
	const { title, body, event } = args;

	return `
    <mjml>
    <mj-head>
      <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" />
    </mj-head>
  
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text font-weight="bold" font-size="30px" color="#111827" align="center" font-family="Inter, Roboto, Arial">${title}
          </mj-text>

          <mj-text font-weight="medium" font-size="20px" color="#111827" align="center" font-family="Inter, Roboto, Arial">${event.name}
          </mj-text>
  
          <mj-raw>
            ${body}
          </mj-raw>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;
};
