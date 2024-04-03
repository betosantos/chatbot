require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const buscaCep = require('busca-cep');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const axios = require('axios');

const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const { WebhookClient } = require('dialogflow-fulfillment');

const twilioNumber = 'whatsapp:+14155238886';
const chave = 'APIKey';
const valor = '1dc3d2d4-c660-4d09-b6ca-2b796ca4101f';

const headers = {
  'Authorization': `Apikey ${valor}`,
  [chave]: valor
};


// Replace these variables with your project ID and service account JSON key file path
const projectId = 'chatbottwilio-416313';
const keyFilePath = './keys.json';

// const dialogflow = require('@google-cloud/dialogflow');
// // Create a new session client with authentication
// const sessionClient = new dialogflow.SessionsClient({
//   projectId: projectId,
//   keyFilename: keyFilePath
// });


app.get('/get', function(request, response) {

  response.send('Rota Get com Nodejs no arquivo de Teste')

  axios.get('https://rickandmortyapi.com/api/character/2')
  .then((res) => {
      
      console.log(res)
           
  })
  .catch(err => console.log(err))

});




app.post('/dog', async function(req,res) {

    const sender = req.body.From; 
    const intentName = req.body.queryResult.intent.displayName;        
    const twilioNumber = '+14155238886';
    const message = req.body.Body;
    
    
    const dialogflow = require('@google-cloud/dialogflow');
    // Create a new session client with authentication
    const sessionClient = new dialogflow.SessionsClient({
      projectId: projectId,
      keyFilename: keyFilePath
    });



    const sessionPath = sessionClient.sessionPath(projectId, sessionId);
    
    if(intentName == "Default Welcome Intent") {
      // Configure sua conta Twilio
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = new twilio(accountSid, authToken);
            
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: 'pt-BR',
          },
        }    
      };

      res.json({ 
        fulfillmentText: 'home'
      });


        //   const twilioMessage = {            
        //     body: 'beto',
        //     from: 'whatsapp:' + twilioNumber,
        //     to: sender 
        //   };
            
        // client.messages
        //   .create(twilioMessage)
        //   .then(message => console.log('Mensagem enviada:', message.sid))
        //   .catch(error => console.error('Erro ao enviar mensagem:', error));

    } //fim do if
  
 


  // const sender = req.body.From;
  // const message = req.body.Body;
  
  // const twilioMessage = {
  //   body: intentDisplayName,
  //   from: twilioNumber,
  //   to: sender
  // };
  
  // client.messages
  //   .create(twilioMessage)
  //   .then(message => console.log('Mensagem enviada:', message.sid))
  //   .catch(error => console.error('Erro ao enviar mensagem:', error));


});







app.post('/saocarlos', async function(req,res) {

    const sender = req.body.From;
    const message = req.body.Body;

    const responseData = await consultarAPI(); // Consultar a API externa    
    const resposta = JSON.stringify(responseData); // Transformar a resposta em formato JSON
    console.log('************* RESPOSTA ************', resposta);
    
    const dialogflowResponse = {
        fulfillmentText: 'Este é um exemplo de resposta do Dialogflow.',
        fulfillmentMessages: [
          {
            text: {
              text: [
                'Este é um exemplo de mensagem de texto do Dialogflow.'
              ]
            }
          }
        ]
      };
      
      const twilioMessage = {
        body: JSON.stringify(resposta),
        from: twilioNumber,
        to: sender
      };
      
      client.messages
        .create(twilioMessage)
        .then(message => console.log('Mensagem enviada:', message.sid))
        .catch(error => console.error('Erro ao enviar mensagem:', error));

});


async function consultarAPI() {
  try {
    const response = await axios.get('https://saaesaocarlos.cebi.com.br/agencia/Api/Contas/AppAgencia/FaixasPreco',{headers});
    return response.data;    
  } catch (error) {
    console.error('Erro ao consultar API externa:', error);
    throw new Error('Erro ao consultar API externa');
  }
}


    // Enviar resposta para o Twilio
    // const twilioMessage = {
    //   body: element,   
    //   from: 'whatsapp:' + twilioNumber,
    //   to: sender
    // };


app.post('/dog', async function(req,res) {

    const sender = req.body.From;
    const message = req.body.Body;

    const maxResults = 1;

        // Consultar API externa usando Axios
        axios.get('https://dog.ceo/api/breeds/list/all', {            
            params: {
                limit: maxResults
            },
            headers  
        })
        .then(response => {
            const data = response.data; // Supondo que a resposta da API seja um objeto JSON
            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%', data);

            // Construir a mensagem a ser enviada pelo Twilio
            const messageBody = data.message.australian;
            const messageBody2 = data.message.ovcharka;
            const msgTotal = 'Australiano '+ messageBody + ' Raça: ' + messageBody2;

            // Enviar mensagem pelo Twilio
            client.messages.create({
                body: msgTotal,
                from: twilioNumber,
                to: sender
            })
            .then(message => console.log('Mensagem enviada:', message.sid))
            .catch(error => console.error('Erro ao enviar mensagem:', error));
        })
        .catch(error => {
            console.error('Erro ao consultar API externa:', error);
        });
});




app.post('/cep', function(req,res) {
  
  var cep = req.body.queryResult.parameters['cep'];    
  console.log('CEP informado', cep);
   
   buscaCep(cep, {sync: false, timeout: 1000})
   .then(endereco => {      
       res.json({
             fulfillmentText: `Endereço: ${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}`
       });        
   })
   .catch(erro => {
       console.log(`Erro: statusCode ${erro.statusCode} e mensagem ${erro.message}`);
   });  
 
});



function buscaCEP(req,res) {
 
   var cep = req.body.queryResult.parameters['cep'];    
   
   buscaCep(cep, {sync: false, timeout: 1000})
     .then(endereco => {
     console.log(endereco);
   })
     .catch(erro => {
     console.log(`Erro: statusCode ${erro.statusCode} e mensagem ${erro.message}`);
   });
 
}




app.listen(port, () => {
    console.log(`Servidor Rodando na porta ${port}`)
})
