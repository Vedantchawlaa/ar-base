import type { ProductType, CurtainStyle, BlindStyle, Dimensions } from '../types';

const CURTAIN_STYLE_MULTIPLIERS: Record<CurtainStyle, number> = {
  sheer: 1,
  blackout: 1.3,
  velvet: 1.8,
  linen: 1.2,
};

const BLIND_STYLE_MULTIPLIERS: Record<BlindStyle, number> = {
  roller: 1,
  venetian: 1.2,
  vertical: 1.4,
  roman: 1.6,
};

export const calculatePrice = (
  productType: ProductType,
  style: CurtainStyle | BlindStyle,
  dimensions: Dimensions
): number => {
  if (!productType) return 0;

  const basePrice = productType === 'curtain' ? 50 : 40;
  const multiplier = productType === 'curtain'
    ? CURTAIN_STYLE_MULTIPLIERS[style as CurtainStyle]
    : BLIND_STYLE_MULTIPLIERS[style as BlindStyle];
  
  const area = (dimensions.width * dimensions.height) / 10000;
  return Math.round(basePrice * multiplier * area);
};

export const calculateArea = (dimensions: Dimensions): number => {
  return (dimensions.width * dimensions.height) / 10000;
};
