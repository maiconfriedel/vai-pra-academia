import { env } from '@server/env'
import nodemailer from 'nodemailer'

interface MailOptions {
  to: string
  subject: string
  text: string
}

export const sendEmail = async ({ to, subject, text }: MailOptions) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: false, // use SSL
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  })

  // Configure the mailoptions object
  const mailOptions: nodemailer.SendMailOptions = {
    from: 'naoresponda@vaipraacademia.com',
    to,
    subject,
    html: text,
  }

  // Send the email
  const response = await transporter.sendMail(mailOptions)

  if (response.accepted.length > 0) {
    console.log('Email sent successfully!')
  } else {
    console.log('Email failed to send!')
  }
}
