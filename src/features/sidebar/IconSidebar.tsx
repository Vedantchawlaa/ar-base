import { TABS } from '../../constants/tabs';
import type { ActiveTab } from '../../types';

interface IconSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const IconSidebar = ({ activeTab, onTabChange }: IconSidebarProps) => {
  const handleTabClick = (tabId: string) => {
    const newTab = activeTab === tabId ? null : (tabId as ActiveTab);
    onTabChange(newTab);
  };

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 z-[200] shadow-sm">
      {/* Logo */}
      <div className="w-10 h-10 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-none flex items-center justify-center text-white font-bold text-base mb-6">
        AR
      </div>

      {/* Tab Icons */}
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = isActive ? tab.icon : tab.iconOutlined;
        
        return (
          <button
            key={tab.id}
            className={`
              w-12 h-12 rounded-none flex items-center justify-center mb-2 
              transition-all duration-200 relative
              ${isActive 
                ? 'bg-indigo-50' 
                : 'bg-transparent hover:bg-gray-100'
              }
            `}
            onClick={() => handleTabClick(tab.id)}
            title={tab.label}
            aria-label={tab.label}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#667eea] rounded-none" />
            )}
            
            <Icon 
              className={`
                text-2xl transition-all duration-200
                ${isActive 
                  ? 'text-[#667eea]' 
                  : 'text-gray-400 hover:text-gray-600 hover:scale-110'
                }
              `}
            />
          </button>
        );
      })}
    </div>
  );
};
