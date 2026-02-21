import type { ProductType } from '../../types';
import { COLOR_PRESETS } from '../../constants/colors';
import { MdCheck } from 'react-icons/md';

interface ColorsTabProps {
  selectedProduct: ProductType;
  color: string;
  onUpdateColor: (color: string) => void;
}

export const ColorsTab = ({ selectedProduct, color, onUpdateColor }: ColorsTabProps) => {
  if (!selectedProduct) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        Select a product first
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
        Color Palette
      </h3>

      {/* Color Picker */}
      <div className="flex justify-center mb-4">
        <input
          type="color"
          value={color}
          onChange={(e) => onUpdateColor(e.target.value)}
          className="w-30 h-30 border-3 border-gray-200 rounded-none cursor-pointer
                   hover:border-[#667eea] hover:scale-105 transition-all"
        />
      </div>

      {/* Presets */}
      <div>
        <h4 className="text-sm font-semibold text-gray-500 mb-3">Presets</h4>
        <div className="grid grid-cols-4 gap-3">
          {COLOR_PRESETS.map(c => (
            <button
              key={c.value}
              className={`
                aspect-square rounded-none cursor-pointer transition-all duration-200
                shadow-md hover:scale-110 hover:shadow-lg relative border-2
                ${color === c.value
                  ? 'border-[#667eea] ring-2 ring-[#667eea] ring-offset-2'
                  : 'border-gray-300'
                }
              `}
              style={{ background: c.value }}
              onClick={() => onUpdateColor(c.value)}
              title={c.name}
              aria-label={c.name}
            >
              {color === c.value && (
                <MdCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                  text-white text-xl font-bold drop-shadow-lg" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
