import { MdRotateRight, MdZoomIn, MdZoomOut, MdRefresh } from 'react-icons/md';

interface ARControlsProps {
  isPlaced: boolean;
  isInAR: boolean;
  onRotate: () => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
  onReset: () => void;
}

export function ARControls({ isPlaced, isInAR, onRotate, onScaleUp, onScaleDown, onReset }: ARControlsProps) {
  if (!isPlaced || !isInAR) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-full shadow-2xl 
                    flex items-center gap-1 border-2 border-gray-200">
        <button 
          onClick={onRotate}
          className="p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          title="Rotate"
        >
          <MdRotateRight className="text-xl text-gray-700" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <button 
          onClick={onScaleUp}
          className="p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          title="Make Bigger"
        >
          <MdZoomIn className="text-xl text-gray-700" />
        </button>
        
        <button 
          onClick={onScaleDown}
          className="p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          title="Make Smaller"
        >
          <MdZoomOut className="text-xl text-gray-700" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <button 
          onClick={onReset}
          className="p-3 rounded-full hover:bg-red-50 active:bg-red-100 transition-colors"
          title="Reset Position"
        >
          <MdRefresh className="text-xl text-red-600" />
        </button>
      </div>
    </div>
  );
}
