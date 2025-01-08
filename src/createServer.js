// Write code here
// Also, you can create additional files in the src folder
// and import (require) them here

const http = require('http');
const convertToCase = require('../src/convertToCase').convertToCase;

const createServer = () => {
  const server = http.createServer((req, res) => {
    const errors = [];
    let responseData;

    try {
      const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
      const text = normalizedURL.pathname.slice(1);
      const toCase = normalizedURL.searchParams.get('toCase');

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
          const converted = convertToCase(text, toCase);

          responseData = {
            originalCase: converted.originalCase,
            targetCase: toCase,
            originalText: text,
            convertedText: converted.convertedText,
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
