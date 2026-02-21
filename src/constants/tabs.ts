import type { IconType } from 'react-icons';
import { 
  MdWindow, 
  MdOutlineWindow,
  MdPalette,
  MdOutlinePalette,
  MdStraighten,
  MdOutlineStraighten,
  MdColorLens,
  MdOutlineColorLens,
  MdSettings,
  MdOutlineSettings
} from 'react-icons/md';

export interface TabConfig {
  id: string;
  icon: IconType;
  iconOutlined: IconType;
  label: string;
}

export const TABS: TabConfig[] = [
  { 
    id: 'products', 
    icon: MdWindow,
    iconOutlined: MdOutlineWindow,
    label: 'Products' 
  },
  { 
    id: 'styles', 
    icon: MdPalette,
    iconOutlined: MdOutlinePalette,
    label: 'Styles' 
  },
  { 
    id: 'dimensions', 
    icon: MdStraighten,
    iconOutlined: MdOutlineStraighten,
    label: 'Size' 
  },
  { 
    id: 'colors', 
    icon: MdColorLens,
    iconOutlined: MdOutlineColorLens,
    label: 'Colors' 
  },
  { 
    id: 'settings', 
    icon: MdSettings,
    iconOutlined: MdOutlineSettings,
    label: 'Settings' 
  },
];
