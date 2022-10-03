// import * as sgMail from "@sendgrid/mail";
import * as sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_CREDS_APIKEY);
export { sgMail };
