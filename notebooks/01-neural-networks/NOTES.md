# 01 Neural Networks Notes

This folder introduces the core building blocks of neural networks before moving into attention and GPT.

## Files in This Folder

- `neural-network-from-scratch.ipynb`
  - Builds a tiny feed-forward neural network with NumPy.
  - Uses the XOR task to show why non-linear models are needed.
  - Walks through forward pass, loss computation, and backpropagation.

## Key Concepts Used

- **Neuron / layer**
  - A neuron applies a weighted sum + bias, then an activation function.
  - Layers stack these transformations to learn increasingly useful features.

- **Forward pass**
  - The model computes predictions from input to output.

- **Loss function**
  - A scalar number that measures prediction error (lower is better).

- **Backpropagation**
  - Computes gradients of the loss with respect to each parameter using the chain rule.

- **Gradient descent**
  - Updates weights in the direction that reduces loss.

- **Activation function**
  - Adds non-linearity (for example, sigmoid/ReLU), allowing the network to model non-linear relationships.
