const express = require('express');
const bodyParser = require('body-parser');
const { WebhookClient } = require("dialogflow-fulfillment");
const axios = require("axios");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/chat', (request, response) => {
 const agent = new WebhookClient({ request:request, response:response });
 
  
 function welcome(agent) {
    const url = "https://rickandmortyapi.com/api/character/2"; 
       
    axios.get('url')
         .then((result) => {              
        console.log(request);
              //console.log('Resultado -------------------------------- ', name);
          })
          .catch(erro => console.log(erro))
   
    agent.add(`Bem vindo ao Webhook alterado`);
  } 
    
  
  
 let intentMap = new Map();
 intentMap.set("Default Welcome Intent", welcome);
 agent.handleRequest(intentMap);
  
});



app.listen(3000, () => {
  console.log("Servidor Express Rodando na porta 3000...");
});
