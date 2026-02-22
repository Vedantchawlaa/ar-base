import { useState } from 'react';
import type { ProductType } from '../../types';
import { MdWindow, MdStraighten, MdSearch, MdWaves, MdGrid4X4 } from 'react-icons/md';

interface ProductsTabProps {
  selectedProduct: ProductType;
  onSelectProduct: (product: ProductType) => void;
  onEnterAR: () => void;
}

export const ProductsTab = ({ selectedProduct, onSelectProduct, onEnterAR }: ProductsTabProps) => {

  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    {
      id: 'curtain' as ProductType,
      name: 'Curtains',
      description: 'Elegant fabric drapes',
      icon: MdWindow,
    },
    {
      id: 'blind' as ProductType,
      name: 'Blinds',
      description: 'Modern window shades',
      icon: MdStraighten,
    },
    {
      id: 'shade' as ProductType,
      name: 'Shades',
      description: 'Sleek & functional',
      icon: MdGrid4X4,
    },
    {
      id: 'drape' as ProductType,
      name: 'Drapes',
      description: 'Premium luxury covers',
      icon: MdWaves,
    },
  ];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Search Box */}
      <div className="relative">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-none text-sm 
                   focus:outline-none focus:border-[#667eea] focus:ring-0
                   transition-all"
        />
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 gap-3">
        {filteredProducts.map((product) => {
          const Icon = product.icon;
          return (
            <div
              key={product.id}
              className={`
                flex items-center gap-4 p-4 border-2 rounded-none cursor-pointer
                transition-all duration-200
                ${selectedProduct === product.id
                  ? 'border-[#667eea] bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-[#667eea] hover:bg-indigo-50/30 hover:shadow-lg'
                }
              `}
              onClick={() => onSelectProduct(product.id)}
            >
              <div className={`
                w-15 h-15 rounded-none flex items-center justify-center flex-shrink-0
                ${selectedProduct === product.id ? 'bg-white' : 'bg-gray-100'}
              `}>
                <Icon className="text-4xl text-gray-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </div>
          );
        })}
        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p className="text-sm">No products found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {selectedProduct && (
        <div className="flex flex-col gap-2 mt-2">
          <button 
            onClick={onEnterAR}
            className="w-full py-3 px-5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white 
                           rounded-none font-semibold text-sm shadow-lg shadow-indigo-500/30
                           hover:shadow-xl hover:shadow-indigo-500/40 
                           transition-all duration-200"
          >
            Initiate AR
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

