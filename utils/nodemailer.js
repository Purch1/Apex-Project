require('dotenv').config();
const nodemailer = require ('nodemailer')
const { google } = require('googleapis')
const {OAuth2} = google.auth

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND,
    SENDER_EMAIL_ADDRESS
} = process.env

const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
   OAUTH_PLAYGROUND
)

oauth2Client.setCredentials({
    refresh_token: MAILING_SERVICE_REFRESH_TOKEN
})

const accessToken = oauth2Client.getAccessToken()
const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: SENDER_EMAIL_ADDRESS,
        clientId: MAILING_SERVICE_CLIENT_ID,
        clientSecret: MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
        accessToken: accessToken
    }
})

const sendOtpToken = async ( email, firstname, tokenGen) => {
    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: email,
        subject: "Adsmata Email Verification",
        Variables: {firstname: firstname,
            otp: tokenGen},
        
            html:`
            <div style="max-width: 700px; margin:auto; border: 10px solid #dd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Apex Email Verification.</h2>
            <p> Dear ${firstname},
            </p>
            <p>Congratulations! You're almost set. Your verification code is ${tokenGen}
            </p>
            <p>If you have any questions, send an email to ${SENDER_EMAIL_ADDRESS} and our team will provide technical support.:</p>

            <div>Regards <br>
            Apex Team</div>
            </div>
        `
    };
    try{
         await smtpTransport.sendMail(mailOptions, (err, result) => {
            if(err){
                console.log("Error sending token to email", err);
                return err === null;
            }
            console.log("Email sent successfully: ", result.response);
            return result.accepted.length > 0 && result.rejected.length === 0;
        });

    }catch (err){
        console.log("Error sending token to email", err);
    }
   }

module.exports = sendOtpToken;

