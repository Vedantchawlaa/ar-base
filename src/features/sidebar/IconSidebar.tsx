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
    <div className="w-18 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-[200] shadow-xl">
      {/* Logo */}
      <div className="w-12 h-12 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-none flex items-center justify-center text-white font-bold text-lg mb-8 shadow-indigo-200 shadow-lg">
        AR
      </div>

      {/* Tab Icons */}
      <div className="flex flex-col gap-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = isActive ? tab.icon : tab.iconOutlined;
          
          return (
            <div key={tab.id} className="group relative flex items-center">
              <button
                className={`
                  w-14 h-14 rounded-none flex flex-col items-center justify-center
                  transition-all duration-300 relative
                  ${isActive 
                    ? 'bg-indigo-50 border-r-4 border-[#667eea]' 
                    : 'bg-transparent hover:bg-gray-50'
                  }
                `}
                onClick={() => handleTabClick(tab.id)}
                aria-label={tab.label}
              >
                <Icon 
                  className={`
                    text-2xl transition-all duration-300
                    ${isActive 
                      ? 'text-[#667eea]' 
                      : 'text-gray-400 group-hover:text-[#667eea] group-hover:scale-110'
                    }
                  `}
                />
                <span className={`
                  text-[10px] mt-1 font-semibold uppercase tracking-tighter
                  ${isActive ? 'text-[#667eea]' : 'text-gray-400 group-hover:text-gray-600'}
                `}>
                  {tab.label}
                </span>
              </button>

              {/* Tooltip on Hover (for mobile/small screens if labels aren't enough) */}
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold
                            rounded-none opacity-0 group-hover:opacity-100 pointer-events-none
                            transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0
                            whitespace-nowrap z-[300] shadow-xl">
                {tab.label}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

