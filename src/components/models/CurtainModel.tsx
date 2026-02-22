import { useRef, useMemo } from 'react';
import { Mesh, PlaneGeometry, Vector3 } from 'three';
import { Text } from '@react-three/drei';

type CurtainStyle = 'sheer' | 'blackout' | 'velvet' | 'linen';

interface Dimensions {
  width: number;
  height: number;
  drop: number;
}

interface CurtainModelProps {
  style: CurtainStyle;
  color: string;
  dimensions: Dimensions;
  opacity: number;
  texture?: 'smooth' | 'fabric' | 'woven';
  showMeasurements: boolean;
  openAmount: number;
  panelCount?: number;
}

export default function CurtainModel({ 
  style, 
  color, 
  dimensions, 
  opacity,
  showMeasurements,
  openAmount,
  panelCount = 2,
}: CurtainModelProps) {

  const curtainRefs = useRef<(Mesh | null)[]>([]);

  // ensure array size
  if (curtainRefs.current.length !== panelCount) {
    curtainRefs.current = Array(panelCount).fill(null);
  }

  const scale = useMemo(() => {
    const baseWidth = 2.4;
    const baseHeight = 3;
    return {
      width: (dimensions.width / 150) * baseWidth,
      height: (dimensions.height / 200) * baseHeight,
    };
  }, [dimensions]);

  // Create realistic curtain with natural folds
  const curtainGeometry = useMemo(() => {
    // Style-specific parameters
    let foldCount = 8;
    let foldDepth = 0.1;
    let fabricWeight = 1.0;
    
    if (style === 'sheer') {
      foldCount = 12;
      foldDepth = 0.06;
      fabricWeight = 0.3;
    } else if (style === 'velvet') {
      foldCount = 6;
      foldDepth = 0.14;
      fabricWeight = 1.5;
    } else if (style === 'blackout') {
      foldCount = 7;
      foldDepth = 0.1;
      fabricWeight = 1.2;
    } else if (style === 'linen') {
      foldCount = 9;
      foldDepth = 0.09;
      fabricWeight = 0.8;
    }
    
    const widthSegments = 80;
    const heightSegments = 100;
    const geometry = new PlaneGeometry(1, 1, widthSegments, heightSegments);
    const pos = geometry.getAttribute('position');
    const v = new Vector3();
    
    const gatherIntensity = 1.6 - openAmount * 0.8;
    
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        
        const x = v.x + 0.5; 
        const y = v.y + 0.5;
        
        // Vertical folds
        const foldPhase = x * Math.PI * foldCount;
        const foldWave = Math.sin(foldPhase);
        const secondaryWave = Math.sin(foldPhase * 2.1) * 0.25;
        
        // Top is held by rod
        const topConstraint = y > 0.90 ? Math.pow((1 - y) * 10, 2) : 1;
        
        // Custom pleating for different styles
        let pleatEffect = 0;
        if (style === 'velvet' || style === 'linen') {
          // Double/Triple Pinch Pleat effect near the top
          const pleatWave = Math.abs(Math.sin(foldPhase * 1.5)) * 0.4;
          pleatEffect = pleatWave * (1 - topConstraint);
        }
        
        // Bottom drapes naturally
        const bottomWeight = Math.pow(1 - y, 0.8) * fabricWeight;
        
        const depth = (foldWave + secondaryWave + pleatEffect) * foldDepth * gatherIntensity * topConstraint * (0.3 + bottomWeight * 0.7);
        
        pos.setZ(i, depth);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, [style, openAmount]);

  // Animate gentle breeze removed per request.

  // Material properties based on fabric type
  const getMaterialProps = () => {
    const baseProps = {
      color,
      transparent: true,
      // Avoid double-sided rendering for sheer objects to prevent huge Z-fighting triangles on overlap
      side: (style === 'sheer' ? 0 : 2) as 0 | 1 | 2,
    };

    switch (style) {
      case 'sheer':
        return { 
          ...baseProps, 
          opacity: Math.min(opacity * 0.7, 0.8),
          roughness: 0.25,
          transmission: 0.9,
          thickness: 0.02,
          ior: 1.2,
          sheen: 0.3,
          sheenColor: '#ffffff',
          sheenRoughness: 0.5,
          envMapIntensity: 1.2,
          depthWrite: false,
        };
      case 'blackout':
        return { 
          ...baseProps, 
          opacity: 1, 
          roughness: 0.92,
          metalness: 0,
          sheen: 0.2,
          clearcoat: 0.05,
          clearcoatRoughness: 0.9,
          envMapIntensity: 0.15,
        };
      case 'velvet':
        return { 
          ...baseProps, 
          opacity: 1,
          roughness: 0.85,
          sheen: 1.0, 
          sheenColor: color, 
          sheenRoughness: 0.2,
          clearcoat: 0.1,
          clearcoatRoughness: 0.4,
          envMapIntensity: 0.8,
        };
      case 'linen':
      default:
        return { 
          ...baseProps, 
          opacity: Math.min(opacity, 0.98),
          roughness: 0.9,
          metalness: 0,
          sheen: 0.4,
          sheenRoughness: 0.8,
          envMapIntensity: 0.4,
        };
    }
  };

  // Calculate curtain panel positions
  const fullPanelWidth = scale.width / panelCount;
  
  // Different fabrics gather differently
  let minWidthRatio = 0.18;
  if (style === 'sheer') minWidthRatio = 0.12;
  else if (style === 'velvet') minWidthRatio = 0.28;
  else if (style === 'blackout') minWidthRatio = 0.22;
  else if (style === 'linen') minWidthRatio = 0.16;
  
  const currentWidth = fullPanelWidth * (minWidthRatio + (1 - minWidthRatio) * openAmount);
  
  const dropOffset = dimensions.drop / 100;
  const totalHeight = scale.height + dropOffset;
  const curtainY = -dropOffset / 2;

  const leftCount = Math.ceil(panelCount / 2);

  const panelsData = Array.from({ length: panelCount }).map((_, i) => {
    const isLeft = i < leftCount;
    let xPos = 0;
    const staggerZ = i * 0.005; // Tiny Z offset to distinguish panels
    const panelGap = 0.002; // Tiny gap
    
    if (isLeft) {
      xPos = -scale.width / 2 + (i + 0.5) * currentWidth + (i * panelGap);
    } else {
      const j = panelCount - 1 - i;
      xPos = scale.width / 2 - (j + 0.5) * currentWidth - (j * panelGap);
    }
    return { id: i, x: xPos, z: staggerZ, isLeft };
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Curtain Rod */}
      <mesh position={[0, scale.height / 2 + 0.08, 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, scale.width + 0.4, 32]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.75} roughness={0.2} /> 
      </mesh>

      {/* Rod End Caps */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (scale.width + 0.4) / 2, scale.height / 2 + 0.08, 0.05]}>
          {/* Bracket */}
          <mesh position={[0, 0, -0.03]} castShadow>
            <boxGeometry args={[0.04, 0.05, 0.04]} />
            <meshStandardMaterial color="#a8a8a8" metalness={0.6} roughness={0.3} /> 
          </mesh>
          {/* Finial */}
          <mesh position={[side * 0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.022, 0.018, 0.05, 16]} />
            <meshStandardMaterial color="#b8b8b8" metalness={0.7} roughness={0.25} /> 
          </mesh>
        </group>
      ))}

      {/* Curtain Rings/Hooks */}
      {Array.from({ length: Math.floor(scale.width * 6) }).map((_, i) => {
        const ringSpacing = scale.width / Math.floor(scale.width * 6);
        const xPos = -scale.width / 2 + i * ringSpacing + ringSpacing / 2;
        return (
          <mesh 
            key={i}
            position={[xPos, scale.height / 2 + 0.1, 0.05]} 
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.01, 0.003, 8, 12]} />
            <meshStandardMaterial color="#d0d0d0" metalness={0.85} roughness={0.15} />
          </mesh>
        );
      })}

      {/* Curtain Panels */}
      {panelsData.map((panel, i) => (
        <mesh 
          key={panel.id}
          ref={(el) => { if (el) curtainRefs.current[i] = el; }}
          position={[panel.x, curtainY, 0.05 + panel.z]}
          scale={[currentWidth, totalHeight, 1]}
          geometry={curtainGeometry}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial {...getMaterialProps()} />
        </mesh>
      ))}

      {/* Window Frame */}
      <group position={[0, 0, -0.05]}>
        {/* Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[scale.width + 0.15, scale.height + 0.15, 0.06]} />
          <meshStandardMaterial color="#f8f8f8" roughness={0.5} />
        </mesh>
        {/* Glass */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[scale.width, scale.height]} />
          <meshPhysicalMaterial 
            color="#dce8f5" 
            transmission={0.88} 
            transparent 
            opacity={0.5} 
            roughness={0.08} 
            ior={1.5}
            thickness={0.5}
          />
        </mesh>
      </group>

      {/* Measurements */}
      {showMeasurements && (
        <>
          <Text
            position={[0, scale.height / 2 + 0.3, 0]}
            fontSize={0.12}
            color="#ffffff"
            outlineWidth={0.012}
            outlineColor="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round(dimensions.width)} cm
          </Text>
          <Text
            position={[scale.width / 2 + 0.3, 0, 0]}
            fontSize={0.12}
            color="#ffffff"
            outlineWidth={0.012}
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
