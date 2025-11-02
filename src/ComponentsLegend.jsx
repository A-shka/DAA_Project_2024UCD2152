import React from 'react';

const ComponentsLegend = ({ componentColors, nodes, edges }) => {
  if (componentColors.length === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 shadow-2xl">
      {/* Statistics Row */}
      <div className="flex items-center justify-center px-6 py-2 border-b border-gray-200 bg-gray-50">
        <p className="text-gray-700 text-sm font-medium">
          <span className="font-semibold text-blue-700">Total Nodes:</span> {nodes.length} 
          <span className="mx-2 text-gray-400">|</span>
          <span className="font-semibold text-green-700">Total Edges:</span> {edges.length}
          <span className="mx-2 text-gray-400">|</span>
          <span className="font-semibold text-purple-700">Connected Components:</span> {componentColors.length}
        </p>
      </div>

      {/* Components Row */}
      <div className="flex items-center gap-4 px-6 py-3 overflow-x-auto">
        <h2 className="text-gray-800 font-bold text-sm flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Components:
        </h2>
        <div className="flex items-center gap-3 flex-1">
          {componentColors.map((color, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg px-4 py-2 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-300 shadow-sm"
            >
              <div
                className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-700 text-sm font-semibold whitespace-nowrap">
                Component {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentsLegend;
