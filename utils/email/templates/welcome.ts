type Settings = {
	viewEventPageLink: string;
	createEventLink: string;
	updateProfileLink: string;
	name: string;
};

export const welcomeTemplate = ({
	viewEventPageLink,
	name,
	createEventLink,
	updateProfileLink
}: Settings) => `
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

         <mj-text font-weight="bold" font-size="30px" color="#111827" align="center" font-family="Inter, Roboto, Arial">Welcome ${name}!
         </mj-text>

         <mj-text padding-bottom="10px" font-size="16px" color="#111827" font-family="Inter, Roboto, Arial">To get started, try out one of the following:
         </mj-text>

         <mj-text font-size="16px" padding-top="0" font-family="Inter, Roboto, Arial">
           <ul>
             <li><a class="link" href="${viewEventPageLink}" target="_blank">View Events</a></li>
             <li style="padding-top: 5px"><a class="link" href="${updateProfileLink}" target="_blank">Update your profile</a></li>
             <li style="padding-top: 5px"><a class="link" href="${createEventLink}" target="_blank">Create an Event</a></li>
           </ul>
         </mj-text>

       </mj-column>
     </mj-section>
   </mj-body>
 </mjml>
`;
