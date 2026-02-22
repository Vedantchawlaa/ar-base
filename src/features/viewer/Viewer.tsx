import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { XR, createXRStore, IfInSessionMode } from '@react-three/xr';
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { ARExperience, type ARControlsState } from '../../components/ARExperience';
import { ARInstructions } from '../../components/ARInstructions';
import { ARControls } from '../../components/ARControls';
import type { ProductConfig } from '../../types';
import { MdRefresh, MdZoomIn, MdZoomOut, MdCameraAlt } from 'react-icons/md';

interface ViewerProps {
  config: ProductConfig;
  onUpdateOpenness: (amount: number) => void;
}


// Create XR store outside component to persist across renders
const store = createXRStore({
  hitTest: true,
  domOverlay: true,
});

export const Viewer = forwardRef<{ enterAR: () => void }, ViewerProps>(({ config, onUpdateOpenness }, ref) => {

  const { selectedProduct } = config;
  const [isARSupported, setIsARSupported] = useState(true);
  const [showARInstructions, setShowARInstructions] = useState(false);
  const [isInAR, setIsInAR] = useState(false);
  const [arControls, setARControls] = useState<ARControlsState | null>(null);

  useImperativeHandle(ref, () => ({
    enterAR: handleEnterAR
  }));

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
    <div className="flex-1 relative bg-gray-50">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }}
        shadows
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <XR store={store}>
          <color attach="background" args={['#fafafa']} />
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1.2} 
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <spotLight position={[-5, 5, 2]} intensity={0.5} angle={0.3} penumbra={1} />
          <Environment preset="apartment" />
        
        
        <ARExperience config={config} onARControlsChange={handleARControlsChange} />
        
        <IfInSessionMode deny="immersive-ar">
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.3} 
            scale={12} 
            blur={2.5} 
            far={5}
          />
          
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={3}
            maxDistance={12}
            makeDefault
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
          openAmount={config.openAmount}
          onRotate={arControls.onRotate}
          onScaleUp={arControls.onScaleUp}
          onScaleDown={arControls.onScaleDown}
          onReset={arControls.onReset}
          onUpdateOpenness={onUpdateOpenness}
        />

      )}

      {/* Toolbar */}
      {selectedProduct && !isInAR && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 
                      bg-white/90 backdrop-blur-xl px-2 py-2 rounded-none border border-gray-100
                      shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-1">
          <ToolbarButton icon={<MdRefresh />} title="Reset View" />
          <ToolbarButton icon={<MdZoomIn />} title="Zoom In" />
          <ToolbarButton icon={<MdZoomOut />} title="Zoom Out" />
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button 
            onClick={handleEnterAR}
            className="px-6 py-3 bg-gray-900 text-white 
                           rounded-none font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3
                           hover:bg-[#667eea] transition-all duration-300 disabled:opacity-50"
            disabled={!isARSupported}
          >
            <MdCameraAlt className="text-lg" />
            {isARSupported ? 'Initiate AR' : 'AR Unavailable'}
          </button>
        </div>
      )}
    </div>
  );
});

const ToolbarButton = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300" title={title}>
    <span className="text-xl">{icon}</span>
  </button>
);

