import React, { useState } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from './store/useWorkflowStore';
import { AgentNode } from './components/nodes/AgentNode';

const nodeTypes = { agentNode: AgentNode };

function App() {
  const [patientIndex, setPatientIndex] = useState('0');
  const [loading, setLoading] = useState(false);

  // Connect Zustand actions
  const { nodes, edges, onNodesChange, onEdgesChange, updateNodeStatus, resetNodeStatuses } = useWorkflowStore();

  const handleExecuteWorkflow = async () => {
    setLoading(true);
    resetNodeStatuses(); // Reset all nodes back to grey before execution

    try {
      const response = await fetch('http://localhost:8000/api/execute-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_query: patientIndex }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); 

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const event = JSON.parse(line.replace('data: ', ''));

            if (event.type === 'NODE_START') {
              updateNodeStatus(event.nodeId, 'RUNNING');
            } else if (event.type === 'NODE_COMPLETE') {
              updateNodeStatus(event.nodeId, 'COMPLETED', event.output);
            }
          }
        }
      }
    } catch (error) {
      console.error('Execution stream error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0b0f19', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER BAR */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 24px', borderBottom: '1px solid #1e293b', background: '#0f172a', zIndex: 10
      }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '20px', margin: 0, fontWeight: 'bold' }}>
            Multi-Agent Workflow Engine
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
            Real-time LangGraph & React Flow Visualizer
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="number"
            value={patientIndex}
            onChange={(e) => setPatientIndex(e.target.value)}
            placeholder="Patient Row (e.g. 0)"
            min="0"
            max="760"
            style={{
              padding: '8px 14px', borderRadius: '6px', border: '1px solid #334155',
              background: '#1e293b', color: '#ffffff', fontSize: '14px', outline: 'none', width: '180px'
            }}
          />

          <button
            onClick={handleExecuteWorkflow}
            disabled={loading}
            style={{
              background: '#5865F2', color: '#ffffff', padding: '8px 20px', borderRadius: '6px',
              border: 'none', fontWeight: '600', fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Running...' : 'Execute Workflow'}
          </button>
        </div>
      </div>

      {/* REACT FLOW CANVAS */}
      <div style={{ flex: 1, width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#1e293b" gap={16} />
          <Controls />
        </ReactFlow>
      </div>

    </div>
  );
}

export default App;