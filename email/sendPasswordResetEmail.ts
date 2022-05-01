import mjml2html from 'mjml';
import { convert } from 'html-to-text';
import { sendEmail } from '../utils/sendEmail';

const resetPasswordMjml = (resetPasswordLink: string) => `
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

                <mj-text font-weight="bold" font-size="30px" color="#111827" align="center" font-family="Inter, Roboto, Arial">Password
                    Reset
                </mj-text>

                <mj-text padding-bottom="30px" font-size="16px" color="#111827" font-family="Inter, Roboto, Arial">You have requested a
                    password change.
                </mj-text>

                <mj-text font-size="16px" color="#5C41FF" font-family="Inter, Roboto, Arial">
                    <a class="link-button" href="${resetPasswordLink}" target="_blank">Reset password</a>
                </mj-text>
            </mj-column>
        </mj-section>
    </mj-body>
</mjml>
`;

export const sendPasswordResetEmail = async (sendToAddress: string, resetPasswordLink: string) => {
	const htmlOutput = mjml2html(
		resetPasswordMjml(`https://evental.app/auth/password/reset?code=${resetPasswordLink}`)
	);

	const text = convert(htmlOutput.html, {
		wordwrap: 130
	});

	const params = {
		Content: {
			Simple: {
				Body: {
					Html: {
						Data: htmlOutput.html,
						Charset: 'UTF-8'
					},
					Text: {
						Data: text,
						Charset: 'UTF-8'
					}
				},
				Subject: {
					Data: 'Password Reset',
					Charset: 'UTF-8'
				}
			}
		},
		Destination: {
			ToAddresses: [sendToAddress]
		},
		FromEmailAddress: 'no-reply@evental.app'
	};

	await sendEmail(params);
};
