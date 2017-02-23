var leBonCoin = function(url, callback){
  var fs = require('fs');
  var request = require('request');
  var cheerio = require('cheerio');
  var dataLeBonCoin = require('./schemaBC.json');

  var prix, departement, surface, typeDeBien;

  var prixTemp, depTemp, codeTemp, surfaceTemp, typeTemp, resTemp;

  request(url, function(error, response, body){

    if(!error){

      var $ = cheerio.load(body);

      $('body > script:nth-child(4)').filter(function(){

        var data = $(this);
        var dataBis = data.text();
        dataBis = dataBis.trim();
        var reg = new RegExp("[ ,]+", "g");
        var tableau = dataBis.split(reg);

        for (var i = 0; i < tableau.length; i++) {
          var value = tableau[i];

          if (value == "prix"){
            prixTemp = tableau[i+2];
          }
          else if (value == "departement"){
            depTemp = tableau[i+2];
          }
          else if (value == "oas_departement") {
            codeTemp = tableau[i+2];
          }
          else if (value == "surface") {
            surfaceTemp = tableau[i+2];
          }
          else if (value == "type") {
            typeTemp = tableau[i+2];
          }
        }



        if (prixTemp == undefined){
          dataLeBonCoin.properties.prix = 0;
          resTemp = "needPrice";
        }
        else{
          prixTemp = prixTemp.replace(/\"/g, "");
          prix = parseInt(prixTemp);
          dataLeBonCoin.properties.prix = prix;
        }



        if (depTemp == undefined){
          dataLeBonCoin.properties.departement = "dept-nc";
          resTemp = "needDepartment";
        }
        else if (codeTemp == undefined){
          dataLeBonCoin.properties.departement = "dept-nc";
          resTemp = "needDepartment";
        }
        else if (depTemp == undefined && codeTemp == undefined){
          dataLeBonCoin.properties.departement = "dept-nc";
          resTemp = "needDepartment";
        }
        else{
          depTemp = depTemp.replace(/\"/g, "");
          depTemp = depTemp.replace(/\_/g, "-");
          codeTemp = codeTemp.replace(/\"/g, "");
          departement = depTemp + "-" + codeTemp;
          dataLeBonCoin.properties.departement = departement;
        }



        if (surfaceTemp == undefined){
          dataLeBonCoin.properties.surface = 0;
          resTemp = "needM";
        }
        else{
          surfaceTemp = surfaceTemp.replace(/\"/g, "");
          surface = parseInt(surfaceTemp);
          dataLeBonCoin.properties.surface = surface;
        }


        
        if (typeTemp == undefined) {
          if (resTemp != null) {
            dataLeBonCoin.properties.typeDeBien = "needTypeOfPropertyLeBonCoin" + "-" + resTemp;
          }
          else {
            dataLeBonCoin.properties.typeDeBien = "needTypeOfPropertyLeBonCoin";
          }
        }
        else {
          typeTemp = typeTemp.replace(/\"/g, "");
          if (typeTemp != "maison" && typeTemp != "appartement"){
            if (resTemp != null) {
              dataLeBonCoin.properties.typeDeBien = "other" + "-" + resTemp;
            }
            else {
              dataLeBonCoin.properties.typeDeBien = "other";
            }
          }
          else{
            if(resTemp != null){
              dataLeBonCoin.properties.typeDeBien = typeTemp + "-" + resTemp;
            }
            else{
              typeDeBien = typeTemp;
              dataLeBonCoin.properties.typeDeBien = typeDeBien;
            }
          }
        }
      });

    callback && callback(dataLeBonCoin);
    }
    return fs.writeFile('leBonCoinResult.json', JSON.stringify(dataLeBonCoin, null, 4), function(err){});
  });
}

module.exports = leBonCoin;
