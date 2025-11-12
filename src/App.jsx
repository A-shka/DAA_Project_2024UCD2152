import React, { useState, useEffect, useRef, useMemo } from 'react';
import GraphCanvas from './GraphCanvas';
import ControlPanel from './ControlPanel';
import TraversalOrder from './TraversalOrder';
import PseudoCode from './PseudoCode';
import InfoModal from './InfoModal';
import ComponentsLegend from './ComponentsLegend';
import { 
  bfs, 
  dfs, 
  findConnectedComponents, 
  findArticulationPoints,
  generateComponentColors 
} from './algorithms';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mode, setMode] = useState('addNode');
  const [selectedNode, setSelectedNode] = useState(null);
  const [articulationPoints, setArticulationPoints] = useState([]);
  const [flashingNodes, setFlashingNodes] = useState([]);
  const [traversalNodes, setTraversalNodes] = useState([]);
  const [traversalSequence, setTraversalSequence] = useState([]);
  const [traversalAlgorithm, setTraversalAlgorithm] = useState(null);
  const [componentColors, setComponentColors] = useState([]);
  const [nextNodeId, setNextNodeId] = useState(1);
  const [nextEdgeId, setNextEdgeId] = useState(1);
  const [isDirected, setIsDirected] = useState(false);
  
  // Traversal and pseudo-code state
  const [showPseudoCode, setShowPseudoCode] = useState(false);
  const [pseudoCodeStep, setPseudoCodeStep] = useState(1);
  
  // Playback controls
  const [playbackActive, setPlaybackActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const playbackTimerRef = useRef(null);
  
  // Info modal
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // Update connected components and colors whenever nodes or edges change
  useEffect(() => {
    if (nodes.length === 0) {
      setComponentColors([]);
      return;
    }

    const components = findConnectedComponents(nodes, edges);
    const colors = generateComponentColors(components.length);
    setComponentColors(colors);

    // Assign colors to nodes based on their component
    setNodes(prevNodes => prevNodes.map(node => {
      const componentIndex = components.findIndex(comp => comp.includes(node.id));
      return {
        ...node,
        color: colors[componentIndex] || '#3B82F6'
      };
    }));
  }, [edges.length, nodes.length, JSON.stringify(edges.map(e => ({ s: e.source, t: e.target })))]);

  // Clear articulation points when graph structure changes
  useEffect(() => {
    // Clear articulation points when nodes or edges are deleted/added
    // This ensures the red dots disappear when graph structure changes
    setArticulationPoints([]);
  }, [nodes.length, edges.length]);

  // Add a new node
  const handleAddNode = (x, y) => {
    const newNode = {
      id: nextNodeId,
      label: `${nextNodeId}`,
      x,
      y,
      color: '#3B82F6'
    };
    setNodes([...nodes, newNode]);
    setNextNodeId(nextNodeId + 1);
  };

  // Add a new edge
  const handleAddEdge = (source, target) => {
    if (source === target) return; // Prevent self-loops

    // Check if edge already exists (in either direction for undirected)
    const edgeExists = edges.some(edge => 
      (edge.source === source && edge.target === target) || 
      (!isDirected && edge.source === target && edge.target === source)
    );
    
    if (edgeExists) return;

    const newEdge = {
      id: `e${nextEdgeId}`,
      source,
      target,
      directed: isDirected
    };

    setEdges([...edges, newEdge]);
    setNextEdgeId(nextEdgeId + 1);
  };

  // Handle node click
  const handleNodeClick = (nodeId) => {
    if (mode === 'delete') {
      // Delete node and all connected edges
      setNodes(nodes.filter(n => n.id !== nodeId));
      setEdges(edges.filter(e => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
    } else {
      setSelectedNode(nodeId);
    }
  };

  // Handle edge click
  const handleEdgeClick = (edgeId) => {
    if (mode === 'delete') {
      setEdges(edges.filter(e => e.id !== edgeId));
    }
  };

  // Handle node position change (drag)
  const handleNodePositionChange = (nodeId, x, y) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId ? { ...node, x, y } : node
      )
    );
  };

  // Run traversal algorithm (BFS or DFS)
  const runTraversal = (algorithm, startNodeId) => {
    console.log(`Running ${algorithm} from node ${startNodeId}`);
    
    // Reset states
    setTraversalAlgorithm(algorithm);
    setShowPseudoCode(true);
    setPseudoCodeStep(1);
    
    try {
      // Validate nodes and edges
      if (!nodes || nodes.length === 0) {
        console.warn('No nodes in the graph');
        return;
      }
      
      // Validate startNodeId exists in nodes
      const nodeIds = new Set(nodes.map(node => node.id));
      if (!startNodeId || !nodeIds.has(startNodeId)) {
        console.warn(`Invalid start node ID: ${startNodeId}, defaulting to first node`);
        startNodeId = nodes[0]?.id;
        if (!startNodeId) return;
      }
      
      // Run the actual algorithm
      const traversal = algorithm === 'bfs' ? 
        bfs(nodes, edges, startNodeId, isDirected) : 
        dfs(nodes, edges, startNodeId, isDirected);
      
      console.log('Traversal result:', traversal);
      
      if (!traversal || !Array.isArray(traversal) || traversal.length === 0) {
        console.warn('Empty or invalid traversal result:', traversal);
        return;
      }
      
      // Set the traversal sequence for playback
      setTraversalSequence(traversal);
      setCurrentStep(1); // Start at step 1 to show the first node
      setPseudoCodeStep(1);
      
    } catch (error) {
      console.error(`Error running ${algorithm}:`, error);
    }
  };

  // Run BFS with playback
  const handleRunBFS = () => {
    if (nodes.length === 0) return;
    
    const startNode = selectedNode || nodes[0].id;
    runTraversal('bfs', startNode);
    setPlaybackActive(true);
    setIsPlaying(true); // Auto-start playback
  };

  // Run DFS with playback
  const handleRunDFS = () => {
    if (nodes.length === 0) return;
    
    const startNode = selectedNode || nodes[0].id;
    runTraversal('dfs', startNode);
    setPlaybackActive(true);
    setIsPlaying(true); // Auto-start playback
  };

  // Update traversal nodes when step changes
  useEffect(() => {
    if (traversalSequence.length > 0) {
      setTraversalNodes(traversalSequence.slice(0, currentStep));
      // Update pseudo-code step to cycle through the algorithm steps
      const pseudoStep = ((currentStep - 1) % 12) + 1;
      setPseudoCodeStep(pseudoStep);
    }
  }, [currentStep, traversalSequence]);

  // Playback controls
  useEffect(() => {
    if (isPlaying && currentStep < traversalSequence.length) {
      playbackTimerRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, playbackSpeed);
    } else if (currentStep >= traversalSequence.length && isPlaying) {
      setIsPlaying(false);
    }

    return () => {
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
      }
    };
  }, [isPlaying, currentStep, traversalSequence.length, playbackSpeed]);

  const handlePlaybackPlay = () => {
    if (currentStep >= traversalSequence.length) {
      setCurrentStep(1); // Reset to beginning if at the end
    }
    setIsPlaying(true);
  };

  const handlePlaybackPause = () => {
    setIsPlaying(false);
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current);
    }
  };

  const handlePlaybackStepForward = () => {
    if (currentStep < traversalSequence.length) {
      setIsPlaying(false);
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePlaybackStepBackward = () => {
    if (currentStep > 1) {
      setIsPlaying(false);
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
      }
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePlaybackReset = () => {
    setIsPlaying(false);
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current);
    }
    setCurrentStep(1);
  };

  const handlePlaybackClose = () => {
    setPlaybackActive(false);
    setIsPlaying(false);
    setCurrentStep(0);
    setTraversalNodes([]);
    setTraversalSequence([]);
    setTraversalAlgorithm(null);
  };

  // Find and flash articulation points
  const handleFindArticulationPoints = () => {
    if (nodes.length === 0) return;
    
    const points = findArticulationPoints(nodes, edges);
    setArticulationPoints(points);
    
    // Show message if no articulation points found
    if (points.length === 0) {
      alert('No articulation points found in this graph!\n\nArticulation points (cut vertices) are nodes whose removal would disconnect the graph or increase the number of connected components.');
      return;
    }
    
    // Flash animation
    let flashes = 0;
    const flashInterval = setInterval(() => {
      setFlashingNodes(prev => prev.length > 0 ? [] : points);
      flashes++;
      
      if (flashes >= 6) {
        clearInterval(flashInterval);
        setFlashingNodes([]);
      }
    }, 300);
  };

  // Clear graph
  const handleClearGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setArticulationPoints([]);
    setFlashingNodes([]);
    setTraversalNodes([]);
    setNextNodeId(1);
    setNextEdgeId(1);
  };

  // Generate sample graph
  const handleGenerateSample = () => {
    const sampleNodes = [
      { id: 1, label: '1', x: 200, y: 150, color: '#3B82F6' },
      { id: 2, label: '2', x: 350, y: 150, color: '#3B82F6' },
      { id: 3, label: '3', x: 500, y: 150, color: '#3B82F6' },
      { id: 4, label: '4', x: 275, y: 280, color: '#3B82F6' },
      { id: 5, label: '5', x: 425, y: 280, color: '#3B82F6' },
      { id: 6, label: '6', x: 350, y: 400, color: '#3B82F6' },
      { id: 7, label: '7', x: 650, y: 200, color: '#3B82F6' },
      { id: 8, label: '8', x: 750, y: 300, color: '#3B82F6' },
    ];

    const sampleEdges = [
      { id: 'e1', source: 1, target: 2 },
      { id: 'e2', source: 2, target: 3 },
      { id: 'e3', source: 1, target: 4 },
      { id: 'e4', source: 2, target: 4 },
      { id: 'e5', source: 2, target: 5 },
      { id: 'e6', source: 3, target: 5 },
      { id: 'e7', source: 4, target: 5 },
      { id: 'e8', source: 5, target: 6 },
      { id: 'e9', source: 7, target: 8 },
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setNextNodeId(9);
    setNextEdgeId(10);
    setSelectedNode(null);
    setArticulationPoints([]);
  };

  return (
    <div className="h-[100vh] w-[100vw] flex overflow-hidden bg-white">
      {/* Left Panel - Controls */}
      <div className="w-[300px] h-full bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0">
        <ControlPanel 
          mode={mode}
          setMode={setMode}
          onRunBFS={handleRunBFS}
          onRunDFS={handleRunDFS}
          onFindArticulationPoints={handleFindArticulationPoints}
          onClearGraph={handleClearGraph}
          onGenerateSample={handleGenerateSample}
          selectedNode={selectedNode}
          nodes={nodes}
          edges={edges}
          componentColors={componentColors}
          traversalAlgorithm={traversalAlgorithm}
          playbackActive={playbackActive}
          isPlaying={isPlaying}
          currentStep={currentStep}
          totalSteps={traversalSequence.length}
          playbackSpeed={playbackSpeed}
          onPlaybackPlay={handlePlaybackPlay}
          onPlaybackPause={handlePlaybackPause}
          onPlaybackStepForward={handlePlaybackStepForward}
          onPlaybackStepBackward={handlePlaybackStepBackward}
          onPlaybackReset={handlePlaybackReset}
          onPlaybackClose={handlePlaybackClose}
          onSpeedChange={setPlaybackSpeed}
          isDirected={isDirected}
          onToggleDirected={() => setIsDirected(!isDirected)}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        {/* Graph Canvas */}
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onAddNode={handleAddNode}
          onAddEdge={handleAddEdge}
          onNodePositionChange={handleNodePositionChange}
          selectedNode={selectedNode}
          articulationPoints={articulationPoints}
          flashingNodes={flashingNodes}
          traversalNodes={traversalNodes}
          mode={mode}
          isDirected={isDirected}
        />
        
        {/* Info Button */}
        <button
          onClick={() => setInfoModalOpen(true)}
          className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-xl transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95 z-10"
          title="Learn about Graph Theory & Algorithms"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Know Graph Theory
        </button>

        {/* Mode indicator */}
        <div className="absolute top-16 left-4 bg-white rounded-lg shadow-lg px-4 py-2 z-10">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Mode:</span>
            <span className="text-sm font-medium text-gray-900 capitalize">
              {mode === 'addNode' && 'Add Node'}
              {mode === 'addEdge' && 'Add Edge'}
              {mode === 'delete' && 'Delete'}
            </span>
          </div>
        </div>

        {/* Selected Node Info - Below Mode Indicator */}
        {selectedNode && (
          <div className="absolute top-36 left-4 bg-white rounded-lg shadow-lg px-4 py-2 z-10">
            <p className="text-sm text-gray-600">Selected Node:</p>
            <p className="text-lg font-bold text-gray-900">
              Node {selectedNode}
            </p>
          </div>
        )}

        {/* Connected Components Legend - Fixed to bottom of canvas area */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-center z-10">
          <div className="w-full max-w-4xl mx-auto px-4 overflow-x-auto">
            <ComponentsLegend componentColors={componentColors} nodes={nodes} edges={edges} />
          </div>
        </div>

        {/* Instructions overlay for add edge mode */}
        {mode === 'addEdge' && !playbackActive && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white rounded-lg shadow-lg px-6 py-3 z-10">
            <p className="text-sm font-medium">Click two nodes to create an edge</p>
          </div>
        )}
      </div>

      {/* Right Panel - Traversal Order, Pseudo Code, and Playback Controls */}
      <div className="h-full flex-shrink-0">
        <TraversalOrder 
          traversalNodes={traversalNodes} 
          nodes={nodes}
          edges={edges}
          isDirected={isDirected}
          algorithm={traversalAlgorithm}
          pseudoCodeStep={pseudoCodeStep}
          showPseudoCode={showPseudoCode}
          traversalSequence={traversalSequence}
          playbackActive={playbackActive}
          isPlaying={isPlaying}
          currentStep={currentStep}
          totalSteps={traversalSequence.length}
          playbackSpeed={playbackSpeed}
          onPlaybackPlay={handlePlaybackPlay}
          onPlaybackPause={handlePlaybackPause}
          onPlaybackStepForward={handlePlaybackStepForward}
          onPlaybackStepBackward={handlePlaybackStepBackward}
          onPlaybackReset={handlePlaybackReset}
          onPlaybackClose={handlePlaybackClose}
          onSpeedChange={setPlaybackSpeed}
          onClose={() => {
            setTraversalNodes([]);
            setShowPseudoCode(false);
          }} 
        />
      </div>

      {/* Info Modal */}
      <InfoModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
    </div>
  );
};

export default App;
