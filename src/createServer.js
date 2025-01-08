// Write code here
// Also, you can create additional files in the src folder
// and import (require) them here

const http = require('http');
const { detectCase } = require('../src/convertToCase/detectCase');
const { toWords } = require('../src/convertToCase/toWords');
const { wordsToCase } = require('../src/convertToCase/wordsToCase');

const createServer = () => {
  const server = http.createServer((req, res) => {
    const errors = [];
    let responseData;

    try {
      const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
      const text = normalizedURL.pathname.slice(1);
      const toCase = normalizedURL.searchParams.get('toCase');
      const originalCase = detectCase(text);
      const words = toWords(text, originalCase);

      if (!text) {
        errors.push({
          message:
            // eslint-disable-next-line
            'Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
        });
      }

      if (!toCase) {
        errors.push({
          message:
            // eslint-disable-next-line
            '"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
        });
      }

      if (toCase) {
        try {
          const convertedText = wordsToCase(words, toCase);

          responseData = {
            originalCase,
            targetCase: toCase,
            originalText: text,
            convertedText,
          };
        } catch (conversionError) {
          errors.push({ message: conversionError.message });
        }
      }

      if (errors.length > 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ errors }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData));
      }
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });

      res.end(
        JSON.stringify({
          errors: [{ message: 'An unexpected error occurred on the server.' }],
        }),
      );
    }
  });

  return server;
};

module.exports = {
  createServer,
};
