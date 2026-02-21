import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { XR, createXRStore, IfInSessionMode } from '@react-three/xr';
import { useState, useEffect, useCallback } from 'react';
import { ARExperience, type ARControlsState } from '../../components/ARExperience';
import { ARInstructions } from '../../components/ARInstructions';
import { ARControls } from '../../components/ARControls';
import type { ProductConfig } from '../../types';
import { MdRefresh, MdZoomIn, MdZoomOut, MdCameraAlt } from 'react-icons/md';

interface ViewerProps {
  config: ProductConfig;
}

// Create XR store outside component to persist across renders
const store = createXRStore({
  hitTest: true,
  domOverlay: true,
});

export const Viewer = ({ config }: ViewerProps) => {
  const { selectedProduct } = config;
  const [isARSupported, setIsARSupported] = useState(true);
  const [showARInstructions, setShowARInstructions] = useState(false);
  const [isInAR, setIsInAR] = useState(false);
  const [arControls, setARControls] = useState<ARControlsState | null>(null);

  // Check AR support on mount
  useEffect(() => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setIsARSupported(supported);
      }).catch(() => {
        setIsARSupported(false);
      });
    } else {
      setIsARSupported(false);
    }
  }, []);

  // Monitor XR session state
  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      const isActive = state.session !== null;
      setIsInAR(isActive);
      setShowARInstructions(isActive);
    });
    return unsubscribe;
  }, []);

  const handleEnterAR = async () => {
    try {
      await store.enterAR();
    } catch (error) {
      console.error('AR not supported:', error);
      setIsARSupported(false);
      alert('🚫 AR Not Available\n\nPlease use:\n• iPhone/iPad with iOS 13+ (Safari)\n• Android phone with ARCore (Chrome)');
    }
  };

  const handleExitAR = () => {
    setShowARInstructions(false);
  };

  const handleARControlsChange = useCallback((controls: ARControlsState) => {
    setARControls(controls);
  }, []);

  return (
    <div className="flex-1 relative bg-gray-100">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }}
        shadows
      >
        <XR store={store}>
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
        
        
        <ARExperience config={config} onARControlsChange={handleARControlsChange} />
        
        <IfInSessionMode deny="immersive-ar">
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
        </IfInSessionMode>
        </XR>
      </Canvas>

      {/* AR Instructions Overlay */}
      {showARInstructions && (
        <ARInstructions onClose={handleExitAR} isVisible={isInAR} />
      )}

      {/* AR Controls */}
      {arControls && (
        <ARControls
          isPlaced={arControls.isPlaced}
          isInAR={isInAR}
          onRotate={arControls.onRotate}
          onScaleUp={arControls.onScaleUp}
          onScaleDown={arControls.onScaleDown}
          onReset={arControls.onReset}
        />
      )}
      
      {/* Empty State */}
      {!selectedProduct && !isInAR && (
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
      {selectedProduct && !isInAR && (
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
          <button 
            onClick={handleEnterAR}
            className="px-4 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white 
                           rounded-none font-semibold text-sm flex items-center gap-2
                           hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isARSupported}
            title={!isARSupported ? 'AR requires iOS Safari or Android Chrome' : 'View in augmented reality'}
          >
            <MdCameraAlt className="text-lg" />
            {isARSupported ? 'View in AR' : 'AR Not Available'}
          </button>
        </div>
      )}
    </div>
  );
};
