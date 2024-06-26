const express = require('express');
const twilio = require('twilio');
const router = express.Router();
const connection = require('../db_config');



// function sendSms(data){
//     const accountSid = process.env.ACCOUNTID;
//     const authToken = process.env.AUTHTOKEN;

//     const client = new twilio(accountSid, authToken);
//     client.messages.create({
//         body: data.message,
//         from: 'your_twilio_phone_number',
//         to: data.to
//     })
    // .then(message => {
    //     console.log(`Message sent: ${message.sid}`);
    //     res.status(200).json({ success: true, messageSid: message.sid });
    // })
    // .catch(error => {
    //     console.error(`Error sending message: ${error}`);
    //     res.status(500).json({ success: false, error: error.message });
    // });
// }


function sendMail(data,callback){
    const nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');
    smtpTransport = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        secure: true,
        port: '465',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }));
    var htmlToSend = '<p><b>Your Login Details for Cafe Managemet System</b><br><b>Emai: </b>'+data.user_email+'<br><a href="http://localhost:4200">Click Here to Login</a></p>'
    var mailOptions = {
        from: process.env.EMAIL,
        to : data.user_email,
        subject : data.subject,
        html : htmlToSend
     };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            callback(error);
        }else{
            callback(null,response.messageId)
        }
    });
}


router.get('/tdsMail',(req,res) => {
    var query = "select email from tds where status='0'";
    connection.query(query,(err,results)=>{
        let errors = [];
        let count = 0;
        if(!err){
            for(let result of results){
                var subject = "TDS Not Paid";
                const mail_data = {
                    subject: subject,
                    user_email: result.email
                }
                sendMail(mail_data,(error,messageId) => {
                    count++;
                    if(error){
                        errors.push({error});
                    }
                    if(count == results.length){
                        if (errors.length) {
                            // If there are any errors, send them in the response
                            res.status(500).json({ errors });
                        } else {
                            // If all emails were sent successfully
                            res.status(200).json({ message:"Mails Send Successfully" });
                        }
                    }
                });                  
            }                        
        }else{
            res.status(500).json(err);
        }
    })
});

module.exports = router;
