import { useRef, useMemo } from 'react';
import { Group, PlaneGeometry, Vector3 } from 'three';
import { Text } from '@react-three/drei';
import type { ShadeStyle, Dimensions } from '../../types';


interface ShadeModelProps {
  style: ShadeStyle;
  color: string;
  dimensions: Dimensions;
  texture: 'smooth' | 'fabric' | 'woven';
  showMeasurements: boolean;
  openAmount: number; // 0 (open/raised) to 1 (closed/lowered)
}

export default function ShadeModel({ 
  style, 
  color, 
  dimensions, 
  texture,
  showMeasurements,
  openAmount 
}: ShadeModelProps) {

  const groupRef = useRef<Group>(null);


  const scale = useMemo(() => {
    const baseWidth = 2.4;
    const baseHeight = 3;
    return {
      width: (dimensions.width / 150) * baseWidth,
      height: (dimensions.height / 200) * baseHeight,
    };
  }, [dimensions]);

  const dropHeight = scale.height * openAmount; // total deployed height

  // Pleated/Honeycomb geometry (zig-zag pattern)
  const pleatedGeometry = useMemo(() => {
    const folds = 40;
    const geometry = new PlaneGeometry(1, 1, 1, folds); 
    const pos = geometry.getAttribute('position');
    const v = new Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const foldY = (v.y + 0.5) * folds; 
        const isFoldOut = Math.floor(foldY) % 2 === 0;
        const zOff = isFoldOut ? 0.04 : -0.04;
        
        // When more open (less dropHeight), the folds get deeper out 
        const compression = 1.0 - openAmount * 0.5; 
        pos.setZ(i, zOff * compression); 
    }
    geometry.computeVertexNormals();
    return geometry;
  }, [openAmount]);

  const texturedProps = {
    roughness: texture === 'woven' ? 0.9 : texture === 'fabric' ? 0.8 : 0.4,
    metalness: texture === 'smooth' ? 0.1 : 0,
    side: 2 as const,
  };



  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Headrail */}
      <mesh position={[0, scale.height / 2 + 0.05, 0.05]} castShadow>
        <boxGeometry args={[scale.width + 0.1, 0.1, 0.12]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.2} />
      </mesh>

      {/* Styles handling */}
      
      {/* 1. Pleated Shade */}
      {style === 'pleated' && (
        <mesh 
          position={[0, scale.height / 2 - dropHeight / 2, 0.05]}
          scale={[scale.width, dropHeight || 0.01, 1]}
          geometry={pleatedGeometry}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial 
            color={color} 
            {...texturedProps}
            transmission={0.2} 
            thickness={0.01}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {/* 2. Honeycomb / Cellular Shade (Double layer pleated to simulate cells) */}
      {style === 'honeycomb' && (
        <group position={[0, scale.height / 2 - dropHeight / 2, 0.05]}>
          <mesh 
            position={[0, 0, 0.02]}
            scale={[scale.width, dropHeight || 0.01, 1]}
            geometry={pleatedGeometry}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial 
              color={color} 
              {...texturedProps}
              transmission={0.4} 
              thickness={0.02}
            />
          </mesh>
          <mesh 
            position={[0, 0, -0.02]}
            scale={[scale.width, dropHeight || 0.01, -1]} // flip depth
            geometry={pleatedGeometry}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial 
              color={color} 
              {...texturedProps}
              transmission={0.4} 
              thickness={0.02}
            />
          </mesh>
        </group>
      )}

      {/* 3. Solar Shade (Flat roller) */}
      {style === 'solar' && (
        <group>
          {/* Hanging fabric */}
          <mesh 
            position={[0, scale.height / 2 - dropHeight / 2, 0.05]}
            scale={[scale.width, dropHeight || 0.01, 1]}
            castShadow
            receiveShadow
          >
             <planeGeometry args={[1, 1, 1, 1]} />
             <meshPhysicalMaterial 
               color={color} 
               {...texturedProps}
               transmission={0.7} 
               thickness={0.01}
               transparent
               opacity={0.8}
             />
          </mesh>
          {/* Rolled up part inside headrail */}
          <mesh 
             position={[0, scale.height / 2 + 0.05, 0.05]} 
             rotation={[0, 0, Math.PI / 2]}
          >
             <cylinderGeometry args={[0.03 + (1-openAmount)*0.03, 0.03 + (1-openAmount)*0.03, scale.width - 0.02, 16]} />
             <meshPhysicalMaterial color={color} {...texturedProps} />
          </mesh>
        </group>
      )}

      {/* 4. Bamboo Shade (Horizontal woven wood) */}
      {style === 'bamboo' && (
        <group>
            {/* The flat unrolled part */}
            <mesh 
              position={[0, scale.height / 2 - dropHeight / 2, 0.05]}
              scale={[scale.width, dropHeight || 0.01, 1]}
              castShadow
              receiveShadow
            >
               <planeGeometry args={[1, 1, 1, Math.floor(dropHeight * 40)]} />
               <meshPhysicalMaterial 
                 color={color} 
                 {...texturedProps}
                 transmission={0.1}
                 transparent
                 opacity={0.95}
                 map={null} // Would use a bamboo texture ideally, but using repeating geometry/striping via material roughness could work
                 roughness={0.9} // bamboo is matte but bumpy
                 bumpScale={0.05}
               />
               {/* Drawing actual slits is expensive, using a plane with detailed horizontal subdivisions simulates the flexibility */}
            </mesh>
            {/* Rolled up bottom rail logic for bamboo shades */}
            <mesh position={[0, scale.height / 2 - dropHeight, 0.06]} rotation={[0, 0, Math.PI/2]} castShadow>
               <cylinderGeometry args={[0.02 + (1-openAmount)*0.04, 0.02 + (1-openAmount)*0.04, scale.width + 0.02, 16]} />
               <meshStandardMaterial color={color} roughness={0.9} />
            </mesh>
        </group>
      )}

      {/* Bottom Rail for non-bamboo */}
      {style !== 'bamboo' && (
        <mesh position={[0, scale.height / 2 - dropHeight - 0.02, 0.05]} castShadow>
          <boxGeometry args={[scale.width, 0.04, 0.08]} />
          <meshStandardMaterial color={style === 'solar' ? '#cccccc' : '#dddddd'} roughness={0.3} />
        </mesh>
      )}

      {/* Frame */}
      <group position={[0, 0, -0.1]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[scale.width + 0.15, scale.height + 0.15, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[scale.width, scale.height]} />
          <meshPhysicalMaterial color="#cce6ff" transmission={0.9} transparent opacity={0.4} roughness={0.1} ior={1.5} />
        </mesh>
      </group>

      {showMeasurements && (
        <>
          <Text position={[0, scale.height / 2 + 0.3, 0]} fontSize={0.15} color="#ffffff" outlineWidth={0.01} outlineColor="#000000" anchorX="center" anchorY="middle">
            {Math.round(dimensions.width)} cm
          </Text>
          <Text position={[scale.width / 2 + 0.3, 0, 0]} fontSize={0.15} color="#ffffff" outlineWidth={0.01} outlineColor="#000000" anchorX="center" anchorY="middle" rotation={[0, 0, -Math.PI / 2]}>
            {Math.round(dimensions.height)} cm
          </Text>
        </>
      )}
    </group>
  );
}
