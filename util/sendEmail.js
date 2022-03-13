import  sgMail from '@sendgrid/mail'

export const sendEmail = async (recipient,token) =>{

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: recipient, // Change to your recipient
  from: 'davidtzirima@gmail.com', // Change to your verified sender
  subject: 'Password Reset',
  text: 'Password Reset request on your account, ignore if you are not the one',
  html: `<strong>Token :${token}</strong>`,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}