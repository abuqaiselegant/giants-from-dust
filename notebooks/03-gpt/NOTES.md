# 03 GPT Notes

This folder focuses on autoregressive language modeling, GPT architecture details, and practical extensions such as RAG.

## Files in This Folder

- `gpt-from-scratch.ipynb`
  - End-to-end toy GPT training flow.
  - Includes tokenization, embeddings, transformer blocks, and next-token prediction.

- `gpt-minimal.ipynb`
  - Stripped-down GPT implementation for quick architecture understanding.

- `modern-gpt-llm.ipynb`
  - Covers modern design choices used in newer LLMs (for example RMSNorm, RoPE, SwiGLU, GQA).

- `modernGpt2.ipynb`
  - GPT-2-style implementation/experiments for comparison with modern variants.

- `rag-simple.ipynb`
  - Basic Retrieval-Augmented Generation pipeline: retrieve relevant text, then generate with that context.

- `shakespeare.txt`
  - Small corpus used for toy language-model training and evaluation.

## Key Concepts Used

- **Autoregressive modeling**
  - Predicts the next token given previous tokens.

- **Causal mask**
  - Prevents the model from attending to future tokens during training/inference.

- **Transformer block**
  - Typical stack of attention + feed-forward network + residual connections + normalization.

- **Residual connection**
  - Adds block input back to block output to stabilize deep training.

- **RMSNorm**
  - A normalization technique often used in modern LLMs for efficiency and stable training.

- **RoPE (Rotary Positional Embeddings)**
  - Encodes relative positional information directly into attention operations.

- **SwiGLU**
  - A gated feed-forward activation that often improves model quality.

- **GQA (Grouped Query Attention)**
  - Shares key/value heads across query groups to reduce memory and speed up inference.

- **RAG (Retrieval-Augmented Generation)**
  - Combines retrieval from external knowledge with text generation for more grounded outputs.
