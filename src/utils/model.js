import * as tf from '@tensorflow/tfjs';

const createModel = (vocabularyLength, embeddingDimension, numIntents, learningRate = 0.001) => {
  console.log("vocabularyLength:", vocabularyLength);
  console.log("embeddingDimension:", embeddingDimension);
  console.log("numIntents:", numIntents);
  console.log("Learning Rate:", learningRate);

  const model = tf.sequential();

  // Embedding layer
  model.add(tf.layers.embedding({
    inputDim: vocabularyLength,
    outputDim: embeddingDimension,
    inputLength: 1 // Sequence length of 1 since we are not using LSTM
  }));

  // Flatten the embedding output
  model.add(tf.layers.flatten());

  // Dense layer
  model.add(tf.layers.dense({ units: numIntents, activation: 'softmax' }));

  // Compile the model
  const optimizer = tf.train.adam(learningRate);
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  model.summary();

  return model;
};

export default createModel;