import { MdRotateRight, MdZoomIn, MdZoomOut, MdRefresh, MdSwapHoriz } from 'react-icons/md';

interface ARControlsProps {
  isPlaced: boolean;
  isInAR: boolean;
  openAmount: number;
  onRotate: () => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
  onReset: () => void;
  onUpdateOpenness: (amount: number) => void;
}

export function ARControls({ 
  isPlaced, 
  isInAR, 
  openAmount,
  onRotate, 
  onScaleUp, 
  onScaleDown, 
  onReset,
  onUpdateOpenness 
}: ARControlsProps) {
  if (!isPlaced || !isInAR) return null;

  const handleToggleOpen = () => {
    // Basic toggle if we're in AR and don't want a full slider
    onUpdateOpenness(openAmount > 0.5 ? 0 : 1);
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] pointer-events-auto">
      <div className="bg-white/90 backdrop-blur-2xl px-4 py-3 rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.3)] 
                    flex items-center gap-3 border border-white/20">
        
        {/* Toggle Open/Close */}
        <button 
          onClick={handleToggleOpen}
          className={`p-4 rounded-none transition-all duration-300 flex flex-col items-center gap-1
                     ${openAmount > 0.5 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          title={openAmount > 0.5 ? 'Open' : 'Close'}
        >
          <MdSwapHoriz className="text-2xl" />
          <span className="text-[8px] font-black uppercase tracking-tighter">
            {openAmount > 0.5 ? 'Open' : 'Close'}
          </span>
        </button>

        <div className="w-px h-10 bg-gray-200/50 mx-1" />

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={onRotate}
            className="p-4 bg-white/50 hover:bg-white text-gray-800 rounded-none transition-all duration-300 border border-gray-100 flex flex-col items-center gap-1"
            title="Rotate"
          >
            <MdRotateRight className="text-2xl" />
            <span className="text-[8px] font-black uppercase tracking-tighter">Rotate</span>
          </button>
          
          <button 
            onClick={onReset}
            className="p-4 bg-red-50/80 hover:bg-red-500 hover:text-white text-red-600 rounded-none transition-all duration-300 border border-red-100 flex flex-col items-center gap-1"
            title="Relocate"
          >
            <MdRefresh className="text-2xl" />
            <span className="text-[8px] font-black uppercase tracking-tighter">Relocate</span>
          </button>
        </div>

        <div className="w-px h-10 bg-gray-200/50 mx-1" />

        <div className="flex flex-col gap-2">
          <button 
            onClick={onScaleUp}
            className="p-3 bg-white/50 hover:bg-white text-gray-800 rounded-none transition-all duration-300 border border-gray-100"
            title="Bigger"
          >
            <MdZoomIn className="text-xl" />
          </button>
          
          <button 
            onClick={onScaleDown}
            className="p-3 bg-white/50 hover:bg-white text-gray-800 rounded-none transition-all duration-300 border border-gray-100"
            title="Smaller"
          >
            <MdZoomOut className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

