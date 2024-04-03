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
const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const projectId = 'chatbottwilio-416313';
const sessionId = uuid.v4();
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId,sessionId);
const twilioNumber = '+14155238886';
console.log(sessionPath);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const { SessionsClient } = require('dialogflow');
const client = new twilio(accountSid, authToken);



app.post('/saocarlos', (req, res) => {

  const sender = req.body.From;  
  const message = req.body.Body;

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    },
  };

  sessionClient.detectIntent(request)
    .then((response) => {
      // Extrair o texto da resposta do agente do Dialogflow
      const result = response[0].queryResult;
      const respostaDialogflow = result.fulfillmentText;

      console.log('Resposta: ',respostaDialogflow);
      console.log('Resposta do Dialogflow:', result);
      
      const twilioMessage = {
         body: respostaDialogflow,
         from: 'whatsapp:' + twilioNumber,
         to: 'whatsapp:+5511996108766' 
       };

      client.messages.create(twilioMessage);

      // res.json(data)
      
    })
    .catch(err => console.log(err))

});





app.listen(port, () => {
  console.log(`Servidor Rodando na porta ${port}`)
})