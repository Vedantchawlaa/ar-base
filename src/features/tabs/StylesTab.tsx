import type { ProductType, CurtainStyle, BlindStyle, TextureType } from '../../types';

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
      <div className="text-center py-10 text-gray-500 text-sm">
        Select a product first
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Style Selection */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          {selectedProduct === 'curtain' ? 'Curtain Styles' : 'Blind Styles'}
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {selectedProduct === 'curtain' ? (
            CURTAIN_STYLES.map(style => (
              <div
                key={style}
                className={`
                  flex flex-col items-center gap-2 p-4 border-2 rounded-none cursor-pointer
                  transition-all duration-200
                  ${curtainStyle === style
                    ? 'border-[#667eea] bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-[#667eea] hover:bg-indigo-50/30'
                  }
                `}
                onClick={() => onUpdateCurtainStyle(style)}
              >
                <div className={`
                  w-full h-15 rounded-none
                  ${curtainStyle === style
                    ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2]'
                    : 'bg-gradient-to-br from-gray-200 to-gray-300'
                  }
                `} />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {style}
                </span>
              </div>
            ))
          ) : (
            BLIND_STYLES.map(style => (
              <div
                key={style}
                className={`
                  flex flex-col items-center gap-2 p-4 border-2 rounded-none cursor-pointer
                  transition-all duration-200
                  ${blindStyle === style
                    ? 'border-[#667eea] bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-[#667eea] hover:bg-indigo-50/30'
                  }
                `}
                onClick={() => onUpdateBlindStyle(style)}
              >
                <div className={`
                  w-full h-15 rounded-none
                  ${blindStyle === style
                    ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2]'
                    : 'bg-gradient-to-br from-gray-200 to-gray-300'
                  }
                `} />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {style}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Opacity Slider (Curtains only) */}
      {selectedProduct === 'curtain' && (
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">
            Opacity
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => onUpdateOpacity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4.5 
                     [&::-webkit-slider-thumb]:h-4.5 [&::-webkit-slider-thumb]:rounded-none
                     [&::-webkit-slider-thumb]:bg-[#667eea] [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-md"
          />
          <span className="text-xs font-semibold text-[#667eea] float-right mt-2">
            {Math.round(opacity * 100)}%
          </span>
        </div>
      )}

      {/* Texture Selection */}
      <div>
        <label className="text-sm font-semibold text-gray-600 block mb-2">
          Texture
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TEXTURES.map(t => (
            <button
              key={t}
              className={`
                py-2.5 px-4 border-2 rounded-none text-sm font-medium
                transition-all duration-200
                ${texture === t
                  ? 'border-[#667eea] bg-[#667eea] text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-[#667eea] hover:bg-indigo-50'
                }
              `}
              onClick={() => onUpdateTexture(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
