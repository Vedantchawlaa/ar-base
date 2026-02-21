import { MdClose, MdPhoneIphone, MdAdsClick } from 'react-icons/md';

interface ARInstructionsProps {
  onClose: () => void;
  isVisible: boolean;
}

export function ARInstructions({ onClose, isVisible }: ARInstructionsProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[400]">
      {/* Top instruction banner - moved to right to avoid overlap with XR buttons */}
      <div className="absolute top-8 right-8 pointer-events-auto animate-in slide-in-from-right-10 duration-500">
        <div className="bg-white/95 backdrop-blur-md text-gray-900 px-6 py-5 rounded-none 
                      shadow-2xl max-w-xs border-l-4 border-[#667eea]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MdPhoneIphone className="text-[#667eea] text-xl" />
                <p className="text-sm font-bold uppercase tracking-widest italic">Setup Guide</p>
              </div>
              <p className="text-base font-bold text-gray-900 mb-1">Point at a wall</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <MdAdsClick className="text-gray-400" />
                <span>Tap anywhere to place product</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-none transition-colors border border-gray-200"
            >
              <MdClose className="text-xl text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom tips */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-auto animate-in fade-in duration-700 delay-500">
        <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-none shadow-2xl border-b-2 border-[#667eea]">
          <p className="text-xs text-white font-bold uppercase tracking-[0.2em]">
            💡 Move closer or further to adjust scale
          </p>
        </div>
      </div>
    </div>
  );
}

