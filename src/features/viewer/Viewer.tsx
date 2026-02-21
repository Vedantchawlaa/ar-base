import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import CurtainModel from '../../components/CurtainModel';
import BlindModel from '../../components/BlindModel';
import type { ProductConfig } from '../../types';
import { MdRefresh, MdZoomIn, MdZoomOut, MdCameraAlt } from 'react-icons/md';

interface ViewerProps {
  config: ProductConfig;
}

export const Viewer = ({ config }: ViewerProps) => {
  const { selectedProduct, curtainStyle, blindStyle, color, dimensions, opacity, texture, showMeasurements } = config;

  return (
    <div className="flex-1 relative bg-gray-100">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }}
        shadows
      >
        <color attach="background" args={['#f5f5f5']} />
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <spotLight position={[-5, 5, 2]} intensity={0.3} angle={0.3} penumbra={1} />
        <Environment preset="city" />
        
        {selectedProduct === 'curtain' && (
          <CurtainModel 
            style={curtainStyle} 
            color={color}
            dimensions={dimensions}
            opacity={opacity}
            texture={texture}
            showMeasurements={showMeasurements}
          />
        )}
        
        {selectedProduct === 'blind' && (
          <BlindModel 
            style={blindStyle} 
            color={color}
            dimensions={dimensions}
            texture={texture}
            showMeasurements={showMeasurements}
          />
        )}
        
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2} 
          far={4}
        />
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
      
      {/* Empty State */}
      {!selectedProduct && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none 
                      bg-gradient-to-br from-[#667eea] to-[#764ba2]">
          <div className="text-center text-white">
            <span className="text-8xl block mb-5 animate-bounce">🪟</span>
            <h2 className="text-3xl font-bold mb-3">Start Designing</h2>
            <p className="text-base opacity-90">Select a product from the sidebar to begin</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      {selectedProduct && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 
                      bg-white/95 backdrop-blur-md px-4 py-3 rounded-none border-2 border-gray-200
                      shadow-xl flex items-center gap-2">
          <button className="p-2.5 rounded-none hover:bg-gray-100 transition-colors" title="Reset View">
            <MdRefresh className="text-xl text-gray-700" />
          </button>
          <button className="p-2.5 rounded-none hover:bg-gray-100 transition-colors" title="Zoom In">
            <MdZoomIn className="text-xl text-gray-700" />
          </button>
          <button className="p-2.5 rounded-none hover:bg-gray-100 transition-colors" title="Zoom Out">
            <MdZoomOut className="text-xl text-gray-700" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button className="px-4 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white 
                           rounded-none font-semibold text-sm flex items-center gap-2
                           hover:shadow-lg transition-all">
            <MdCameraAlt className="text-lg" />
            View in AR
          </button>
        </div>
      )}
    </div>
  );
};
