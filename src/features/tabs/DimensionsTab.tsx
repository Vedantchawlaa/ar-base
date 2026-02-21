import type { ProductType, Dimensions, MountType, CurtainStyle, BlindStyle } from '../../types';
import { calculatePrice, calculateArea } from '../../utils/priceCalculator';

interface DimensionsTabProps {
  selectedProduct: ProductType;
  dimensions: Dimensions;
  mountType: MountType;
  curtainStyle: CurtainStyle;
  blindStyle: BlindStyle;
  onUpdateDimensions: (dimensions: Partial<Dimensions>) => void;
  onUpdateMountType: (mountType: MountType) => void;
}

export const DimensionsTab = ({
  selectedProduct,
  dimensions,
  mountType,
  curtainStyle,
  blindStyle,
  onUpdateDimensions,
  onUpdateMountType,
}: DimensionsTabProps) => {
  if (!selectedProduct) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        Select a product first
      </div>
    );
  }

  const style = selectedProduct === 'curtain' ? curtainStyle : blindStyle;
  const price = calculatePrice(selectedProduct, style, dimensions);
  const area = calculateArea(dimensions);

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
        Dimensions
      </h3>

      {/* Width Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">Width (cm)</label>
        <input
          type="number"
          value={dimensions.width}
          onChange={(e) => onUpdateDimensions({ width: parseInt(e.target.value) || 0 })}
          min="50"
          max="400"
          className="px-3 py-2.5 border-2 border-gray-200 rounded-none text-sm
                   focus:outline-none focus:border-[#667eea] focus:ring-0
                   transition-all"
        />
      </div>

      {/* Height Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-600">Height (cm)</label>
        <input
          type="number"
          value={dimensions.height}
          onChange={(e) => onUpdateDimensions({ height: parseInt(e.target.value) || 0 })}
          min="50"
          max="400"
          className="px-3 py-2.5 border-2 border-gray-200 rounded-none text-sm
                   focus:outline-none focus:border-[#667eea] focus:ring-0
                   transition-all"
        />
      </div>

      {/* Drop Input (Curtains only) */}
      {selectedProduct === 'curtain' && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">Drop (cm)</label>
          <input
            type="number"
            value={dimensions.drop}
            onChange={(e) => onUpdateDimensions({ drop: parseInt(e.target.value) || 0 })}
            min="0"
            max="50"
            className="px-3 py-2.5 border-2 border-gray-200 rounded-none text-sm
                     focus:outline-none focus:border-[#667eea] focus:ring-0
                     transition-all"
          />
        </div>
      )}

      {/* Mount Type */}
      <div>
        <label className="text-sm font-semibold text-gray-600 block mb-2">
          Mount Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            className={`
              py-2.5 px-4 border-2 rounded-none text-sm font-medium
              transition-all duration-200
              ${mountType === 'inside'
                ? 'border-[#667eea] bg-[#667eea] text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-[#667eea] hover:bg-indigo-50'
              }
            `}
            onClick={() => onUpdateMountType('inside')}
          >
            Inside
          </button>
          <button
            className={`
              py-2.5 px-4 border-2 rounded-none text-sm font-medium
              transition-all duration-200
              ${mountType === 'outside'
                ? 'border-[#667eea] bg-[#667eea] text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-[#667eea] hover:bg-indigo-50'
              }
            `}
            onClick={() => onUpdateMountType('outside')}
          >
            Outside
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gray-50 rounded-none p-4 mt-2 border-2 border-gray-200">
        <div className="flex justify-between items-center py-2 text-sm text-gray-600 border-b border-gray-200">
          <span>Area:</span>
          <strong className="text-gray-900 font-semibold">{area.toFixed(2)} m²</strong>
        </div>
        <div className="flex justify-between items-center py-2 text-sm text-gray-600">
          <span>Estimated Price:</span>
          <strong className="text-[#667eea] text-lg font-semibold">${price}</strong>
        </div>
      </div>
    </div>
  );
};
