import { useState, useCallback, useEffect, useRef } from 'react';
import { IconSidebar } from '../features/sidebar/IconSidebar';
import { ContentPanel } from '../features/panel/ContentPanel';
import { Viewer } from '../features/viewer/Viewer';
import { useProductConfig } from '../hooks/useProductConfig';
import type { ActiveTab } from '../types';
import { MdCheckCircle, MdInfo } from 'react-icons/md';

export default function ARDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const viewerRef = useRef<{ enterAR: () => void }>(null);
  
  const {
    config,
    updateProduct,
    updateCurtainStyle,
    updateBlindStyle,
    updateColor,
    updateDimensions,
    updateMountType,
    updateOpacity,
    updateTexture,
    toggleMeasurements,
  } = useProductConfig();

  const showNotification = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClosePanel = () => setActiveTab(null);

  const handleUpdateProduct = (product: any) => {
    updateProduct(product);
    showNotification(`Switched to ${product === 'curtain' ? 'Curtains' : 'Blinds'}`, 'info');
  };

  const handleEnterAR = () => {
    viewerRef.current?.enterAR();
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <IconSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <ContentPanel
        activeTab={activeTab}
        config={config}
        onClose={handleClosePanel}
        onUpdateProduct={handleUpdateProduct}
        onUpdateCurtainStyle={updateCurtainStyle}
        onUpdateBlindStyle={updateBlindStyle}
        onUpdateColor={updateColor}
        onUpdateDimensions={updateDimensions}
        onUpdateMountType={updateMountType}
        onUpdateOpacity={updateOpacity}
        onUpdateTexture={updateTexture}
        onToggleMeasurements={toggleMeasurements}
        onEnterAR={handleEnterAR}
      />
      
      <Viewer ref={viewerRef} config={config} />

      {/* Notifications */}
      {notification && (
        <div className="fixed bottom-10 right-10 z-[500] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-gray-900 text-white px-6 py-4 rounded-none shadow-2xl flex items-center gap-3 border-l-4 border-[#667eea]">
            {notification.type === 'success' ? (
              <MdCheckCircle className="text-[#667eea] text-xl" />
            ) : (
              <MdInfo className="text-blue-400 text-xl" />
            )}
            <span className="text-sm font-bold uppercase tracking-widest">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}


