const fs = require('fs');
const pdfParse = require('pdf-parse');

const dataBuffer = fs.readFileSync(process.argv[2]);

pdfParse(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(err => {
    console.error(err);
});
