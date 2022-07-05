import Prisma from '@prisma/client';

type RoleInviteArgs = {
	inviteLink: string;
	event: Prisma.Event;
	inviterName: string;
	role: Prisma.EventRole;
};

export const inviteRoleTemplate = (args: RoleInviteArgs) => `
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

                <mj-text font-weight="bold" font-size="30px" color="#111827" align="center" font-family="Inter, Roboto, Arial">${args.role.name} Invite for ${args.event.name}
                </mj-text>

                <mj-text padding-bottom="30px" font-size="16px" color="#111827" font-family="Inter, Roboto, Arial">${args.inviterName} has invited you to attend ${args.event.name} as a ${args.role.name}.
                </mj-text>

                <mj-text font-size="16px" color="#5C41FF" font-family="Inter, Roboto, Arial">
                    <a class="link-button" href="${args.inviteLink}" target="_blank">Accept Invite</a>
                </mj-text>
            </mj-column>
        </mj-section>
    </mj-body>
</mjml>
`;