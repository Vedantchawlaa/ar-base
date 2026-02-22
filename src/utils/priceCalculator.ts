import type { ProductType, CurtainStyle, BlindStyle, ShadeStyle, DrapeStyle, Dimensions } from '../types';

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

const SHADE_STYLE_MULTIPLIERS: Record<ShadeStyle, number> = {
  honeycomb: 1.5,
  pleated: 1.2,
  solar: 1.4,
  bamboo: 1.1,
};

const DRAPE_STYLE_MULTIPLIERS: Record<DrapeStyle, number> = {
  classic: 2.0,
  modern: 2.2,
  luxury: 3.5,
  minimal: 1.8,
};

export const calculatePrice = (
  productType: ProductType,
  style: CurtainStyle | BlindStyle | ShadeStyle | DrapeStyle,
  dimensions: Dimensions
): number => {
  if (!productType) return 0;

  let basePrice = 50;
  let multiplier = 1;

  switch (productType) {
    case 'curtain':
      basePrice = 50;
      multiplier = CURTAIN_STYLE_MULTIPLIERS[style as CurtainStyle];
      break;
    case 'blind':
      basePrice = 40;
      multiplier = BLIND_STYLE_MULTIPLIERS[style as BlindStyle];
      break;
    case 'shade':
      basePrice = 45;
      multiplier = SHADE_STYLE_MULTIPLIERS[style as ShadeStyle];
      break;
    case 'drape':
      basePrice = 120;
      multiplier = DRAPE_STYLE_MULTIPLIERS[style as DrapeStyle];
      break;
  }
  
  const area = (dimensions.width * (dimensions.height + (dimensions.drop || 0))) / 10000;
  return Math.round(basePrice * multiplier * area);
};

export const calculateArea = (dimensions: Dimensions): number => {
  return (dimensions.width * dimensions.height) / 10000;
};
