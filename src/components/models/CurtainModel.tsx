import { useRef, useMemo } from 'react';
import { Mesh, PlaneGeometry, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

type CurtainStyle = 'sheer' | 'blackout' | 'velvet' | 'linen';

interface Dimensions {
  width: number;
  height: number;
  drop: number; // additional height in cm (if positive, sweeps floor)
}

interface CurtainModelProps {
  style: CurtainStyle;
  color: string;
  dimensions: Dimensions;
  opacity: number;
  texture?: 'smooth' | 'fabric' | 'woven';
  showMeasurements: boolean;
  openAmount: number; // 0 (open/bunched aside) to 1 (closed/drawn)
}

export default function CurtainModel({ 
  style, 
  color, 
  dimensions, 
  opacity,
  showMeasurements,
  openAmount 
}: CurtainModelProps) {

  const leftCurtainRef = useRef<Mesh>(null);
  const rightCurtainRef = useRef<Mesh>(null);

  const scale = useMemo(() => {
    const baseWidth = 2.4;
    const baseHeight = 3;
    return {
      width: (dimensions.width / 150) * baseWidth,
      height: (dimensions.height / 200) * baseHeight,
    };
  }, [dimensions]);

  const curtainGeometry = useMemo(() => {
    // Ultra-high definition geometry for fine, elegant sheer folds
    const geometry = new PlaneGeometry(1, 1, 256, 64);
    const posAttribute = geometry.getAttribute('position');
    const v = new Vector3();
    
    // Sheer-focused fold parameters (lots of fine delicate folds)
    let numFolds = 18; 
    let foldDepth = 0.035;

    // Adjust geometry parameters if other styles are selected, but default to sheer look
    if (style === 'velvet') {
      numFolds = 8;
      foldDepth = 0.08;
    } else if (style === 'blackout') {
      numFolds = 10;
      foldDepth = 0.06;
    } else if (style === 'linen') {
      numFolds = 14;
      foldDepth = 0.05;
    }
    
    for (let i = 0; i < posAttribute.count; i++) {
      v.fromBufferAttribute(posAttribute, i);
      
      const normalizedX = v.x + 0.5; // 0 to 1
      const yFalloff = v.y + 0.5; // 0 at bottom, 1 at top
      
      // When closed (openAmount 1), folds spread gracefully.
      // When open (openAmount 0), folds gather deeply.
      const depthMultiplier = 1 + (1 - openAmount) * 2.0;
      
      // We create a very fine, organic sine wave for the sheer effect
      // By adding secondary fine noise/waves at the bottom, sheer fabric looks lighter
      const phase = normalizedX * Math.PI * 2 * numFolds;
      
      // Primary wave
      let shape = Math.sin(phase);
      
      // Secondary micro-ruffles at the base for sheer drape
      if (style === 'sheer') {
         const microRuffle = Math.cos(normalizedX * Math.PI * 2 * numFolds * 3) * 0.15 * (1 - yFalloff);
         shape += microRuffle;
      }
      
      // Pinch pleat tension: held flat at the rod, billowing at the bottom
      const compression = yFalloff > 0.9 ? (1 - yFalloff) * 10 : 1; 
      
      // Bottom flare (billowing out)
      const flare = style === 'sheer' ? 1.0 + (1 - yFalloff) * 0.5 : 1.0;
      
      const zDepth = shape * (foldDepth * depthMultiplier) * compression * flare;
      
      posAttribute.setZ(i, zDepth);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, [style, openAmount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (leftCurtainRef.current && rightCurtainRef.current) {
      // Sheer curtains catch significant breeze
      const breezeStrength = style === 'sheer' ? 0.035 : 0.01;
      // Complex organic breeze formula
      const breeze = (Math.sin(time * 0.6) + Math.cos(time * 1.3) * 0.5) * breezeStrength;
      
      // Apply breeze scaling with how open the curtain is
      leftCurtainRef.current.position.z = breeze * openAmount + 0.04;
      rightCurtainRef.current.position.z = -breeze * openAmount + 0.04;
    }
  });

  const getMaterialProps = () => {
    // Specifically tailored realistic physical properties
    const baseProps = {
      color,
      transparent: true,
      side: 2 as const,
    };

    switch (style) {
      case 'sheer':
        return { 
          ...baseProps, 
          opacity: opacity * 0.45,       // high transparency
          roughness: 0.4,               // soft scattered light
          transmission: 0.95,           // mostly passes light through like real voile/sheer
          thickness: 0.01,              // very thin
          ior: 1.1,                     // low refraction for fabric
          clearcoat: 0.1,               // slight synthetic gleam
          clearcoatRoughness: 0.8
        };
      case 'blackout':
        return { 
          ...baseProps, 
          opacity: 1, 
          roughness: 0.9,
          metalness: 0.1,
        };
      case 'velvet':
        return { 
          ...baseProps, 
          opacity: 1,
          roughness: 0.7,
          metalness: 0.2, 
          sheen: 1, 
          sheenColor: '#ffffff', 
          sheenRoughness: 0.4
        };
      case 'linen':
      default:
        return { 
          ...baseProps, 
          opacity: opacity > 0.9 ? 1 : opacity,
          roughness: 0.9,
          metalness: 0,
        };
    }
  };

  const curtainWidth = scale.width / 2;
  // Sheer fabrics bundle extremely tightly when open due to thinness
  const minWidthRatio = style === 'sheer' ? 0.15 : 0.25; 
  const currentWidth = curtainWidth * (minWidthRatio + (1 - minWidthRatio) * openAmount);
  
  const leftX = -scale.width / 2 + currentWidth / 2 + (curtainWidth - currentWidth) * openAmount;
  const rightX = -leftX;

  const totalHeight = scale.height + (dimensions.drop / 100);

  return (
    <group position={[0, 0, 0]}>
      {/* Delicate Modern Rod for Sheer */}
      <mesh position={[0, totalHeight / 2 + 0.04, 0.04]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, scale.width + 0.6, 32]} />
        <meshStandardMaterial color="#eeeeee" metalness={0.9} roughness={0.1} /> 
      </mesh>

      {/* Modern Minimalist Finials */}
      <mesh position={[-(scale.width + 0.6) / 2, totalHeight / 2 + 0.04, 0.04]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 0.04, 32]} />
        <meshStandardMaterial color="#dddddd" metalness={0.9} roughness={0.1} /> 
      </mesh>
      <mesh position={[(scale.width + 0.6) / 2, totalHeight / 2 + 0.04, 0.04]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 0.04, 32]} />
        <meshStandardMaterial color="#dddddd" metalness={0.9} roughness={0.1} /> 
      </mesh>

      {/* Left Panel */}
      <mesh 
        ref={leftCurtainRef} 
        position={[leftX, 0, 0.04]}
        scale={[currentWidth, totalHeight, 1]}
        geometry={curtainGeometry}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial {...getMaterialProps()} />
      </mesh>

      {/* Right Panel */}
      <mesh 
        ref={rightCurtainRef} 
        position={[rightX, 0, 0.04]}
        scale={[currentWidth, totalHeight, 1]}
        geometry={curtainGeometry}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial {...getMaterialProps()} />
      </mesh>

      {/* Window System Behind */}
      <group position={[0, 0, -0.1]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[scale.width + 0.15, totalHeight + 0.15, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[scale.width, totalHeight]} />
          {/* A soft glowing daylight effect behind the window to show off sheer transmission */}
          <meshPhysicalMaterial color="#e0f0ff" transmission={0.9} transparent opacity={0.6} roughness={0.1} ior={1.3} emissive="#e0f0ff" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {showMeasurements && (
        <>
          <Text
            position={[0, totalHeight / 2 + 0.3, 0]}
            fontSize={0.15}
            color="#ffffff"
            outlineWidth={0.01}
            outlineColor="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round(dimensions.width)} cm
          </Text>
          <Text
            position={[scale.width / 2 + 0.3, 0, 0]}
            fontSize={0.15}
            color="#ffffff"
            outlineWidth={0.01}
            outlineColor="#000000"
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, -Math.PI / 2]}
          >
            {Math.round(dimensions.height)} cm
          </Text>
        </>
      )}
    </group>
  );
}
