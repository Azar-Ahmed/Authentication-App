import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'

import ENV from '../config.js'

// https://ethereal.email/create

let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: ENV.EMAIL, // generated ethereal user
      pass: ENV.PASSWORD, // generated ethereal password
    },
}

let transporter = nodemailer.createTransport(nodeConfig)

let MailGenerator = new Mailgen({
    theme: "default",
    product:{
        name: "Mailgen",
        link: "https://mailgen.js/"
    }
})

export const registerMail = async (req, res)=>{
    const {username, userEmail, text, subject} = req.body;

    // email body
    let email = {
        body:{
            name: username,
            intro: text || 'Welcome to Auth project',
            outro: 'Need help, or have qusestion? just reply to this email'
        }        
    }
    let emailBody = MailGenerator.generate(email);

    let message = {
        from : ENV.EMAIL,
        to: userEmail,
        subject:subject || "Signup  Success",
        html: emailBody
    }

    // send mmail
    transporter.sendMail(message)
                .then(()=>{
                    return res.status(200).send({msg :"You should receive an email from us."})
                })
                .catch(error =>  res.status(500).send({error}))
}