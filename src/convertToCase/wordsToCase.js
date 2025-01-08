/**
 * @typedef {'SNAKE' | 'KEBAB' | 'CAMEL' | 'PASCAL' | 'UPPER'} CaseName
 *
 * @param {string[]} words
 * @param {CaseName} caseName
 *
 * @returns {string}
 */
function wordsToCase(words, caseName) {
  switch (caseName) {
    case 'SNAKE': {
      return words.join('_');
    }

    case 'KEBAB': {
      return words.join('-');
    }

    case 'UPPER': {
      return words.map((word) => word.toUpperCase()).join('_');
    }

    case 'PASCAL': {
      return words
        .map((word) => {
          return `${word[0].toUpperCase()}${word.slice(1)}`;
        })
        .join('');
    }

    case 'CAMEL': {
      return words
        .map((word, index) => {
          if (index === 0) {
            return word;
          }

          return `${word[0].toUpperCase()}${word.slice(1)}`;
        })
        .join('');
    }

    default: {
      throw new Error(
        // eslint-disable-next-line
        'This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
      );
    }
  }
}

module.exports = {
  wordsToCase,
};
