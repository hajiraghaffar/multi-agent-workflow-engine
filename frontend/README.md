# 🚀 Multi-Agent Visual Execution Engine

A full-stack, real-time visual workflow engine powered by **LangGraph**, **FastAPI**, and **React Flow**. This application dynamically ingests live online datasets, processes records through an asynchronous multi-agent pipeline, and visually updates nodes in real time.

---

## 🛠️ Tech Stack

- **Frontend:** React, React Flow (`@xyflow/react`), Zustand
- **Backend:** FastAPI, LangGraph, Python `pandas`
- **Communication:** Server-Sent Events (SSE) for real-time node state streaming

---

## 🚀 Key Features

- **Dynamic Data Ingestion:** Fetches row-level record data from live remote CSV URLs.
- **Multi-Agent Pipeline:**
  1. **Data Fetcher Agent:** Extracts specific rows dynamically based on user input.
  2. **Data Analyzer Agent:** Evaluates metrics against predefined logic or LLM assessments.
  3. **Summarizer Agent:** Generates an actionable summary brief for users.
- **Real-Time Visualizer:** Graph nodes change state (`IDLE` ➔ `RUNNING` ➔ `COMPLETED`) with green status highlighting upon execution.

---

## 💻 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (3.10+)

---

### 2. Backend Setup (FastAPI + LangGraph)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required dependencies
pip install fastapi uvicorn langgraph pandas

# Start the server
uvicorn main:app --reload --port 8000



