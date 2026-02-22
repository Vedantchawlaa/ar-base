import type { ProductType, Dimensions, MountType, CurtainStyle, BlindStyle, ShadeStyle, DrapeStyle } from '../../types';
import { calculatePrice, calculateArea } from '../../utils/priceCalculator';
import { MdAspectRatio, MdHeight, MdCompareArrows, MdInfoOutline, MdEuroSymbol, MdSettingsInputComposite } from 'react-icons/md';

interface DimensionsTabProps {
  selectedProduct: ProductType;
  dimensions: Dimensions;
  mountType: MountType;
  curtainStyle: CurtainStyle;
  blindStyle: BlindStyle;
  shadeStyle: ShadeStyle;
  drapeStyle: DrapeStyle;
  onUpdateDimensions: (dimensions: Partial<Dimensions>) => void;
  onUpdateMountType: (mountType: MountType) => void;
}

export const DimensionsTab = ({
  selectedProduct,
  dimensions,
  mountType,
  curtainStyle,
  blindStyle,
  shadeStyle,
  drapeStyle,
  onUpdateDimensions,
  onUpdateMountType,
}: DimensionsTabProps) => {
  if (!selectedProduct) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <MdSettingsInputComposite className="text-5xl mb-4 opacity-20" />
        <p className="text-sm font-medium">Select a product to set dimensions</p>
      </div>
    );
  }

  const getActiveStyle = () => {
    switch(selectedProduct) {
      case 'curtain': return curtainStyle;
      case 'blind': return blindStyle;
      case 'shade': return shadeStyle;
      case 'drape': return drapeStyle;
      default: return '';
    }
  };

  const style = getActiveStyle();
  const price = calculatePrice(selectedProduct, style as any, dimensions);
  const area = calculateArea(dimensions);

  return (
    <div className="flex flex-col gap-8">
      {/* Configuration Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-[#667eea]" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em]">
            Window Size
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* Width Input */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <MdCompareArrows className="text-gray-400 text-lg group-focus-within:text-[#667eea] transition-colors rotate-90" />
            </div>
            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-[#667eea]">
              Width (cm)
            </label>
            <input
              type="number"
              value={dimensions.width}
              onChange={(e) => onUpdateDimensions({ width: parseInt(e.target.value) || 0 })}
              min="50"
              max="400"
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-100 rounded-none text-sm font-bold
                       focus:outline-none focus:border-[#667eea] focus:ring-0
                       transition-all shadow-sm"
            />
          </div>

          {/* Height Input */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <MdHeight className="text-gray-400 text-lg group-focus-within:text-[#667eea] transition-colors" />
            </div>
            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-[#667eea]">
              Height (cm)
            </label>
            <input
              type="number"
              value={dimensions.height}
              onChange={(e) => onUpdateDimensions({ height: parseInt(e.target.value) || 0 })}
              min="50"
              max="400"
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-100 rounded-none text-sm font-bold
                       focus:outline-none focus:border-[#667eea] focus:ring-0
                       transition-all shadow-sm"
            />
          </div>

          {/* Drop Input (Curtains & Drapes) */}
          {(selectedProduct === 'curtain' || selectedProduct === 'drape') && (
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MdAspectRatio className="text-gray-400 text-lg group-focus-within:text-[#667eea] transition-colors" />
              </div>
              <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-[#667eea]">
                Floor Drop (cm)
              </label>
              <input
                type="number"
                value={dimensions.drop}
                onChange={(e) => onUpdateDimensions({ drop: parseInt(e.target.value) || 0 })}
                min="0"
                max="50"
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-100 rounded-none text-sm font-bold
                         focus:outline-none focus:border-[#667eea] focus:ring-0
                         transition-all shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mount Type */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MdInfoOutline className="text-[#667eea] text-lg" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
            Installation
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(['inside', 'outside'] as MountType[]).map((type) => (
            <button
              key={type}
              className={`
                group relative py-3.5 px-4 border-2 rounded-none text-[10px] font-bold uppercase tracking-widest
                transition-all duration-300
                ${mountType === type
                  ? 'border-[#667eea] bg-[#667eea] text-white shadow-lg'
                  : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:text-gray-600'
                }
              `}
              onClick={() => onUpdateMountType(type)}
            >
              {type} Frame
              {mountType === type && (
                <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Summary / Price Box */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-none p-6 mt-4 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        
        <div className="flex justify-between items-center py-2 text-[10px] text-gray-400 border-b border-gray-700 uppercase tracking-widest font-bold">
          <span className="flex items-center gap-2">
            <MdAspectRatio /> Total Area
          </span>
          <span className="text-gray-200">{area.toFixed(2)} m²</span>
        </div>
        
        <div className="flex justify-between items-center pt-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">
              Final Quote
            </span>
            <div className="flex items-center gap-1">
              <MdEuroSymbol className="text-white opacity-50" />
              <strong className="text-white text-3xl font-black tracking-tighter">
                {price}
              </strong>
            </div>
          </div>
          <button className="bg-[#667eea] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 hover:bg-indigo-400 transition-colors">
            Order
          </button>
        </div>
      </div>
    </div>
  );
};


