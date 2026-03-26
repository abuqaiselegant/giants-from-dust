# 02 Attention Notes

This folder explains how token representations are built and how attention mixes context across tokens.

## Files in This Folder

- `text-to-attention.ipynb`
  - Starts from text and gradually builds attention intuition.
  - Covers tokenization, sequence representation, and attention scoring.

- `text-to-attention-with-embeddings.ipynb`
  - Connects text preprocessing to dense vector embeddings.
  - Shows attention over embedding vectors as the practical pipeline.

## Key Concepts Used

- **Tokenization**
  - Splits text into model-readable units (tokens).

- **Embedding**
  - Maps each token id to a dense vector that captures semantic patterns.

- **Positional encoding**
  - Injects token order information so sequence position is preserved.

- **Query, Key, Value (Q/K/V)**
  - Query asks "what do I need?", key says "what do I contain?", value carries the actual information to combine.

- **Attention score**
  - Similarity between query and keys; determines which tokens matter more.

- **Softmax normalization**
  - Converts attention scores into probabilities that sum to 1.

- **Context vector**
  - Weighted sum of values; final blended representation for each token position.
