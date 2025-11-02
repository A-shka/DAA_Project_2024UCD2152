import React from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, FastForward } from 'lucide-react';

const TraversalPlayback = ({
  isActive,
  isPlaying,
  currentStep,
  totalSteps,
  algorithmName,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onReset,
  onClose
}) => {
  if (!isActive) return null;

  const speedOptions = [
    { value: 2000, label: '0.5x' },
    { value: 1000, label: '1x' },
    { value: 500, label: '2x' },
    { value: 250, label: '4x' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t-2 border-blue-500 shadow-2xl z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Algorithm Info */}
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
              {algorithmName}
            </div>
            <div className="text-white">
              <span className="text-sm text-slate-400">Step:</span>
              <span className="ml-2 text-lg font-bold">{currentStep}</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-slate-400">{totalSteps}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-3">
            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200"
              title="Reset"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Previous Step */}
            <button
              onClick={onStepBackward}
              disabled={currentStep === 0}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
              title="Previous Step"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={isPlaying ? onPause : onPlay}
              className={`p-3 rounded-lg transition-all duration-200 ${
                isPlaying
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white shadow-lg`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            {/* Next Step */}
            <button
              onClick={onStepForward}
              disabled={currentStep >= totalSteps}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
              title="Next Step"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Skip to End */}
            <button
              onClick={() => {
                for (let i = currentStep; i < totalSteps; i++) {
                  onStepForward();
                }
              }}
              disabled={currentStep >= totalSteps}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
              title="Skip to End"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-3">
            <FastForward className="w-5 h-5 text-slate-400" />
            <div className="flex gap-1">
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSpeedChange(option.value)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                    speed === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium"
          >
            Close
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TraversalPlayback;
