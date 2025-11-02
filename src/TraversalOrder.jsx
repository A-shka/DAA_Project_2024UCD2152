import React from 'react';

const TraversalOrder = ({ traversalNodes, nodes, onClose }) => {
  if (traversalNodes.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-2xl p-4 max-w-md border-2 border-blue-500">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Traversal Order
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded p-1 transition-colors"
          title="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
        {traversalNodes.map((nodeId, index) => {
          const node = nodes.find(n => n.id === nodeId);
          const nodeColor = node?.color || '#3B82F6';
          
          return (
            <div
              key={index}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md shadow-sm transition-all duration-200 transform hover:scale-105"
              style={{
                backgroundColor: nodeColor,
                color: '#FFFFFF',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <span className="text-xs font-medium opacity-70">#{index + 1}</span>
              <span className="text-lg font-bold">{node?.label || nodeId}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Total Visited:</span> {traversalNodes.length} node{traversalNodes.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default TraversalOrder;
