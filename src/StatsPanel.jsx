import React from 'react';

const StatsPanel = ({ nodes, componentColors }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-2xl p-4 border-2 border-gray-200">
      <h2 className="text-gray-800 font-bold mb-3 text-sm flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        Statistics
      </h2>
      <div className="space-y-2">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-gray-600 text-xs font-medium">Total Nodes</p>
          <p className="text-blue-700 text-3xl font-bold">{nodes.length}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <p className="text-gray-600 text-xs font-medium">Connected Components</p>
          <p className="text-purple-700 text-3xl font-bold">{componentColors.length}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
