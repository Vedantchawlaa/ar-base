import { useState } from 'react';
import { IconSidebar } from '../features/sidebar/IconSidebar';
import { ContentPanel } from '../features/panel/ContentPanel';
import { Viewer } from '../features/viewer/Viewer';
import { useProductConfig } from '../hooks/useProductConfig';
import type { ActiveTab } from '../types';

export default function ARDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');
  
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

  const handleClosePanel = () => setActiveTab(null);

  return (
    <div className="flex h-screen w-screen bg-gray-100 relative overflow-hidden">
      <IconSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <ContentPanel
        activeTab={activeTab}
        config={config}
        onClose={handleClosePanel}
        onUpdateProduct={updateProduct}
        onUpdateCurtainStyle={updateCurtainStyle}
        onUpdateBlindStyle={updateBlindStyle}
        onUpdateColor={updateColor}
        onUpdateDimensions={updateDimensions}
        onUpdateMountType={updateMountType}
        onUpdateOpacity={updateOpacity}
        onUpdateTexture={updateTexture}
        onToggleMeasurements={toggleMeasurements}
      />
      
      <Viewer config={config} />
    </div>
  );
}
