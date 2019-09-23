/*jshint esversion: 6 */

const firebaselib = require('../firebaseLib.js');
const FieldValue = require('firebase-admin').firestore.FieldValue;

const SENDGRID_API_KEY = "YOUR_SENDGRID_API_KEY_GOES_HERE";
const contact = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    var request = req.body;
    var email = request.email;

    firebaselib.db.collection('queries').add({
            textmessage: request.textmessage,
            college: request.college,
            city: request.city,
            phone: request.phone,
            timestamp: FieldValue.serverTimestamp()
        })
        .then(ref => {
            const msg = {
                to: email,
                from: '"getPlaced Inc." contact@getplaced.co',
                subject: 'Thank You, For Getting in Touch!',
                text: 'Your query has been recorded, we\'ll get in touch with you soon, your query ID is - ' + ref.id,
                html: '<strong>Your query has been recorded, we\'ll get in touch with you soon, your query ID is - ' + ref.id + '</strong>',
            };
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(SENDGRID_API_KEY);
            return sgMail.send(msg);
        })
        .then(() => {
            response = {
                message: "Query Registered with Query ID - " + qid,
                status: "registered",
                code: 200
            };
            res.json(response);
            return null;
        })
        .catch(err => {
            console.log(err)
            return null;
        });


};

module.exports = contact;
