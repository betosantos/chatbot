require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const buscaCep = require('busca-cep');
const bodyParser = require('body-parser');
const fs = require('fs');
// const twilio = require('twilio');
// const MessagingResponse = require('twilio').twiml;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const projectId = 'chatbottwilio-416313';
const sessionId = uuid.v4();
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId,sessionId);
const twilioNumber = '+14155238886';
//console.log(sessionPath);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const { SessionsClient } = require('dialogflow');
const client = new twilio(accountSid, authToken);
const { WebhookClient } = require('dialogflow-fulfillment');
//const { MessagingResponse } = require('twilio').twiml;




app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.type('text/xml').send(twiml.toString());
});








app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});