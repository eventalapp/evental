import Prisma from '@prisma/client';

type ClaimProfileArgs = {
	claimLink: string;
	event: Prisma.Event;
	inviterName: string;
	role: Prisma.EventRole;
};

export const claimProfileTemplate = (args: ClaimProfileArgs) => `
 <mjml>
    <mj-head>
        <mj-font name="Inter"
                 href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
        <mj-style inline="inline">
            .link-button {
                text-decoration: none;
                background-color: #0066FF;
                color: #ffffff;
                padding: 8px 15px;
                border-radius: 5px
            }
        </mj-style>
    </mj-head>

    <mj-body>
        <mj-section>
            <mj-column>
                <mj-image width="150px" src="https://cdn.evental.app/images/logo-text.png"/>

                <mj-divider border-color="#CDCDCD" border-width='3px'/>

                <mj-text font-weight="bold" font-size="30px" color="#111827" align="center" font-family="Inter, Roboto, Arial">
                	Claim your profile
                </mj-text>

                <mj-text padding-bottom="30px" font-size="16px" color="#111827" font-family="Inter, Roboto, Arial">
					${args.inviterName} has created a profile for you as a ${args.role.name} for the ${args.event.name} event.
                </mj-text> 
 
                <mj-text font-size="16px" color="#5C41FF" font-family="Inter, Roboto, Arial">
                    <a class="link-button" href="${args.claimLink}" target="_blank">
                    	Claim profile
                    </a>
                </mj-text>
            </mj-column>
        </mj-section>
    </mj-body>
</mjml>
`;
