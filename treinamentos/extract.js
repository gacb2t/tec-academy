const fs = require('fs');
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync("process_extracted.txt", pdfParser.getRawTextContent());
    console.log("Extraction complete!");
});

pdfParser.loadPDF("4.3 - PROCESSO DE VENDA.pdf");
