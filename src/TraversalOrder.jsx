import React, { useMemo } from 'react';

const TraversalOrder = ({ 
  traversalNodes = [], 
  nodes = [], 
  edges = [],
  isDirected = false,
  onClose = () => {}, 
  algorithm = '', 
  pseudoCodeStep = 1,
  showPseudoCode = false,
  traversalSequence = [],
  // Playback control props
  playbackActive = false,
  isPlaying = false,
  currentStep = 0,
  totalSteps = 0,
  playbackSpeed = 1,
  onPlaybackPlay = () => {},
  onPlaybackPause = () => {},
  onPlaybackStepForward = () => {},
  onPlaybackStepBackward = () => {},
  onPlaybackReset = () => {},
  onPlaybackClose = () => {},
  onSpeedChange = () => {}
}) => {
  console.log('TraversalOrder rendering', { 
    showPseudoCode, 
    traversalNodesLength: traversalNodes?.length,
    algorithm,
    playbackActive
  });
  // Show panel if playback is active OR if there are traversal nodes OR if showing pseudo code
  if (!playbackActive && traversalNodes.length === 0 && !showPseudoCode) return null;

  const bfsPseudoCode = [
    { id: 1, code: 'BFS(G, start):', isHeader: true },
    { id: 2, code: '  create empty queue Q', highlight: pseudoCodeStep === 2 },
    { id: 3, code: '  create set visited', highlight: pseudoCodeStep === 3 },
    { id: 4, code: '  enqueue start to Q', highlight: pseudoCodeStep === 4 },
    { id: 5, code: '  add start to visited', highlight: pseudoCodeStep === 5 },
    { id: 6, code: '  while Q is not empty:', highlight: pseudoCodeStep === 6 },
    { id: 7, code: '    current = dequeue from Q', highlight: pseudoCodeStep === 7 },
    { id: 8, code: '    process current node', highlight: pseudoCodeStep === 8 },
    { id: 9, code: '    for each neighbor of current:', highlight: pseudoCodeStep === 9 },
    { id: 10, code: '      if neighbor not in visited:', highlight: pseudoCodeStep === 10 },
    { id: 11, code: '        add neighbor to visited', highlight: pseudoCodeStep === 11 },
    { id: 12, code: '        enqueue neighbor to Q', highlight: pseudoCodeStep === 12 },
  ];

  const dfsPseudoCode = [
    { id: 1, code: 'DFS(G, start):', isHeader: true },
    { id: 2, code: '  create empty stack S', highlight: pseudoCodeStep === 2 },
    { id: 3, code: '  create set visited', highlight: pseudoCodeStep === 3 },
    { id: 4, code: '  push start to S', highlight: pseudoCodeStep === 4 },
    { id: 5, code: '  while S is not empty:', highlight: pseudoCodeStep === 5 },
    { id: 6, code: '    current = pop from S', highlight: pseudoCodeStep === 6 },
    { id: 7, code: '    if current not in visited:', highlight: pseudoCodeStep === 7 },
    { id: 8, code: '      add current to visited', highlight: pseudoCodeStep === 8 },
    { id: 9, code: '      process current node', highlight: pseudoCodeStep === 9 },
    { id: 10, code: '      for each neighbor of current:', highlight: pseudoCodeStep === 10 },
    { id: 11, code: '        if neighbor not in visited:', highlight: pseudoCodeStep === 11 },
    { id: 12, code: '          push neighbor to S', highlight: pseudoCodeStep === 12 },
  ];

  const pseudoCode = algorithm === 'bfs' ? bfsPseudoCode : dfsPseudoCode;
  const currentLine = pseudoCode.find(line => line.highlight);
  const currentLineNumber = currentLine ? currentLine.id : 0;

  // Calculate current stack/queue state based on traversal step
  const dataStructureState = useMemo(() => {
    if (!traversalSequence || traversalSequence.length === 0 || !nodes || nodes.length === 0 || currentStep === 0) return [];
    
    const isBFS = algorithm === 'bfs';
    
    // Build adjacency list from edges
    const adjList = {};
    nodes.forEach(node => {
      adjList[node.id] = [];
    });
    
    edges.forEach(edge => {
      if (!adjList[edge.source]) adjList[edge.source] = [];
      if (!adjList[edge.target]) adjList[edge.target] = [];
      
      adjList[edge.source].push(edge.target);
      // For undirected graphs, add reverse edge
      if (!isDirected) {
        adjList[edge.target].push(edge.source);
      }
    });
    
    // Simulate the algorithm up to current step
    const visited = new Set();
    const dataStructure = []; // Queue for BFS, Stack for DFS
    const startNode = traversalSequence[0];
    
    // Add start node to data structure
    dataStructure.push(startNode);
    
    // Process nodes up to current step - 1 (current step is being processed now)
    for (let i = 0; i < currentStep - 1; i++) {
      // Remove from data structure (being processed)
      let current;
      if (isBFS) {
        current = dataStructure.shift(); // Dequeue from front
      } else {
        current = dataStructure.pop(); // Pop from top
      }
      
      if (current === undefined) break;
      
      visited.add(current);
      
      // Add neighbors to data structure
      const neighbors = adjList[current] || [];
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor) && !dataStructure.includes(neighbor)) {
          if (isBFS) {
            dataStructure.push(neighbor); // Enqueue at back
          } else {
            dataStructure.push(neighbor); // Push to top
          }
        }
      });
    }
    
    return dataStructure;
  }, [traversalSequence, currentStep, algorithm, nodes, edges, isDirected]);

  return (
    <div className="w-[320px] h-full bg-white shadow-lg border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-sm font-medium text-gray-700">
            {algorithm?.toUpperCase() || 'ALGORITHM'}.js
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Traversal Order - Moved to top */}
      <div className="border-b border-gray-200">
        <div className="p-2 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Traversal Order</h3>
          <div className="text-xs text-gray-500">
            {traversalNodes.length} node{traversalNodes.length !== 1 ? 's' : ''} visited
          </div>
        </div>
        <div className="p-2 bg-white">
          <div className="flex flex-wrap gap-1">
            {traversalNodes.map((nodeId, index) => {
              const node = nodes.find(n => n.id === nodeId);
              const nodeColor = node?.color || '#3B82F6';
              return (
                <div
                  key={index}
                  className="px-2 py-1 rounded text-xs font-medium text-white flex items-center"
                  style={{ backgroundColor: nodeColor }}
                >
                  {node?.label || nodeId}
                  <span className="ml-1 text-xs opacity-70">#{index + 1}</span>
                </div>
              );
            })}
            {traversalNodes.length === 0 && (
              <div className="text-sm text-gray-400 italic w-full text-center py-2">
                No nodes visited yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Processing Node */}
      {currentStep > 0 && traversalSequence.length > 0 && (
        <div className="border-b border-gray-200 bg-blue-50 p-2">
          <div className="text-xs text-gray-600 mb-1">Currently Processing:</div>
          <div className="flex items-center gap-2">
            {(() => {
              const currentNodeId = traversalSequence[currentStep - 1];
              const currentNode = nodes.find(n => n.id === currentNodeId);
              const nodeColor = currentNode?.color || '#3B82F6';
              return (
                <div 
                  className="px-4 py-2 rounded text-sm font-bold text-white text-center"
                  style={{ backgroundColor: nodeColor }}
                >
                  Node {currentNode?.label || currentNodeId}
                </div>
              );
            })()}
            <span className="text-xs text-gray-500">
              (Step {currentStep} of {traversalSequence.length})
            </span>
          </div>
        </div>
      )}

      {/* Data Structure - Stack/Queue - Horizontal Scroll */}
      <div className="flex flex-col border-b border-gray-200">
        <div className="p-2 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">
            {algorithm === 'bfs' ? 'Queue' : 'Stack'} State
          </h3>
          <div className="text-xs text-gray-500">
            Next nodes to process
          </div>
        </div>
        <div className="p-2 bg-gray-50">
          {/* Direction indicators */}
          {dataStructureState.length > 0 && (
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              {algorithm === 'bfs' ? (
                <>
                  <span>← Front (Dequeue)</span>
                  <span>Back (Enqueue) →</span>
                </>
              ) : (
                <>
                  <span>← Bottom</span>
                  <span>Top (Pop) →</span>
                </>
              )}
            </div>
          )}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dataStructureState.map((nodeId, index) => {
              const node = nodes.find(n => n.id === nodeId);
              const nodeColor = node?.color || '#3B82F6';
              const isNext = index === 0; // First node is next to be processed
              return (
                <div 
                  key={index}
                  className={`px-3 py-2 rounded text-sm font-medium text-white text-center whitespace-nowrap ${
                    isNext ? 'ring-2 ring-yellow-400 shadow-lg' : ''
                  }`}
                  style={{ backgroundColor: nodeColor, minWidth: '40px' }}
                  title={isNext ? 'Next to process' : ''}
                >
                  {node?.label || nodeId}
                </div>
              );
            })}
            {dataStructureState.length === 0 && (
              <div className="text-sm text-gray-400 italic text-center py-2 w-full">
                {algorithm === 'bfs' ? 'Queue is empty' : 'Stack is empty'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pseudo Code Section - Takes remaining space */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Algorithm</h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
            {algorithm?.toUpperCase() || 'N/A'}
          </span>
        </div>
        <div className="flex h-full overflow-hidden">
          {/* Line Numbers */}
          <div className="bg-gray-50 text-right text-gray-400 text-xs py-2 px-2 border-r border-gray-200 font-mono">
            {pseudoCode.map((_, i) => (
              <div key={i} className="h-6 flex items-center justify-end pr-2">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Pseudo Code */}
          <div className="flex-1 overflow-y-auto font-mono text-sm bg-white">
            {pseudoCode.map((line, i) => (
              <div 
                key={i}
                className={`flex items-start px-3 py-1 h-6 ${
                  line.highlight ? 'bg-blue-50' : ''
                }`}
              >
                <span className={`${line.highlight ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                  {line.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Playback Controls */}
      <div className="mt-auto border-t border-gray-200 bg-gray-50 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-700">
            Step: {currentStep} / {totalSteps}
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={playbackSpeed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="text-xs border rounded px-1 py-0.5"
            >
              <option value="2000">0.5x</option>
              <option value="1000">1x</option>
              <option value="500">2x</option>
              <option value="250">4x</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={onPlaybackStepBackward}
            disabled={currentStep <= 1}
            className="p-1.5 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Step Backward"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {isPlaying ? (
            <button
              onClick={onPlaybackPause}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              title="Pause"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onPlaybackPlay}
              disabled={!playbackActive}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Play"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          <button
            onClick={onPlaybackStepForward}
            disabled={currentStep >= totalSteps}
            className="p-1.5 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Step Forward"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={onPlaybackReset}
            disabled={!playbackActive}
            className="p-1.5 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Reset"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <button
            onClick={onPlaybackClose}
            className="p-1.5 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraversalOrder;
