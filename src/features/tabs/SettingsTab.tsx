import { MdPhotoCamera, MdShare, MdDownload } from 'react-icons/md';

interface SettingsTabProps {
  showMeasurements: boolean;
  onToggleMeasurements: () => void;
}

export const SettingsTab = ({ showMeasurements, onToggleMeasurements }: SettingsTabProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
        Display Settings
      </h3>

      {/* Toggle Settings */}
      <div className="space-y-4">
        <ToggleItem
          label="Show Measurements"
          description="Display dimensions on 3D model"
          checked={showMeasurements}
          onChange={onToggleMeasurements}
        />
        <ToggleItem
          label="High Quality"
          description="Better rendering quality"
          checked={true}
          onChange={() => {}}
        />
        <ToggleItem
          label="Auto-rotate"
          description="Automatically rotate model"
          checked={false}
          onChange={() => {}}
        />
      </div>

      <hr className="border-gray-200 my-2" />

      {/* Export Section */}
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
        Export
      </h3>

      <div className="space-y-2">
        <button className="w-full py-3 px-5 bg-white text-[#667eea] border-2 border-[#667eea]
                         rounded-none font-semibold text-sm flex items-center justify-center gap-2
                         hover:bg-indigo-50 transition-all duration-200">
          <MdPhotoCamera className="text-lg" />
          Save Screenshot
        </button>
        <button className="w-full py-3 px-5 bg-white text-[#667eea] border-2 border-[#667eea]
                         rounded-none font-semibold text-sm flex items-center justify-center gap-2
                         hover:bg-indigo-50 transition-all duration-200">
          <MdShare className="text-lg" />
          Share Design
        </button>
        <button className="w-full py-3 px-5 bg-white text-[#667eea] border-2 border-[#667eea]
                         rounded-none font-semibold text-sm flex items-center justify-center gap-2
                         hover:bg-indigo-50 transition-all duration-200">
          <MdDownload className="text-lg" />
          Download Specs
        </button>
      </div>
    </div>
  );
};

// Toggle Component
interface ToggleItemProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

const ToggleItem = ({ label, description, checked, onChange }: ToggleItemProps) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0">
    <div className="flex-1">
      <label className="block text-sm font-semibold text-gray-900 mb-1">
        {label}
      </label>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
    <label className="relative inline-block w-12 h-7 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-full h-full bg-gray-300 rounded-none peer-checked:bg-[#667eea] 
                    transition-colors duration-300"></div>
      <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-none
                    peer-checked:translate-x-5 transition-transform duration-300"></div>
    </label>
  </div>
);
