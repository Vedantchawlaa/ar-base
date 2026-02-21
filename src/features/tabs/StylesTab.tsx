import type { ProductType, CurtainStyle, BlindStyle, TextureType } from '../../types';
import { MdOpacity, MdTexture, MdPalette } from 'react-icons/md';

interface StylesTabProps {
  selectedProduct: ProductType;
  curtainStyle: CurtainStyle;
  blindStyle: BlindStyle;
  opacity: number;
  texture: TextureType;
  onUpdateCurtainStyle: (style: CurtainStyle) => void;
  onUpdateBlindStyle: (style: BlindStyle) => void;
  onUpdateOpacity: (opacity: number) => void;
  onUpdateTexture: (texture: TextureType) => void;
}

const CURTAIN_STYLES: CurtainStyle[] = ['sheer', 'blackout', 'velvet', 'linen'];
const BLIND_STYLES: BlindStyle[] = ['roller', 'venetian', 'vertical', 'roman'];
const TEXTURES: TextureType[] = ['smooth', 'fabric', 'woven'];

export const StylesTab = ({
  selectedProduct,
  curtainStyle,
  blindStyle,
  opacity,
  texture,
  onUpdateCurtainStyle,
  onUpdateBlindStyle,
  onUpdateOpacity,
  onUpdateTexture,
}: StylesTabProps) => {
  if (!selectedProduct) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <MdPalette className="text-5xl mb-4 opacity-20" />
        <p className="text-sm font-medium">Select a product to view styles</p>
      </div>
    );
  }

  const currentStyles = selectedProduct === 'curtain' ? CURTAIN_STYLES : BLIND_STYLES;
  const activeStyle = selectedProduct === 'curtain' ? curtainStyle : blindStyle;

  return (
    <div className="flex flex-col gap-8">
      {/* Style Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-[#667eea]" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em]">
            Material Style
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {currentStyles.map(style => (
            <div
              key={style}
              className={`
                group flex flex-col items-center gap-3 p-4 border-2 rounded-none cursor-pointer
                transition-all duration-300
                ${activeStyle === style
                  ? 'border-[#667eea] bg-indigo-50/50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-lg'
                }
              `}
              onClick={() => selectedProduct === 'curtain' ? onUpdateCurtainStyle(style as CurtainStyle) : onUpdateBlindStyle(style as BlindStyle)}
            >
              <div className={`
                w-full h-20 rounded-none relative overflow-hidden
                ${activeStyle === style
                  ? 'ring-2 ring-indigo-200 ring-offset-2'
                  : ''
                }
              `}>
                <div className={`
                  absolute inset-0 bg-gradient-to-br transition-opacity duration-300
                  ${activeStyle === style
                    ? 'from-[#667eea] to-[#764ba2] opacity-100'
                    : 'from-gray-100 to-gray-200 opacity-80 group-hover:opacity-100'
                  }
                `} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${activeStyle === style ? 'text-white' : 'text-gray-400'}`}>
                    {style}
                  </span>
                </div>
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${activeStyle === style ? 'text-[#667eea]' : 'text-gray-500'}`}>
                {style}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Opacity Slider (Curtains only) */}
      {selectedProduct === 'curtain' && (
        <div className="bg-gray-50 p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MdOpacity className="text-[#667eea] text-lg" />
              <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                Transparency
              </label>
            </div>
            <span className="text-xs font-bold text-[#667eea] bg-white px-2 py-1 border border-indigo-100">
              {Math.round(opacity * 100)}%
            </span>
          </div>
          <div className="relative flex items-center h-10">
            <div className="absolute w-full h-1 bg-gray-200" />
            <div className="absolute h-1 bg-[#667eea]" style={{ width: `${opacity * 100}%` }} />
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={opacity}
              onChange={(e) => onUpdateOpacity(parseFloat(e.target.value))}
              className="w-full absolute opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute w-5 h-5 bg-white border-2 border-[#667eea] shadow-lg pointer-events-none transition-transform duration-200"
              style={{ left: `calc(${opacity * 100}% - 10px)` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Sheer</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Opaque</span>
          </div>
        </div>
      )}

      {/* Texture Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MdTexture className="text-[#667eea] text-lg" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
            Finish & Texture
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TEXTURES.map(t => (
            <button
              key={t}
              className={`
                group relative py-3 px-4 border-2 rounded-none text-[10px] font-bold uppercase tracking-widest
                transition-all duration-300
                ${texture === t
                  ? 'border-[#667eea] bg-[#667eea] text-white shadow-lg'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              `}
              onClick={() => onUpdateTexture(t)}
            >
              {t}
              {texture === t && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

