# FlowPilot AI — Autonomous Workflow Intelligence
### Best Apps & Agents Track | Nebius × NVIDIA Global AI Hackathon 2026

**Turn complex work into intelligent, observable, and verifiable workflows.**

FlowPilot AI is a production-grade autonomous workflow agent that decomposes complex, high-level objectives into a Directed Acyclic Graph (DAG) of executable tasks. It coordinates specialized research, computation, and data tools, enforces human-in-the-loop safety approvals, verifies outputs against empirical evidence, and synthesizes 10-section decision reports with citations.

---

## 🎯 Hackathon Compliance Highlights

- **Target Track:** Best Apps and Agents
- **AI Core:** NVIDIA Nemotron open-source model family (`nvidia/llama-3.1-nemotron-70b-instruct` and `nvidia/nemotron-4-340b-instruct`)
- **Inference Host:** Nebius Token Factory (`https://api.studio.nebius.ai/v1`)
- **Observability:** Real-time visual DAG execution graph, timestamped telemetry streams, tool input/output inspectors, and verification scoring (0–100%)
- **Data Persistence:** Stored workflows, tasks, execution traces, and decision deliverables survive server restarts
- **Real Integrations:** Tavily live web research API, safe arithmetic & volume cost-modeling engine, CSV tabular analytics engine, and deliverable generator

---

## 🏗️ System Architecture & Execution Pipeline

```
[User Natural-Language Objective]
                 │
                 ▼
[Input Validation & Constraint Guard]
                 │
                 ▼
[NVIDIA Nemotron Reasoner (Nebius Token Factory)]
                 │
                 ▼
[DAG Schema Parser & Topological Cycle Detector]
                 │
                 ├──> [Plan Preview & Operator Review Gate]
                 │
                 ▼ (Approved)
[Workflow Orchestrator (State Machine)]
                 │
                 ├──> Task 1: Web Research & Evidence Extraction (Tavily Tool)
                 ├──> Task 2: Quantitative Cost-Curve Calculations (Calculator Engine)
                 ├──> Task 3: Tabular Distribution Profiling (CSV Analyzer)
                 ├──> Task 4: Empirical Output Verification (Verification Engine)
                 │
                 ▼
[10-Section Decision Deliverable Compiler]
                 │
                 ▼
[Persistent Storage (Survives Restarts) & Markdown / PDF Export]
```

---

## 🗺️ Application Information Architecture

| Route | Page | Purpose |
|---|---|---|
| `/` | **Landing Page** | Refined marketing introduction, 4-stage pipeline explanation, and live benchmark preview |
| `/app` | **Workspace Dashboard** | Workflow composer with quick-prompt chips, recent executions, report feeds, and live health checks |
| `/app/workflows/new` | **Plan Creator** | Request editor, template catalog (Market Research, Engineering, Data Analysis), and interactive DAG preview |
| `/app/workflows/:id` | **Execution Studio** | Flagship 3-panel layout: Task tree, interactive DAG visual graph, and output/event inspector |
| `/app/history` | **Workflow History** | Searchable, filterable audit log of past runs with status filtering and persistent deletion |
| `/app/reports/:id` | **Report Viewer** | 10-section decision report with executive summary, methodology, citations, and Markdown/PDF download |
| `/app/integrations` | **Integrations Studio** | Live diagnostics, connection latency testing, and secure server-side credential management |
| `/app/settings` | **General Settings** | Human-in-the-loop policies, default deliverable formats, and concurrency limits |
| `/app/settings/models` | **Model Usage** | Live token accounting, average inference latency, and request-level telemetry logs |
| `/app/help` | **Documentation** | 3-minute video script guide, environment setup, and architecture references |

---

## 🛠️ Mandatory Technology Stack

- **Frontend:** React 19, TypeScript (strict mode), Vite, Tailwind CSS, Lucide React icons, React Router DOM, SVG DAG Visualizer
- **Backend:** Node.js + Express full-stack runtime (`server.ts`) running on port 3000
- **AI Integration:** Nebius Token Factory (OpenAI-compatible HTTP client), NVIDIA Nemotron models, with Google AI Studio backup
- **Persistence:** Server-side JSON database engine (`./data/`) with initial benchmark seed

---

## 🔑 Environment Configuration

Create a `.env` file in the root directory:

```bash
# Nebius Token Factory API Key (Required for live NVIDIA Nemotron inference)
NEBIUS_API_KEY="your_nebius_api_key_here"

# Nebius Base URL (Default: https://api.studio.nebius.ai/v1)
NEBIUS_BASE_URL="https://api.studio.nebius.ai/v1"

# NVIDIA Model Identifier
NEBIUS_MODEL="nvidia/llama-3.1-nemotron-70b-instruct"

# Tavily Web Search API Key (Optional: live internet research)
TAVILY_API_KEY="tvly-..."
```

*Note: If no external API keys are configured, FlowPilot AI operates with its built-in offline autonomous engine so all benchmark workflows, DAG visualizations, and reports remain fully executable.*

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run full-stack development server (Express API + Vite on port 3000)
npm run dev

# 3. Build production bundle
npm run build

# 4. Run TypeScript checks
npm run lint
```

---

## 📋 Hackathon 3-Minute Demonstration Script

- **0:00 – 0:20 | The Problem:** Show why black-box LLM agents hallucinate and fail in enterprise environments without observable steps.
- **0:20 – 0:45 | Goal Specification:** Enter the small-business AI workflow benchmark into the Workflow Composer.
- **0:45 – 1:10 | Plan Decomposition:** Show NVIDIA Nemotron synthesizing the 5-node DAG execution plan.
- **1:10 – 1:50 | Observable Studio:** Walk through the 3-panel Execution Studio showing live node statuses, dependency curves, and tool outputs.
- **1:50 – 2:20 | Empirical Verification:** Inspect evidence citations, cost calculations, and verification scores.
- **2:20 – 2:45 | Final Deliverable:** Open and download the 10-section decision deliverable.
- **2:45 – 3:00 | Architecture:** Highlight Nebius Token Factory and NVIDIA Nemotron role.

---

## 📄 License

Licensed under the Apache-2.0 / MIT License. Developed for the **Nebius × NVIDIA Global AI Hackathon 2026**.
