import { useRef, useMemo } from 'react';
import { Mesh, PlaneGeometry, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { DrapeStyle, Dimensions } from '../../types';

interface DrapeModelProps {
  style: DrapeStyle;
  color: string;
  dimensions: Dimensions;
  opacity: number;
  texture?: 'smooth' | 'fabric' | 'woven';
  showMeasurements: boolean;
  openAmount: number; // 0 open to 1 closed
}

export default function DrapeModel({ 
  style, 
  color, 
  dimensions, 
  opacity,
  showMeasurements,
  openAmount 
}: DrapeModelProps) {

  const leftRef = useRef<Mesh>(null);
  const rightRef = useRef<Mesh>(null);

  const scale = useMemo(() => {
    const baseWidth = 2.4;
    const baseHeight = 3.2; 
    return {
      width: (dimensions.width / 150) * baseWidth,
      height: (dimensions.height / 200) * baseHeight,
    };
  }, [dimensions]);

  const drapeGeometry = useMemo(() => {
    // High poly for dramatic folds
    const geometry = new PlaneGeometry(1, 1, 64, 32);
    const pos = geometry.getAttribute('position');
    const v = new Vector3();
    
    let foldFrequency = 10;
    let foldDepth = 0.1;
    let puddleAmount = 0.05;

    // Define styles
    if (style === 'luxury') {
      foldFrequency = 6;  // Deep, wide folds
      foldDepth = 0.2;
      puddleAmount = 0.1; // Lots of fabric puddling on floor
    } else if (style === 'minimal') {
      foldFrequency = 12; // Narrower folds
      foldDepth = 0.05;
      puddleAmount = 0;   // Clean at the floor
    } else if (style === 'modern') {
      foldFrequency = 8;
      foldDepth = 0.08;
      puddleAmount = 0.02; // Just resting on floor
    } else if (style === 'classic') {
      foldFrequency = 10;
      foldDepth = 0.12;
      puddleAmount = 0.05; 
    }

    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        
        const normalizedX = v.x + 0.5; 
        
        // Folds bunch up when open
        const foldIntensity = 1 + (1 - openAmount) * 1.5;
        
        const wave = Math.sin(normalizedX * Math.PI * foldFrequency) * (foldDepth * foldIntensity);
        const yFalloff = (v.y + 0.5); 
        
        // Floor puddling effect (bottom of the drape extends forward and folds)
        let puddleOffsetZ = 0;
        let puddleOffsetY = 0;
        
        if (yFalloff < 0.1 && puddleAmount > 0) {
            const puddlePhase = (0.1 - yFalloff) * 10; // 0 to 1
            puddleOffsetZ = Math.sin(puddlePhase * Math.PI) * puddleAmount;
            puddleOffsetY = puddlePhase * puddleAmount * 0.5; // push up slightly
        }
        
        const constrainTop = 0.2 + 0.8 * (1 - yFalloff);
        const finalZ = wave * constrainTop + puddleOffsetZ;
        const finalY = v.y + puddleOffsetY;
        
        pos.setXYZ(i, v.x, finalY, finalZ);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, [style, openAmount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (leftRef.current && rightRef.current) {
      // Drapes are heavy, sway very slowly if at all
      const sway = Math.sin(time * 0.4) * 0.005;
      leftRef.current.position.z = sway * openAmount + 0.08;
      rightRef.current.position.z = -sway * openAmount + 0.08;
    }
  });

  const getMaterialProps = () => {
    const base = {
       color,
       side: 2 as const,
       transparent: true,
       opacity: opacity
    };
    
    if (style === 'luxury') {
       return { 
           ...base, 
           roughness: 0.6, 
           sheen: 1, 
           sheenColor: '#ffffff', 
           sheenRoughness: 0.3,
           clearcoat: 0.2, // Silk-like shine
           clearcoatRoughness: 0.5
       };
    } else if (style === 'modern' || style === 'minimal') {
       return {
           ...base,
           roughness: 0.9,
           metalness: 0,
       }
    } else {
       // classic
       return {
           ...base,
           roughness: 0.8,
           sheen: 0.4,
           sheenRoughness: 0.6
       }
    }
  };

  const drapeWidth = scale.width / 2;
  // Drapes are thick, they bunch up significantly
  const minWidthRatio = style === 'luxury' ? 0.3 : 0.2;
  const currentWidth = drapeWidth * (minWidthRatio + (1 - minWidthRatio) * openAmount);
  
  const leftX = -scale.width / 2 + currentWidth / 2 + (drapeWidth - currentWidth) * openAmount;
  const rightX = -leftX;

  const totalHeight = scale.height + (dimensions.drop / 100);

  return (
    <group position={[0, -0.1, 0]}>
      {/* Decorative Premium Rod */}
      <mesh position={[0, totalHeight / 2 + 0.15, 0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, scale.width + 0.6, 32]} />
        {style === 'luxury' || style === 'classic' ? (
           <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} clearcoat={1} />
        ) : (
           <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.4} />
        )}
      </mesh>

      {/* Decorative Finials */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (scale.width + 0.6) / 2, totalHeight / 2 + 0.15, 0.1]}>
          <mesh castShadow rotation={style === 'minimal' || style === 'modern' ? [0, 0, Math.PI/2] : [0, 0, 0]}>
            {style === 'minimal' || style === 'modern' ? (
                <cylinderGeometry args={[0.04, 0.04, 0.08, 32]} />
            ) : (
                <sphereGeometry args={[0.06, 32, 32]} />
            )}
            {style === 'luxury' || style === 'classic' ? (
               <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} />
            ) : (
               <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.4} />
            )}
          </mesh>
          {(style === 'luxury' || style === 'classic') && (
              <mesh position={[side * 0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                 <cylinderGeometry args={[0.01, 0.04, 0.1, 16]} />
                 <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} />
              </mesh>
          )}
        </group>
      ))}

      {/* Left Panel */}
      <mesh 
        ref={leftRef} 
        position={[leftX, 0, 0.1]}
        scale={[currentWidth, totalHeight, 1]}
        geometry={drapeGeometry}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial {...getMaterialProps()} />
      </mesh>

      {/* Right Panel */}
      <mesh 
        ref={rightRef} 
        position={[rightX, 0, 0.1]}
        scale={[currentWidth, totalHeight, 1]}
        geometry={drapeGeometry}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial {...getMaterialProps()} />
      </mesh>

      {/* Frame */}
      <group position={[0, 0, -0.1]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[scale.width + 0.15, totalHeight + 0.15, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[scale.width, totalHeight]} />
          <meshPhysicalMaterial color="#cce6ff" transmission={0.9} transparent opacity={0.4} roughness={0.1} ior={1.5} />
        </mesh>
      </group>

      {showMeasurements && (
        <Text position={[0, totalHeight / 2 + 0.4, 0]} fontSize={0.15} color="#ffffff" outlineWidth={0.01} outlineColor="#000000">
          {Math.round(dimensions.width)} cm x {Math.round(dimensions.height)} cm
        </Text>
      )}
    </group>
  );
}
