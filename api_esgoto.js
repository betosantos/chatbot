const axios = require('axios');
const {escape} = require('querystring');
const diacritics = require('diacritics');

const chave = 'APIKey';
const valor = '1dc3d2d4-c660-4d09-b6ca-2b796ca4101f';

exports.handler = async (context, event, callback) => {
  
  //const query = diacritics.remove(event.query.toUpperCase().trim());
  //console.log(query);
  //const query = escape(event.Body).toUpperCase();
  
  //const url = `https://saaesaocarlos.cebi.com.br/agencia/Api/Atendimentos/AppAgencia/TiposChamado?tipo=${query}`;
  const url = 'https://saaesaocarlos.cebi.com.br/agencia/Api/Atendimentos/AppAgencia/TiposChamado?tipo=ESGOTO';
  
  const headers = {
    [chave]: valor,
  };


  try {
    const response = await axios.get(url, {headers});
    
    return callback(null, {
      text: `Here's an image of a 🐶`,
      resultado: response.data.results,
      tipoChamado: response.data.results[0].tipoChamadoId,
      descricao: response.data.results[0].descricao,
      total: response.data.results.length
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return callback(null, {
        text: `Sorry, we couldn't find any 🥲`,
      });
    }
    
    return callback(error);
  }
};


{% for p in widgets.http_opcao1_agua.parsed.resultado %}
*{{forloop.index}}* - {{p.descricao}}
{% endfor %}

Teste
{% for p in widgets.http_opcao2_esgoto.parsed.resultado %}
*{{forloop.index}}* - {{p.descricao}}
{% endfor %}