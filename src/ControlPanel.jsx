import React from 'react';
import { Plus, Trash2, GitBranch, Play, Zap, RotateCcw, Circle, Minus, Pause, SkipBack, ChevronLeft, ChevronRight, SkipForward, FastForward } from 'lucide-react';

const ControlPanel = ({
  mode,
  setMode,
  onRunBFS,
  onRunDFS,
  onFindArticulationPoints,
  onClearGraph,
  onGenerateSample,
  selectedNode,
  nodes,
  componentColors,
  traversalAlgorithm,
  playbackActive,
  isPlaying,
  currentStep,
  totalSteps,
  playbackSpeed,
  onPlaybackPlay,
  onPlaybackPause,
  onPlaybackStepForward,
  onPlaybackStepBackward,
  onPlaybackReset,
  onPlaybackClose,
  onSpeedChange,
  isDirected,
  onToggleDirected
}) => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-y-auto shadow-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <GitBranch className="w-8 h-8 text-blue-400" />
          Graph Visualizer
        </h1>
        <p className="text-slate-400 text-sm">Connected Components & Articulation Points</p>
      </div>

      {/* Quick Instructions */}
      <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">Quick Instructions</h3>
        <ul className="text-xs text-slate-300 space-y-1.5">
          <li>• <span className="font-medium">Add Node:</span> Click anywhere on the canvas</li>
          <li>• <span className="font-medium">Add Edge:</span> Select a node, then click another node</li>
          <li>• <span className="font-medium">Delete:</span> Select a node/edge and press Delete</li>
          <li>• <span className="font-medium">Move Node:</span> Click and drag a node</li>
        </ul>
      </div>

      {/* Graph Type Toggle */}
      <div className="mb-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Graph Type</span>
          <div className="flex items-center">
            <span className={`text-xs mr-2 ${!isDirected ? 'text-blue-400 font-medium' : 'text-slate-400'}`}>Undirected</span>
            <button
              onClick={onToggleDirected}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDirected ? 'bg-blue-600' : 'bg-slate-600'}`}
            >
              <span
                className={`${isDirected ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
            <span className={`text-xs ml-2 ${isDirected ? 'text-blue-400 font-medium' : 'text-slate-400'}`}>Directed</span>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="mb-6">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Circle className="w-4 h-4" />
          Mode
        </h2>
        <div className="space-y-2">
          <button
            onClick={() => setMode('addNode')}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              mode === 'addNode'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Plus className="w-5 h-5" />
            Add Node
          </button>
          <button
            onClick={() => setMode('addEdge')}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              mode === 'addEdge'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Minus className="w-5 h-5 rotate-90" />
            Add Edge
          </button>
          <button
            onClick={() => setMode('delete')}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              mode === 'delete'
                ? 'bg-red-600 text-white shadow-lg scale-105'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </div>

      {/* Graph Algorithms */}
      <div className="mb-6">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Play className="w-4 h-4" />
          Traversal Algorithms
        </h2>
        <div className="space-y-2">
          <button
            onClick={onRunBFS}
            disabled={nodes.length === 0}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run BFS
          </button>
          <button
            onClick={onRunDFS}
            disabled={nodes.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run DFS
          </button>
        </div>
        {traversalAlgorithm && (
          <div className="mt-3 p-3 bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-300">
              <span className="text-green-400 font-semibold">Running:</span> {traversalAlgorithm}
            </p>
          </div>
        )}
      </div>

      {/* Special Features */}
      <div className="mb-6">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Special Features
        </h2>
        <button
          onClick={onFindArticulationPoints}
          disabled={nodes.length === 0}
          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Find Articulation Points
        </button>
      </div>

      {/* Graph Actions */}
      <div className="mb-6">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Graph Actions
        </h2>
        <div className="space-y-2">
          <button
            onClick={onGenerateSample}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <GitBranch className="w-4 h-4" />
            Generate Sample Graph
          </button>
          <button
            onClick={onClearGraph}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Graph
          </button>
        </div>
      </div>

    </div>
  );
};

export default ControlPanel;
