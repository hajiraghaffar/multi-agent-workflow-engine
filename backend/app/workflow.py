import asyncio
from typing import TypedDict, Dict, Any
from langgraph.graph import StateGraph, START, END
import pandas as pd

# RAW DATASET URL
DATASET_URL = "https://raw.githubusercontent.com/YBIFoundation/Dataset/main/Diabetes.csv"

class WorkflowState(TypedDict):
    input_query: str
    scraped_data: str
    analysis: str
    final_summary: str

# Node 1: Fetch patient row
async def web_scraper_node(state: WorkflowState) -> Dict[str, Any]:
    raw_input = state.get("input_query", "0").strip()
    try:
        row_idx = int(raw_input)
    except ValueError:
        row_idx = 0

    try:
        df = pd.read_csv(DATASET_URL)
        safe_idx = min(max(0, row_idx), len(df) - 1)
        row = df.iloc[safe_idx]
        
        record_text = (
            f"CLINICAL PATIENT RECORD (Index #{safe_idx}):\n"
            f"- Age: {int(row['age'])}\n"
            f"- Plasma Glucose: {row['glucose']} mg/dL\n"
            f"- Diastolic Blood Pressure: {row['diastolic']} mm Hg\n"
            f"- BMI: {row['bmi']} kg/m²\n"
            f"- Historical Status: {'Diabetic' if row['diabetes'] == 1 else 'Non-Diabetic'}"
        )
    except Exception as e:
        record_text = f"Error reading dataset: {str(e)}"

    return {"scraped_data": record_text}

# Node 2: Analyze metrics
async def analyzer_node(state: WorkflowState) -> Dict[str, Any]:
    raw_record = state.get("scraped_data", "")
    glucose, bmi, bp = 0.0, 0.0, 0.0
    
    for line in raw_record.split("\n"):
        if "Plasma Glucose" in line:
            glucose = float(line.split(":")[1].replace("mg/dL", "").strip())
        elif "BMI" in line:
            bmi = float(line.split(":")[1].replace("kg/m²", "").strip())
        elif "Blood Pressure" in line:
            bp = float(line.split(":")[1].replace("mm Hg", "").strip())

    risks = []
    if glucose >= 140:
        risks.append(f"CRITICAL: High Blood Glucose ({glucose} mg/dL).")
    elif glucose >= 100:
        risks.append(f"WARNING: Pre-diabetic Fasting Glucose ({glucose} mg/dL).")
    else:
        risks.append(f"NORMAL: Blood Glucose ({glucose} mg/dL).")

    if bmi >= 30:
        risks.append(f"HIGH RISK: BMI of {bmi} (Obese).")
    elif bmi >= 25:
        risks.append(f"MODERATE RISK: BMI of {bmi} (Overweight).")

    analysis_text = "CLINICAL RISK ASSESSMENT:\n" + "\n".join(f"- {r}" for r in risks)
    return {"analysis": analysis_text}

# Node 3: Medical Summary
async def summarizer_node(state: WorkflowState) -> Dict[str, Any]:
    analysis = state.get("analysis", "")
    recommendations = []
    
    if "CRITICAL" in analysis or "HIGH RISK" in analysis:
        recommendations.append("Order immediate HbA1c lab test & schedule endocrinologist review.")
        recommendations.append("Prescribe low-glycemic dietary plan & daily glucose tracking.")
    else:
        recommendations.append("Maintain wellness routine with semi-annual screening.")
        recommendations.append("Encourage 30 mins daily physical activity.")

    summary_text = "PHYSICIAN ACTION BRIEF:\n" + "\n".join(f"• {rec}" for rec in recommendations)
    return {"final_summary": summary_text}

# Build and Compile Graph
builder = StateGraph(WorkflowState)
builder.add_node("node_scraper", web_scraper_node)
builder.add_node("node_analyzer", analyzer_node)
builder.add_node("node_summarizer", summarizer_node)

builder.add_edge(START, "node_scraper")
builder.add_edge("node_scraper", "node_analyzer")
builder.add_edge("node_analyzer", "node_summarizer")
builder.add_edge("node_summarizer", END)

# Export the variable to main.py
workflow_graph = builder.compile()