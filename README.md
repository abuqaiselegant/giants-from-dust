# Giants from Dust

Build modern AI models from the ground up — no magic, no hand-waving. Understand exactly what happens when a neural network trains, how attention works, and how GPT-style models are constructed.

## Learning Path

Notebooks are organized by topic in a suggested order:

### 1. Neural Networks — `notebooks/01-neural-networks/`
| Notebook | Description |
|----------|-------------|
| [neural-network-from-scratch.ipynb](notebooks/01-neural-networks/neural-network-from-scratch.ipynb) | NumPy-only NN — XOR, forward pass, backprop, PyTorch comparison |

### 2. Attention — `notebooks/02-attention/`
| Notebook | Description |
|----------|-------------|
| [text-to-attention.ipynb](notebooks/02-attention/text-to-attention.ipynb) | Tokenization, embeddings, positional encoding, attention from scratch |
| [text-to-attention-with-embeddings.ipynb](notebooks/02-attention/text-to-attention-with-embeddings.ipynb) | Full pipeline: text → tokens → embeddings → attention |

### 3. GPT — `notebooks/03-gpt/`
| Notebook | Description |
|----------|-------------|
| [gpt-from-scratch.ipynb](notebooks/03-gpt/gpt-from-scratch.ipynb) | GPT implementation from scratch (Tiny Shakespeare) |
| [modern-gpt-llm.ipynb](notebooks/03-gpt/modern-gpt-llm.ipynb) | Modern LLM — RMSNorm, SwiGLU, RoPE, GQA |
| [gpt-minimal.ipynb](notebooks/03-gpt/gpt-minimal.ipynb) | Minimal GPT stub |

### 4. Agents — `notebooks/04-agents/`
| Notebook | Description |
|----------|-------------|
| [api-to-agents.ipynb](notebooks/04-agents/api-to-agents.ipynb) | From API calls to agents with OpenRouter |

## Getting Started

1. Clone the repository
2. Open any notebook in Jupyter or [Google Colab](https://colab.research.google.com) (notebooks include Colab badges)
3. Run cells in order — each builds on the previous

## Requirements

- Python 3
- Jupyter
- NumPy
- PyTorch (for GPT notebooks)
- tiktoken (for attention notebooks)
