


app.post('/saocarlos', function(request,response) {

    var intentName = request.body.queryResult.intent.displayName;
    const twilioMessage = request.body.Body;
    const twilioPhoneNumber = request.body.From;
    //console.log(twilioPhoneNumber);
  
    // Enviar mensagem do Twilio para o Dialogflow
    const dialogflowResponse = sendMessageToDialogflow(twilioMessage);
      
    // Enviar resposta do Dialogflow de volta para o Twilio
    clientTwilio.messages.create({
        body: dialogflowResponse,
        from: 'whatsapp:+14155238886',
        //to: 'whatsapp:+5511996108766'
        to: twilioPhoneNumber
    }).then(message => console.log(message.sid));
  
    //response.status(200).send();
    
    if (intentName == "consultar.cep") {    
      console.log('Função para Consultar CEP');  
      var cep = request.body.queryResult.parameters['cep'];    
      console.log('CEP informado', cep);
      
      buscaCep(cep, {sync: false, timeout: 1000})
      .then(endereco => {      
          response.json({
                fulfillmentText: `Endereço: ${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}`
          });        
      })
      .catch(erro => {
          console.log(`Erro: statusCode ${erro.statusCode} e mensagem ${erro.message}`);
      });  
      
    } //fim do if consultar cep
    
    else if ( intentName == "consultar.contas") {
        //var ordem = request.body.queryResult.parameters['ordem'];         
        console.log("Função Consultar Contas");      
        
        const headers = {
          [chave]: valor,
        };
        
        try {
          const apiUrl = 'https://saaesaocarlos.cebi.com.br/agencia/Api/Contas/AppAgencia/FaixasPreco';
          const response = axios.get(apiUrl, {headers});
          const itens = response.data;
          
          let fulfillmentText = 'Aqui está a lista de itens:\n';
              
  
          return fulfillmentText;
          console.log(fulfillmentText);
      } catch (error) {
          console.error('Erro ao obter lista de itens:', error);
          return 'Desculpe, não foi possível obter a lista de itens no momento.';
      }       
  
    } // fim funcao previsao do tempo
  
  
    // Função para enviar mensagem do Twilio para o Dialogflow
    async function sendMessageToDialogflow(message) {
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: 'pr-br',
          },
        },
      };  
      const responses = await sessionClient.detectIntent(request);
      const result = responses[0].queryResult;
      return result.fulfillmentText;
    }
      
    
  }) //fim da rota saocarlos
  



  // Rota para receber mensagens do Twilio
app.post('/twilio', async (req, res) => {
  
    const twilioMessage = req.body.Body;
    const twilioPhoneNumber = req.body.From;
    //console.log(twilioPhoneNumber);
  
    // Enviar mensagem do Twilio para o Dialogflow
    const dialogflowResponse = await sendMessageToDialogflow(twilioMessage);    
    
    // Enviar resposta do Dialogflow de volta para o Twilio
    clientTwilio.messages.create({
      body: dialogflowResponse,
      from: 'whatsapp:+14155238886',
      //to: 'whatsapp:+5511996108766'
      to: twilioPhoneNumber
    }).then(message => console.log(message.sid));
  
    res.status(200).send();
  });
  
  // Função para enviar mensagem do Twilio para o Dialogflow
  async function sendMessageToDialogflow(message) {
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'pr-br',
        },
      },
    };  
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    return result.fulfillmentText;
  }



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