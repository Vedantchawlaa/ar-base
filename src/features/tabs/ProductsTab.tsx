import type { ProductType } from '../../types';
import { MdWindow, MdStraighten, MdSearch } from 'react-icons/md';

interface ProductsTabProps {
  selectedProduct: ProductType;
  onSelectProduct: (product: ProductType) => void;
}

export const ProductsTab = ({ selectedProduct, onSelectProduct }: ProductsTabProps) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Search Box */}
      <div className="relative">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-none text-sm 
                   focus:outline-none focus:border-[#667eea] focus:ring-0
                   transition-all"
        />
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 gap-3">
        <div
          className={`
            flex items-center gap-4 p-4 border-2 rounded-none cursor-pointer
            transition-all duration-200
            ${selectedProduct === 'curtain'
              ? 'border-[#667eea] bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-[#667eea] hover:bg-indigo-50/30 hover:shadow-lg'
            }
          `}
          onClick={() => onSelectProduct('curtain')}
        >
          <div className={`
            w-15 h-15 rounded-none flex items-center justify-center flex-shrink-0
            ${selectedProduct === 'curtain' ? 'bg-white' : 'bg-gray-100'}
          `}>
            <MdWindow className="text-4xl text-gray-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Curtains</h3>
            <p className="text-sm text-gray-600">Elegant fabric drapes</p>
          </div>
        </div>

        <div
          className={`
            flex items-center gap-4 p-4 border-2 rounded-none cursor-pointer
            transition-all duration-200
            ${selectedProduct === 'blind'
              ? 'border-[#667eea] bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-[#667eea] hover:bg-indigo-50/30 hover:shadow-lg'
            }
          `}
          onClick={() => onSelectProduct('blind')}
        >
          <div className={`
            w-15 h-15 rounded-none flex items-center justify-center flex-shrink-0
            ${selectedProduct === 'blind' ? 'bg-white' : 'bg-gray-100'}
          `}>
            <MdStraighten className="text-4xl text-gray-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Blinds</h3>
            <p className="text-sm text-gray-600">Modern window shades</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {selectedProduct && (
        <div className="flex flex-col gap-2 mt-2">
          <button className="w-full py-3 px-5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white 
                           rounded-none font-semibold text-sm shadow-lg shadow-indigo-500/30
                           hover:shadow-xl hover:shadow-indigo-500/40 
                           transition-all duration-200">
            View in AR
          </button>
          <button className="w-full py-3 px-5 bg-white text-[#667eea] border-2 border-[#667eea]
                           rounded-none font-semibold text-sm
                           hover:bg-indigo-50 transition-all duration-200">
            Save Design
          </button>
        </div>
      )}
    </div>
  );
};
