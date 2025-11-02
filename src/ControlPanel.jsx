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
  onSpeedChange
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

      {/* Instructions */}
      <div className="mb-6 p-4 bg-slate-700 rounded-lg border-l-4 border-blue-500">
        <h3 className="text-white font-semibold mb-2 text-sm">Quick Instructions</h3>
        <ul className="text-slate-300 text-xs space-y-1">
          <li>• Click canvas to add nodes</li>
          <li>• Click two nodes to add edge</li>
          <li>• Click nodes/edges to delete</li>
          <li>• Drag nodes to reposition</li>
          <li>• Red dots = Articulation points</li>
        </ul>
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

      {/* Playback Controls */}
      {playbackActive && (
        <div className="mb-6 bg-slate-700 rounded-lg p-4 border-2 border-blue-500">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-sm">Playback Controls</h2>
            <button
              onClick={onPlaybackClose}
              className="text-slate-400 hover:text-white transition-colors"
              title="Close Playback"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Step: {currentStep}</span>
              <span>Total: {totalSteps}</span>
            </div>
            <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-300"
                style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-5 gap-1 mb-3">
            <button
              onClick={onPlaybackReset}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
              title="Reset"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={onPlaybackStepBackward}
              disabled={currentStep === 0}
              className="p-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={isPlaying ? onPlaybackPause : onPlaybackPlay}
              className={`p-2 rounded transition-colors ${
                isPlaying ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
              } text-white`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={onPlaybackStepForward}
              disabled={currentStep >= totalSteps}
              className="p-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded transition-colors"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                for (let i = currentStep; i < totalSteps; i++) {
                  onPlaybackStepForward();
                }
              }}
              disabled={currentStep >= totalSteps}
              className="p-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded transition-colors"
              title="End"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <FastForward className="w-3 h-3" />
                Speed
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { value: 2000, label: '0.5x' },
                { value: 1000, label: '1x' },
                { value: 500, label: '2x' },
                { value: 250, label: '4x' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSpeedChange(option.value)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    playbackSpeed === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
