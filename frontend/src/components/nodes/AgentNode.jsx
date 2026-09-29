import React from 'react';
import { Handle, Position } from '@xyflow/react';

export function AgentNode({ data }) {
  const isCompleted = data.status === 'COMPLETED';
  const isRunning = data.status === 'RUNNING';

  return (
    <div
      style={{
        padding: '14px 18px',
        borderRadius: '8px',
        minWidth: '220px',
        background: isCompleted ? '#064e3b' : isRunning ? '#1e3a8a' : '#1e293b',
        border: `2px solid ${isCompleted ? '#10b981' : isRunning ? '#3b82f6' : '#334155'}`,
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease'
      }}
    >
      <Handle type="target" position={Position.Top} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '14px' }}>{data.label}</strong>
        <span style={{
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '4px',
          background: isCompleted ? '#10b981' : isRunning ? '#3b82f6' : '#475569',
          color: '#fff',
          fontWeight: 'bold'
        }}>
          {data.status || 'IDLE'}
        </span>
      </div>

      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0' }}>{data.description}</p>

      {/* Render Node Output when finished */}
      {data.output && (
        <div style={{
          marginTop: '8px',
          padding: '6px 8px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '4px',
          fontSize: '10px',
          whiteSpace: 'pre-wrap',
          maxHeight: '100px',
          overflowY: 'auto'
        }}>
          {data.output}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}