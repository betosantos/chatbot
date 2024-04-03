require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const axios = require('axios');
const uuid = require('uuid');

// Configurações do Dialogflow
const dialogflow = require('dialogflow');
const projectId = 'chatbottwilio-416313';
const sessionId = uuid.v4();
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId,sessionId);

// Configurações do Twilio
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const recipientPhoneNumber = 'numero-do-destinatario';

// Criação de um cliente do Twilio
const twilioClient = twilio(accountSid, authToken);

console.log('Dialogflow Session Path ', sessionPath);
console.log('Twilio SID ', accountSid);
console.log('Twilio Token ', authToken);
console.log('Twilio NUmber ', twilioPhoneNumber);
console.log('Twilio Client ', twilioClient);



app.post('/beto', function(request,response) {

    //let texto = request.body.queryInput.text.text;
    //console.log(texto)
      
    const query = {
        session: sessionPath,
        queryInput: {
            text: {
                text: 'cep',
                languageCode: 'pt-br'
            }
        }
    } //fim do query
    console.log('****************', query)


    sessionClient.detectIntent(query)
        .then((res) => {            
            //console.log('Texto de Resposta do Agente: ', res[0].queryResult.fulfillmentMessages[0].text.text)
            const twiml = new twilio.twiml.MessagingResponse();
            const resultado = res[0].queryResult;                        
            
            //twiml.message(resultado.fulfillmentText);

            // Enviar mensagem via Twilio
            const envio = twilioClient.messages.create({
                body: resultado.fulfillmentText,
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+5511996108766'
            });

            console.log('Mensagem enviada com sucesso:', envio.sid);
            
        })
        .catch(err => console.log(err))

    
   
});















app.listen(port, () => {
    console.log(`Servidor Rodando na porta ${port}`)
})