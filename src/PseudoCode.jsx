import React from 'react';

const PseudoCode = ({ algorithm, currentStep, isVisible }) => {
  if (!isVisible) return null;

  const bfsPseudoCode = [
    { id: 1, code: 'BFS(G, start):', isHeader: true },
    { id: 2, code: '  create empty queue Q', highlight: currentStep === 2 },
    { id: 3, code: '  create set visited', highlight: currentStep === 3 },
    { id: 4, code: '  enqueue start to Q', highlight: currentStep === 4 },
    { id: 5, code: '  add start to visited', highlight: currentStep === 5 },
    { id: 6, code: '  while Q is not empty:', highlight: currentStep === 6 },
    { id: 7, code: '    current = dequeue from Q', highlight: currentStep === 7 },
    { id: 8, code: '    process current node', highlight: currentStep === 8 },
    { id: 9, code: '    for each neighbor of current:', highlight: currentStep === 9 },
    { id: 10, code: '      if neighbor not in visited:', highlight: currentStep === 10 },
    { id: 11, code: '        add neighbor to visited', highlight: currentStep === 11 },
    { id: 12, code: '        enqueue neighbor to Q', highlight: currentStep === 12 },
  ];

  const dfsPseudoCode = [
    { id: 1, code: 'DFS(G, start):', isHeader: true },
    { id: 2, code: '  create empty stack S', highlight: currentStep === 2 },
    { id: 3, code: '  create set visited', highlight: currentStep === 3 },
    { id: 4, code: '  push start to S', highlight: currentStep === 4 },
    { id: 5, code: '  while S is not empty:', highlight: currentStep === 5 },
    { id: 6, code: '    current = pop from S', highlight: currentStep === 6 },
    { id: 7, code: '    if current not in visited:', highlight: currentStep === 7 },
    { id: 8, code: '      add current to visited', highlight: currentStep === 8 },
    { id: 9, code: '      process current node', highlight: currentStep === 9 },
    { id: 10, code: '      for each neighbor of current:', highlight: currentStep === 10 },
    { id: 11, code: '        if neighbor not in visited:', highlight: currentStep === 11 },
    { id: 12, code: '          push neighbor to S', highlight: currentStep === 12 },
  ];

  const pseudoCode = algorithm === 'bfs' ? bfsPseudoCode : dfsPseudoCode;

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-2xl p-4 w-80 max-h-[80vh] overflow-y-auto border-2 border-purple-500">
      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
        {algorithm.toUpperCase()} Pseudo Code
      </h3>
      <div className="font-mono text-xs space-y-1">
        {pseudoCode.map((line) => (
          <div 
            key={line.id}
            className={`px-2 py-1 rounded ${line.highlight ? 'bg-purple-100 text-purple-800' : 'text-gray-700'}`}
          >
            {line.isHeader ? (
              <span className="font-bold">{line.code}</span>
            ) : (
              <span className="text-gray-500">└─</span>
            )} {line.code}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PseudoCode;
