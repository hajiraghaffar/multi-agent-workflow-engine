import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

export const useWorkflowStore = create((set, get) => ({
  // 1. Initial Nodes with IDs that match backend LangGraph nodes exactly
  nodes: [
    {
      id: 'node_scraper',
      type: 'agentNode',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Web Scraper Agent', 
        description: 'Extracts patient data from live dataset URL',
        status: 'IDLE', // IDLE | RUNNING | COMPLETED | FAILED
        output: '' 
      },
    },
    {
      id: 'node_analyzer',
      type: 'agentNode',
      position: { x: 450, y: 200 },
      data: { 
        label: 'Data Analyzer Agent', 
        description: 'Evaluates glucose, BMI, and clinical thresholds',
        status: 'IDLE',
        output: '' 
      },
    },
    {
      id: 'node_summarizer',
      type: 'agentNode',
      position: { x: 800, y: 300 },
      data: { 
        label: 'Summarizer Agent', 
        description: 'Generates doctor action plan',
        status: 'IDLE',
        output: '' 
      },
    },
  ],

  // 2. Initial Edges
  edges: [
    { id: 'e1-2', source: 'node_scraper', target: 'node_analyzer', animated: true },
    { id: 'e2-3', source: 'node_analyzer', target: 'node_summarizer', animated: true },
  ],

  // React Flow Handlers
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),

  // 3. Status Updater Function (Turns nodes GREEN when status = 'COMPLETED')
  updateNodeStatus: (nodeId, status, output = '') => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              status: status,
              output: output || node.data.output,
            },
          };
        }
        return node;
      }),
    }));
  },

  // Reset node states before running workflow
  resetNodeStatuses: () => {
    set((state) => ({
      nodes: state.nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: 'IDLE', output: '' },
      })),
    }));
  },
}));