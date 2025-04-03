import * as tf from '@tensorflow/tfjs';

const createModel = (vocabularyLength, embeddingDimension, numIntents, numSentimentClasses) => {
  console.log("vocabularyLength:", vocabularyLength);
  console.log("embeddingDimension:", embeddingDimension);
  console.log("numIntents:", numIntents);
  console.log("numSentimentClasses:", numSentimentClasses);

  const model = tf.sequential();

  // Embedding layer
  model.add(tf.layers.embedding({
    inputDim: vocabularyLength,
    outputDim: embeddingDimension,
    inputLength: 1 // Assuming input is a sequence of length 1 (after padding/truncating)
  }));

  // LSTM layer (optional)
  model.add(tf.layers.lstm({ units: 64, returnSequences: false }));

  // Intent classification branch
  const intentBranch = tf.sequential();
  intentBranch.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [64] }));
  intentBranch.add(tf.layers.dense({ units: numIntents, activation: 'softmax' }));

  // Sentiment analysis branch
  const sentimentBranch = tf.sequential();
  sentimentBranch.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [64] }));
  sentimentBranch.add(tf.layers.dense({ units: numSentimentClasses, activation: 'softmax' })); // Or 'sigmoid' for binary

  // Combine the branches (using tf.model or tf.layers.concatenate - more advanced)
  // For simplicity, we'll create separate models for now.

  const intentModel = tf.sequential();
  intentModel.add(model); // Add the shared layers
  intentModel.add(intentBranch);

  const sentimentModel = tf.sequential();
  sentimentModel.add(model); // Add the shared layers
  sentimentModel.add(sentimentBranch);

  intentModel.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  sentimentModel.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy', // Or 'binaryCrossentropy'
    metrics: ['accuracy']
  });

  intentModel.summary();
  sentimentModel.summary();

  return { intentModel, sentimentModel };
};

export default createModel;