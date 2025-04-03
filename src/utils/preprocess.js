import { removeStopwords } from 'stopword';

// Function to preprocess the text
const preprocess = (text) => {
  // Convert text to lowercase
  const lowerCaseText = text.toLowerCase();

  // Remove punctuation
  const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  const textWithoutPunctuation = lowerCaseText.replace(punctuationRegex, '');

  // Split the text into tokens
  const tokens = textWithoutPunctuation.split(/\s+/);

  // Remove stop words
  const filteredTokens = removeStopwords(tokens);

  return filteredTokens;
};

export { preprocess }; 