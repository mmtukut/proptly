// Utility function for one-hot encoding
const oneHot = (index, numClasses) => {
  const vector = new Array(numClasses).fill(0);
  vector[index] = 1;
  return vector;
};

export { oneHot };