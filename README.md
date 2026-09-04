# 🩺 Real-Time Multi-Agent AI Visualizer for Clinical Data

An enterprise-grade, full-stack multi-agent workflow engine built to process, analyze, and summarize medical patient data in real time. 

This project demonstrates a production-ready asynchronous architecture using **LangGraph** for multi-agent orchestration, **FastAPI** with **Server-Sent Events (SSE)** for real-time state streaming, and **React Flow** for interactive node-based visual rendering.

---

## 🌟 Key Features

* **Dynamic Medical Ingestion:** Live extraction of clinical metrics (Glucose, BMI, Blood Pressure, Insulin) directly from public datasets via custom `pandas` pipelines.
* **Multi-Agent Pipeline Execution:**
  * **Data Fetcher Agent (`node_scraper`):** Dynamic record lookup by index.
  * **Clinical Risk Analyzer Agent (`node_analyzer`):** Evaluates patient diagnostic metrics against standard clinical risk thresholds.
  * **Action Plan Summarizer Agent (`node_summarizer`):** Formulates actionable diagnostic briefs for attending physicians.
* **Real-Time Visual Canvas:** Reactive UI built with React Flow and Zustand that dynamically transitions node status colors (`IDLE` ➔ `RUNNING` ➔ `COMPLETED`) as server events stream in.
* **Dual Execution Modes:** Includes both an offline rule-based diagnostic evaluation engine and integration for Google Gemini LLMs.

---

## 🏗️ Architecture & Tech Stack

### Frontend
* **React 19**
* **React Flow (`@xyflow/react`)** — Interactive node canvas.
* **Zustand** — Client-side state management.

### Backend
* **FastAPI** — High-performance async Python web framework.
* **LangGraph** — Cyclic state graph orchestration for agent workflows.
* **Pandas** — Live dataset ingestion and parsing.
* **Server-Sent Events (SSE)** — Event streaming over HTTP.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (v18 or higher)
* **Python** (3.10 or higher)

---

### 2. Backend Setup

Navigate to your backend directory, set up your environment, and start the FastAPI server:

```bash
# Navigate to backend folder
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required dependencies
pip install fastapi uvicorn langgraph pandas google-generativeai

# Start the Uvicorn development server
uvicorn main:app --reload --port 8000
