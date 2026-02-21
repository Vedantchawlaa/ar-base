import { MdClose } from 'react-icons/md';

interface ARInstructionsProps {
  onClose: () => void;
  isVisible: boolean;
}

export function ARInstructions({ onClose, isVisible }: ARInstructionsProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top instruction banner */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="bg-black/80 backdrop-blur-md text-white px-6 py-4 rounded-2xl 
                      shadow-2xl max-w-sm text-center">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-lg font-semibold mb-1">📱 Point at a wall</p>
              <p className="text-sm opacity-90">Tap anywhere to place your product</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom tips */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-full shadow-lg">
          <p className="text-sm text-gray-700 font-medium">
            💡 Move closer or further to adjust size
          </p>
        </div>
      </div>
    </div>
  );
}
