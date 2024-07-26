const nodemailer = require('nodemailer')
// Nodemailer
const sendEmail =async (options)=>{
    // 1)Create  transporter ( service that will send email like "gmail","mailGun","sendGride")
    const transporter = nodemailer.createTransport({
        host: Process.env.EMAIL_HOST,
        port: Process.env.EMAIL_PORT, // if secure false port = 587, if true port=565
        secure: true,
        auth: {
            user: Process.env.EMAIL_USER,
            pass: Process.env.EMAIL_PASSWORD
        }
    })

    // 2) Define email options ( like  from ,to , subject ,  email content)
    const mailOpts = {
        from: 'E-shop App <ahmedsamir14401@gmail.com> ',
        to: options.email,
        subject:options.subject,
        text:options.message
    }
    // 3) Send email
    await transporter.sendMail(mailOpts)
}

module.exports = sendEmail