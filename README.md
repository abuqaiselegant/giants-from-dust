# Giants from Dust

Learn modern AI models step by step, from basics to GPT.  
This repo is beginner-friendly and explains each concept in a simple way.

## Excalidraw Notes (Start Here)

You can view the visual notes in Excalidraw:

1. Download `giant-from-dust.excalidraw.excalidraw`
2. Open [Excalidraw](https://excalidraw.com/)
3. Click **Import** and select the file
4. You will get the full notes/diagram

Also included: `giant-from-dust.excalidraw.md` (markdown export of the same notes).

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

### Modern GPT Guide (Interactive JSX)

| File | Description |
|------|-------------|
| [modern_gpt_complete_guide.jsx](modern_gpt_complete_guide.jsx) | Interactive visualization — BPE tokenizer, embeddings, attention, GPT architecture walkthrough |

## Getting Started

1. Clone the repository
2. Open any notebook in Jupyter or [Google Colab](https://colab.research.google.com) (notebooks include Colab badges)
3. Run cells in order — each builds on the previous

## Running the Modern GPT Guide (`modern_gpt_complete_guide.jsx`)

The interactive GPT guide is a React component. To run it:

1. **Install dependencies** — from the repo root, create a Vite React app:
   ```bash
   npm create vite@latest gpt-guide-app -- --template react
   cd gpt-guide-app && npm install
   ```

2. **Copy the component** into the app:
   ```bash
   cp ../modern_gpt_complete_guide.jsx src/App.jsx
   ```
   (Run from inside `gpt-guide-app`; adjust the path if your setup differs.)

3. **Run the dev server**:
   ```bash
   npm run dev
   ```

   Open the URL shown in the terminal (e.g. `http://localhost:5173`) in your browser.

## Requirements

- **Notebooks:** Python 3, Jupyter, NumPy, PyTorch (for GPT notebooks), tiktoken (for attention notebooks)
- **Modern GPT Guide (JSX):** Node.js and npm
