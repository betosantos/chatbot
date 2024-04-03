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
//console.log(sessionPath);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const { SessionsClient } = require('dialogflow');
const client = new twilio(accountSid, authToken);
const { WebhookClient } = require('dialogflow-fulfillment');



app.post('/saocarlos', (req, res) => {
  
  const sender = req.body.From;    
  const message = req.body.Body;
     
  const intentDisplayName = req.body.queryResult.intent.displayName;  
  console.log('Nome da Intenção:', intentDisplayName);

  // if (intentName == "consultar.cep") {
  //   console.log('****** CONSULTAR CEP *********');
  //   res.json({
  //     "fulfilmentText": "Consultar CEP"
  //   });
  // }

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'pt-BR',
      },
    }    
  };

  sessionClient.detectIntent(request)
    
    .then((response) => {           

      // Extrair o texto da resposta do agente do Dialogflow
      const result = response[0].queryResult;      
      const respostaDialogflow = result.fulfillmentText;
      
      const twilioMessage = {
         //body: respostaDialogflow,
         body: respostaDialogflow,
         from: 'whatsapp:' + twilioNumber,
         to: sender 
       };

      client.messages.create(twilioMessage);     
    })
    .catch(err => console.log(err))

});



/////////////////////////////////////////////////////////////
app.post('/webhook', async (req, res) => {
  const body = req.body;
  const sender = body.From;
  const message = body.Body;

  try {
    // Verificar se a solicitação é do Twilio
    if (body.MessageSid && body.AccountSid) {
      // Se for do Twilio, processar a mensagem do WhatsApp
      const intentDisplayName = "consultar.cep"; // Substitua pelo nome da intenção que deseja acionar

      console.log('Nome da Intenção:', intentDisplayName);

      if(intentDisplayName=="consultar.cep") {
        console.log('Função consultar CEP');
        console.log(req.body);
        const intentDisplayName = req.body.queryResult.intent.displayName;  

        var cep = '01425010'
        console.log('CEP informado', cep);
        console.log('CEP informado', intentDisplayName);

        buscaCep(cep, {sync: false, timeout: 1000})
        .then(endereco => {      
            // response.json({
            //       fulfillmentText: `Endereço: ${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}`                  
            // });        
            response.json(endereco);
        })
        .catch(erro => {
            console.log(`Erro: statusCode ${erro.statusCode} e mensagem ${erro.message}`);
        });  

      }


   
      // Restante do seu código para lidar com a resposta do Dialogflow
    } else {
      // Se não for do Twilio, processar de outra forma
      console.error('Solicitação não reconhecida:', body);
      // Tratar o erro, se necessário
    }
  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
    // Tratar o erro, se necessário
  }

  res.end();
});
















app.listen(port, () => {
  console.log(`Servidor Rodando na porta ${port}`)
})