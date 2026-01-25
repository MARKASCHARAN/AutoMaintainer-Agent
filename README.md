# AutoMaintainer Agent — Autonomous GitHub Engineer

> **Software that fixes itself.**

AutoMaintainer Agent is an autonomous AI system that monitors GitHub repositories, diagnoses failures, writes tests, fixes code, and opens pull requests — **without human intervention**.

Built for the **VETROX AGENTIC 3.0 Hackathon**, this project explores the future of self-healing software using **Gemini-powered agentic architecture**.

---

## 🚀 What It Does

AutoMaintainer Agent performs a full autonomous engineering loop:

1. Observes a repository (issues, failing tests, logs)
2. Diagnoses the root cause using Gemini reasoning
3. Plans a fix strategy
4. Writes or updates unit tests
5. Applies a minimal code patch
6. Runs tests in a sandboxed environment
7. If successful → opens a Pull Request automatically
8. Writes a clear PR explanation (root cause, fix, tradeoffs)

This is not a chatbot.  
This is a **system that acts.**

---

## 🧠 Core Philosophy

> We are done with assistants that wait for prompts.  
> The future belongs to **autonomous agents that operate on systems.**

AutoMaintainer Agent is designed around the principle of **agentic autonomy**:
- Observe → Reason → Plan → Act → Verify → Reflect
- Minimal human input
- Emphasis on real-world execution, not UI demos

---

## 🏗️ Architecture Overview


Each component is modular, inspectable, and designed for extensibility.

---

## 🧩 Agent Modules

| Module | Responsibility |
|------|----------------|
| `observer.py` | Reads repo state, issues, errors, failing tests |
| `diagnoser.py` | Uses Gemini to identify root cause |
| `planner.py` | Breaks fix into structured steps |
| `executor.py` | Generates code patches and tests |
| `verifier.py` | Runs tests in sandbox |
| `memory.py` | Stores previous attempts and learning |
| `pr_manager.py` | Creates Pull Requests via GitHub API |

---

## 🛠️ Tech Stack

- **Python 3.11**
- **Gemini API** (reasoning engine)
- **GitHub REST API**
- **Docker / Subprocess** (test sandbox)
- **FastAPI** (optional trigger interface)
- **SQLite / JSON** (lightweight agent memory)

All components are designed to run locally with **no paid infrastructure required**.

---

## 🎯 Why This Project Matters

Modern AI can write code.  
But it cannot yet **maintain software systems autonomously**.

AutoMaintainer Agent explores:
- Self-healing repositories
- Autonomous DevOps
- Agentic software engineering
- AI as an infrastructure layer (not a UI layer)

This represents a step toward:
> Repositories that evolve and repair themselves.

---

## 📽️ Demo (Hackathon Submission)

The demo video shows:

- A repository with failing tests ❌  
- Agent activation  
- Real-time reasoning logs  
- Automatic test + fix generation  
- Tests passing ✅  
- Pull Request opened on GitHub  
- PR includes human-level explanation  

> From failure → to fix → to PR  
> Fully autonomous.

---

## 🧪 Current Status

This project is under active development for the VETROX AGENTIC 3.0 Hackathon.

Planned milestones:
- [ ] Minimal agent loop
- [ ] Gemini diagnosis integration
- [ ] Test generation
- [ ] Patch generation
- [ ] Local test runner
- [ ] GitHub PR automation
- [ ] Demo recording
- [ ] Architecture documentation

---

## 🧭 Future Directions

- Multi-repo monitoring
- Long-term agent memory
- CI/CD integration
- Smart contract auditing mode (Web3 extension)
- Team-based agent collaboration
- Self-refactoring capabilities

---

## 👤 Author

Built by **S Charan Marka**  
Hackathon winner • Web3 + AI Builder

---

## 📜 License

MIT — Open for experimentation, learning, and extension.
