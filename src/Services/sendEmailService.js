import nodemailer from "nodemailer"

export const sendEmailService = async ({
  to,
  subject,
  message,
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // smtp.gmail.com
    port: "587", // no ssl ******* 465 ssl
    secure: false, // >>> no ssl >>> 587
    service: "gmail", //optional
    auth: {
      user: "abdodabsha2016@gmail.com",
      pass: "vkzemwgpmwotyxlx",
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  const emailInfo = await transporter.sendMail({
    from: '"Trello App🙌"<abdodabsha2016@gmail.com>',
    to: to ? to : "",
    subject: subject ? subject : "Hii",
    html: message ? message : "",
    attachments,
  })
  console.log(emailInfo)

  if (emailInfo.accepted.length) {
    return true
  } else {
    return false
  }
}
