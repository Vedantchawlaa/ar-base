import type { IconType } from 'react-icons';

export type ProductType = 'curtain' | 'blind' | null;
export type CurtainStyle = 'sheer' | 'blackout' | 'velvet' | 'linen';
export type BlindStyle = 'roller' | 'venetian' | 'vertical' | 'roman';
export type MountType = 'inside' | 'outside';
export type TextureType = 'smooth' | 'fabric' | 'woven';
export type ActiveTab = 'products' | 'styles' | 'dimensions' | 'colors' | 'settings' | null;

export interface Dimensions {
  width: number;
  height: number;
  drop: number;
}

export interface ProductConfig {
  selectedProduct: ProductType;
  curtainStyle: CurtainStyle;
  blindStyle: BlindStyle;
  color: string;
  dimensions: Dimensions;
  mountType: MountType;
  opacity: number;
  texture: TextureType;
  showMeasurements: boolean;
}

export interface TabConfig {
  id: string;
  icon: IconType;
  iconOutlined: IconType;
  label: string;
}
