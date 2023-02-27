import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_CREDS_APIKEY)
export { sgMail }
