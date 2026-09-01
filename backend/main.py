import json
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.workflow import workflow_graph

app = FastAPI(title="Multi-Agent Execution Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WorkflowRequest(BaseModel):
    input_query: str = "0"

@app.post("/api/execute-stream")
async def execute_stream(request: WorkflowRequest):
    async def event_generator():
        initial_state = {"input_query": request.input_query}
        
        # Stream updates from LangGraph execution
        async for event in workflow_graph.astream(initial_state, stream_mode="updates"):
            for node_id, node_output in event.items():
                
                # Extract text output from node result dictionary
                output_text = ""
                if isinstance(node_output, dict):
                    output_text = (
                        node_output.get("scraped_data") or 
                        node_output.get("analysis") or 
                        node_output.get("final_summary") or 
                        str(node_output)
                    )

                # Send node running event
                yield f"data: {json.dumps({'type': 'NODE_START', 'nodeId': node_id})}\n\n"
                await asyncio.sleep(0.4)

                # Send node complete event with output text
                yield f"data: {json.dumps({'type': 'NODE_COMPLETE', 'nodeId': node_id, 'output': output_text})}\n\n"
        
        yield f"data: {json.dumps({'type': 'WORKFLOW_COMPLETE'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")