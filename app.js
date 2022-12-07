const https = require('https');
https.get('https://api.gameofthronesquotes.xyz/v1/random',
(resp) => {
let dados = '';
resp.on('data', (chunk) => { dados += chunk; });
resp.on('end', () => {
    console.log('QUOTE FROM THE BOOK "GAME OF THRONES":')
    var dadosObj = JSON.parse(dados);
    console.log("Sentence: " + dadosObj.sentence);
});
}).on("error", (err) => {
console.log("Error: " + err.message);
});

