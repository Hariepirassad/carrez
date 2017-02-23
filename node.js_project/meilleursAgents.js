var meilleursAgents = function(dataLeBonCoin, callback){
  var fs = require('fs');
  var request = require('request');
  var cheerio = require('cheerio');
  var dataMeilleursAgents = require('./schemaMA.json');

  var typeDeBienBCR, prixEstimeAuM, prixEstimeTotal, resultat;

  dataMeilleursAgents.properties.departement =  dataLeBonCoin.properties.departement;

  url = 'https://www.meilleursagents.com/prix-immobilier/' + dataLeBonCoin.properties.departement.toLowerCase() + '/';
  request(url, function(error, response, body){

    if(!error){

      var $ = cheerio.load(body);

        typeDeBienBCR = dataLeBonCoin.properties.typeDeBien;

          if(typeDeBienBCR == 'maison'){
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;

            $('#synthese > div > div.prices-summary__values > div:nth-child(3) > div.small-4.medium-2.columns.prices-summary__cell--median').filter(function(){

              var data = $(this);
              var prixEstimeTemp = data.text();
              prixEstimeTemp = prixEstimeTemp.trim();
              prixEstimeTemp = prixEstimeTemp.replace(/\D/g,'');
              prixEstimeAuM = parseInt(prixEstimeTemp);
              dataMeilleursAgents.properties.prixEstimeAuM = prixEstimeAuM;
            });
          }


          else if(typeDeBienBCR == 'appartement'){
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            $('#synthese > div > div.prices-summary__values > div:nth-child(2) > div.small-4.medium-2.columns.prices-summary__cell--median').filter(function(){

              var data = $(this);
              var prixEstimeTemp = data.text();
              prixEstimeTemp = prixEstimeTemp.trim();
              prixEstimeTemp = prixEstimeTemp.replace(/\D/g,'');
              prixEstimeAuM = parseInt(prixEstimeTemp);
              dataMeilleursAgents.properties.prixEstimeAuM = prixEstimeAuM;
            });
          }

          else if (typeDeBienBCR == 'maison-needPrice' || typeDeBienBCR == 'appartement-needPrice'){
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            resultat = 'Can not evaluate this deal, need priceLeBonCoin';
          }

          else if (typeDeBienBCR == 'maison-needDepartment' || typeDeBienBCR == 'appartement-needDepartment'){
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            resultat = 'Can not evaluate this deal, need departmentLeBonCoin';
          }

          else if (typeDeBienBCR == 'maison-needM' || typeDeBienBCR == 'appartement-needM') {
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            resultat = 'Can not evaluate this deal, need surfaceLeBonCoin';
          }

          else if (typeDeBienBCR == 'needTypeOfPropertyLeBonCoin-needPrice') {
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            resultat = 'Can not evaluate this deal, it is neither a house nor an appartement and need priceLeBonCoin and need typeOfPropertyLeBonCoin';
          }

          else if (typeDeBienBCR == 'needTypeOfPropertyLeBonCoin-needDepartment') {
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            resultat = 'Can not evaluate this deal, it is neither a house nor an appartement and need departmentLeBonCoin and need typeOfPropertyLeBonCoin';
          }

          else if (typeDeBienBCR == 'needTypeOfPropertyLeBonCoin-needM') {
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            resultat = 'Can not evaluate this deal, it is neither a house nor an appartement and need surfaceLeBonCoin and need typeOfPropertyLeBonCoin';
          }

          else if (typeDeBienBCR == 'other-needPrice') {
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            resultat = 'Can not evaluate this deal, it is neither a house nor an appartement and need priceLeBonCoin';
          }

          else if (typeDeBienBCR == 'other-needDepartment') {
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            resultat = 'Can not evaluate this deal, it is neither a house nor an appartement and need departmentLeBonCoin';
          }

          else if (typeDeBienBCR == 'other-needM') {
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            resultat = 'Can not evaluate this deal, it is neither a house nor an appartement and need surfaceLeBonCoin';
          }

          else if (typeDeBienBCR == 'other'){
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            resultat = 'Can not evaluate this deal, it is neither a house nor an appartement';
          }

          else {
            dataMeilleursAgents.properties.typeDeBien = typeDeBienBCR;
            resultat = 'Can not evaluate this deal, it is neither a house nor an appartement and need typeOfPropertyLeBonCoin'
          }

        }

      prixEstimeTotal = prixEstimeAuM * dataLeBonCoin.properties.surface;
      dataMeilleursAgents.properties.prixEstimeTotal = prixEstimeTotal;

      if(prixEstimeTotal <= dataLeBonCoin.properties.prix){
        resultat = 'It is a bad deal';
      }
      else if(prixEstimeTotal > dataLeBonCoin.properties.prix){
        resultat = 'It is a good deal';
      }

      dataMeilleursAgents.properties.resultat = resultat;
      callback && callback(resultat);
      return fs.writeFile('meilleursAgentsResult.json', JSON.stringify(dataMeilleursAgents, null, 4), function(err){});
  });
}

module.exports = meilleursAgents;
