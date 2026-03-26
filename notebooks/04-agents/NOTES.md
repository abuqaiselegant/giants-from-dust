# 04 Agents Notes

This folder shows how simple API-calling workflows evolve into agentic systems that can plan and act across steps.

## Files in This Folder

- `api-to-agents.ipynb`
  - Starts from direct model/API calls and builds toward agent-style orchestration.
  - Demonstrates how tools, prompts, and control flow interact.

## Key Concepts Used

- **Tool use**
  - The model can call external functions/APIs (search, calculator, database, etc.) instead of relying only on parametric memory.

- **Agent loop**
  - Repeating cycle: plan -> act -> observe -> refine.

- **Prompt orchestration**
  - Structured system/user/tool prompts to guide reliable multi-step behavior.

- **State / memory**
  - Data carried across steps (conversation history, intermediate results, tool outputs).

- **Guardrails**
  - Constraints for safety and reliability (allowed tools, input checks, output formatting, retries).
