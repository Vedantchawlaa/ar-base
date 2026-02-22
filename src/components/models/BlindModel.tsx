import { useRef, useMemo } from 'react';
import { Group, Mesh, PlaneGeometry, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

type BlindStyle = 'roller' | 'venetian' | 'vertical' | 'roman';

interface Dimensions {
  width: number;
  height: number;
  drop: number;
}

interface BlindModelProps {
  style: BlindStyle;
  color: string;
  dimensions: Dimensions;
  texture: 'smooth' | 'fabric' | 'woven';
  showMeasurements: boolean;
  openAmount: number; // 0 to 1 (0 is open/bunched up, 1 is closed/fully deployed)
}

export default function BlindModel({ 
  style, 
  color, 
  dimensions, 
  texture,
  showMeasurements,
  openAmount 
}: BlindModelProps) {

  const groupRef = useRef<Group>(null);
  const slatsRef = useRef<Mesh[]>([]);

  const scale = useMemo(() => {
    const baseWidth = 2.4;
    const baseHeight = 3;
    return {
      width: (dimensions.width / 150) * baseWidth,
      height: (dimensions.height / 200) * baseHeight,
    };
  }, [dimensions]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (style === 'venetian') {
      // Simulate subtle breeze or adjustments
      const angle = Math.sin(time * 0.5) * 0.05;
      slatsRef.current.forEach((slat) => {
        // When open (0), slats are horizontal. When closed (1), slats rotate to vertical blocking light.
        if (slat) slat.rotation.x = angle + (openAmount * Math.PI * 0.45); 
      });
    }
    if (style === 'vertical') {
      const angle = Math.sin(time * 0.3) * 0.05;
      slatsRef.current.forEach((slat) => {
        // When closed (1), slats rotate to form a flat plane.
        if (slat) slat.rotation.y = angle + (1 - openAmount) * Math.PI * 0.45;
      });
    }
  });

  const venetianSlatCount = Math.floor(scale.height * 18); // Denser slats for realism
  const verticalSlatCount = Math.floor(scale.width * 10);
  const romanFoldCount = 6;

  const romanGeometry = useMemo(() => {
    if (style !== 'roman') return undefined;
    const geometry = new PlaneGeometry(1, 1, 32, 16);
    const pos = geometry.getAttribute('position');
    const v = new Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const foldY = (v.y + 0.5) * romanFoldCount; 
        
        // Deep folds when open, flattening when deployed
        const foldZ = Math.sin(foldY * Math.PI) * 0.1 * (1.1 - openAmount);
        pos.setZ(i, foldZ);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, [style, romanFoldCount, openAmount]);

  const texturedProps = {
    roughness: texture === 'woven' ? 0.9 : texture === 'fabric' ? 0.7 : 0.3,
    metalness: texture === 'smooth' ? 0.2 : 0,
    clearcoat: texture === 'smooth' ? 0.5 : 0,
    side: 2 as const,
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Decorative Headrail */}
      {style === 'vertical' ? (
        <mesh position={[0, scale.height / 2 + 0.06, 0.05]} castShadow>
          <boxGeometry args={[scale.width + 0.2, 0.08, 0.12]} />
          <meshStandardMaterial color="#eeeeee" metalness={0.8} roughness={0.2} />
        </mesh>
      ) : (
        <mesh position={[0, scale.height / 2 + 0.05, 0.05]} castShadow>
          <boxGeometry args={[scale.width + 0.1, 0.1, 0.12]} />
          <meshStandardMaterial color="#f5f5f5" metalness={0.4} roughness={0.4} />
        </mesh>
      )}

      {/* 1. Roller Blind */}
      {style === 'roller' && (
        <group>
          {/* Fabric dropping down */}
          <mesh 
            position={[0, scale.height / 2 - (scale.height * openAmount) / 2, 0.06]}
            scale={[scale.width - 0.02, scale.height * openAmount || 0.01, 1]}
            castShadow
            receiveShadow
          >
            <planeGeometry args={[1, 1, 1, 1]} />
            <meshPhysicalMaterial color={color} {...texturedProps} transmission={0.2} thickness={0.01} transparent opacity={0.95} />
          </mesh>
          {/* Rolled up fabric inside headrail */}
          <mesh 
            position={[0, scale.height / 2 + 0.05, 0.06]} 
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.02 + (1-openAmount)*0.03, 0.02 + (1-openAmount)*0.03, scale.width - 0.04, 32]} />
            <meshPhysicalMaterial color={color} {...texturedProps} />
          </mesh>
          {/* Bottom Weight Bar */}
          <mesh 
            position={[0, scale.height / 2 - (scale.height * openAmount), 0.06]} 
            castShadow
          >
            <boxGeometry args={[scale.width, 0.03, 0.03]} />
            <meshStandardMaterial color="#dddddd" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>
      )}

      {/* 2. Venetian Blind (Horizontal slats) */}
      {style === 'venetian' && (
         <group>
            {Array.from({ length: venetianSlatCount }).map((_, i) => {
               const spacing = scale.height / venetianSlatCount;
               const currentDeploy = openAmount; 
               const bunchedSpacing = 0.008; 
               const activeSpacing = bunchedSpacing + (spacing - bunchedSpacing) * currentDeploy;
               
               // Start bunching from the bottom or top depending on how the system works. standard blinds bunch at bottom as they go up.
               // We will drop them from top.
               const deployedHeight = venetianSlatCount * activeSpacing;
               const yPos = scale.height / 2 - i * activeSpacing - spacing / 2 - (scale.height - deployedHeight) * (1-currentDeploy);
               
               // Only show slats that are "dropped" down below the bunching
               // When rolling up, they stack near the top. As yPos calculates from bunching at top:
               const stackYPos = scale.height / 2 - i * bunchedSpacing - 0.02;

               return (
                 <mesh 
                   key={i} 
                   ref={(el) => { if (el) slatsRef.current[i] = el; }}
                   position={[0, currentDeploy > 0.05 ? yPos : stackYPos, 0.05]}
                   castShadow
                 >
                   {/* Curved slat for rigidity commonly found in venetian blinds */}
                   <boxGeometry args={[scale.width - 0.05, 0.01, 0.08]} />
                   <meshPhysicalMaterial color={color} {...texturedProps} />
                 </mesh>
               );
            })}
         </group>
      )}

      {/* 3. Vertical Blind (Hanging rotating panels) */}
      {style === 'vertical' && (
         <group>
            {Array.from({ length: verticalSlatCount }).map((_, i) => {
               const spacing = scale.width / verticalSlatCount;
               const bunchedSpacing = 0.02;
               
               // Pull from left to right when opening
               const startX = -scale.width / 2;
               
               // When fully bunched (openAmount=0), they all stack closely on the left
               // When fully deployed (openAmount=1), they spread across the width
               const stackX = startX + i * bunchedSpacing;
               const deployX = startX + i * spacing + spacing / 2;

               const xPos = stackX * (1 - openAmount) + deployX * openAmount;
               
               return (
                 <group key={i} position={[xPos, 0, 0.05]}>
                   {/* Track hanger */}
                   <mesh position={[0, scale.height / 2 + 0.03, 0]}>
                     <boxGeometry args={[0.01, 0.04, 0.02]} />
                     <meshStandardMaterial color="#999999" metalness={0.8} />
                   </mesh>
                   {/* Slat */}
                   <mesh 
                     ref={(el) => { if (el) slatsRef.current[i] = el; }}
                     position={[0, 0, 0]}
                     castShadow
                   >
                     <boxGeometry args={[spacing * 0.95, scale.height - 0.05, 0.005]} />
                     <meshPhysicalMaterial color={color} {...texturedProps} transmission={0.1} transparent opacity={0.9} />
                   </mesh>
                 </group>
               );
            })}
         </group>
      )}

      {/* 4. Roman Blind (Folded fabric sections) */}
      {style === 'roman' && (
         <group>
           {Array.from({ length: romanFoldCount }).map((_, i) => {
             const segmentH = scale.height / romanFoldCount;
             const bunchedH = 0.08;
             
             // When deployed, activeH is segmentH. When bunched, activeH is bunchedH.
             const activeH = bunchedH + (segmentH - bunchedH) * openAmount;
             
             // Drop them from the top
             const yPos = scale.height / 2 - i * activeH - activeH / 2;
             
             // Dynamic fold pushing out
             const foldOut = Math.sin((1-openAmount)*Math.PI) * 0.08;

             return (
               <mesh 
                 key={i}
                 position={[0, yPos, 0.05 + foldOut]}
                 scale={[scale.width, activeH, 1]}
                 geometry={romanGeometry}
                 castShadow
                 receiveShadow
               >
                 <meshPhysicalMaterial color={color} {...texturedProps} transmission={0.2} transparent opacity={0.98} />
               </mesh>
             )
           })}
         </group>
      )}

      {/* Frame / Window System behind the blind */}
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
          <Text
            position={[0, scale.height / 2 + 0.3, 0]}
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
