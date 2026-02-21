import { useRef, useMemo } from 'react';
import { Group, BufferGeometry, Float32BufferAttribute } from 'three';
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
}

export default function BlindModel({ 
  style, 
  color, 
  dimensions, 
  texture,
  showMeasurements 
}: BlindModelProps) {
  const groupRef = useRef<Group>(null);
  const slatRefs = useRef<(any)[]>([]);

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
    
    if (style === 'vertical' && slatRefs.current.length > 0) {
      slatRefs.current.forEach((ref, i) => {
        if (ref) {
          ref.rotation.y = Math.sin(time * 0.5 + i * 0.3) * 0.15;
        }
      });
    }
    
    if (style === 'venetian' && slatRefs.current.length > 0) {
      const angle = Math.sin(time * 0.3) * 0.2;
      slatRefs.current.forEach((ref) => {
        if (ref) {
          ref.rotation.x = angle;
        }
      });
    }
  });

  const slats = useMemo(() => {
    if (style === 'venetian') {
      const count = Math.floor(scale.height * 8);
      return Array.from({ length: count }, (_, i) => i);
    }
    if (style === 'vertical') {
      const count = Math.floor(scale.width * 4);
      return Array.from({ length: count }, (_, i) => i);
    }
    if (style === 'roman') {
      return Array.from({ length: 6 }, (_, i) => i);
    }
    return [];
  }, [style, scale]);

  // Create textured geometry for fabric blinds
  const fabricGeometry = useMemo(() => {
    if (texture === 'woven') {
      const geometry = new BufferGeometry();
      const segments = 32;
      const vertices: number[] = [];
      const normals: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      for (let i = 0; i <= segments; i++) {
        for (let j = 0; j <= segments; j++) {
          const x = (i / segments - 0.5);
          const y = (j / segments - 0.5);
          const z = (Math.sin(i * 2) * Math.sin(j * 2)) * 0.01;
          
          vertices.push(x, y, z);
          normals.push(0, 0, 1);
          uvs.push(i / segments, j / segments);
        }
      }

      for (let i = 0; i < segments; i++) {
        for (let j = 0; j < segments; j++) {
          const a = i * (segments + 1) + j;
          const b = a + segments + 1;
          indices.push(a, b, a + 1);
          indices.push(b, b + 1, a + 1);
        }
      }

      geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
      geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      return geometry;
    }
    return null;
  }, [texture]);

  const getMaterialProps = () => {
    const roughnessMap = {
      smooth: 0.3,
      fabric: 0.7,
      woven: 0.85,
    };

    return {
      color,
      roughness: roughnessMap[texture],
      metalness: style === 'venetian' ? 0.4 : 0,
    };
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Mounting bracket/headrail */}
      <mesh position={[0, scale.height / 2 + 0.08, 0]} castShadow>
        <boxGeometry args={[scale.width + 0.2, 0.08, 0.12]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Bracket end caps */}
      <mesh position={[-(scale.width + 0.2) / 2, scale.height / 2 + 0.08, 0]} castShadow>
        <boxGeometry args={[0.05, 0.1, 0.14]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[(scale.width + 0.2) / 2, scale.height / 2 + 0.08, 0]} castShadow>
        <boxGeometry args={[0.05, 0.1, 0.14]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>

      {style === 'roller' && (
        <>
          {/* Roller tube */}
          <mesh position={[0, scale.height / 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, scale.width, 24]} />
            <meshStandardMaterial color="#666" metalness={0.7} roughness={0.2} />
          </mesh>
          
          {/* Roller fabric */}
          <mesh 
            position={[0, 0, 0]}
            scale={[scale.width, scale.height, 1]}
            geometry={fabricGeometry || undefined}
            castShadow
            receiveShadow
          >
            {fabricGeometry ? (
              <meshStandardMaterial {...getMaterialProps()} side={2} />
            ) : (
              <planeGeometry args={[1, 1, 32, 32]} />
            )}
            {!fabricGeometry && <meshStandardMaterial {...getMaterialProps()} side={2} />}
          </mesh>

          {/* Bottom weighted bar */}
          <mesh position={[0, -scale.height / 2 - 0.04, 0.02]} castShadow>
            <boxGeometry args={[scale.width, 0.06, 0.06]} />
            <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Pull cord */}
          <mesh position={[scale.width / 2 - 0.1, -scale.height / 2 - 0.3, 0.04]}>
            <cylinderGeometry args={[0.008, 0.008, 0.5, 8]} />
            <meshStandardMaterial color="#e8e8e8" />
          </mesh>
          <mesh position={[scale.width / 2 - 0.1, -scale.height / 2 - 0.55, 0.04]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#e8e8e8" />
          </mesh>
        </>
      )}

      {style === 'venetian' && (
        <>
          {slats.map((i) => {
            const spacing = scale.height / slats.length;
            const yPos = scale.height / 2 - i * spacing - spacing / 2;
            
            return (
              <mesh 
                key={i} 
                ref={(el) => (slatRefs.current[i] = el)}
                position={[0, yPos, 0]}
                rotation={[Math.PI / 16, 0, 0]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[scale.width - 0.02, 0.04, 0.12]} />
                <meshStandardMaterial {...getMaterialProps()} />
              </mesh>
            );
          })}
          
          {/* Lift cords */}
          {[-0.3, 0.3].map((xOffset, idx) => (
            <mesh key={idx} position={[scale.width * xOffset, 0, 0.07]}>
              <cylinderGeometry args={[0.006, 0.006, scale.height + 0.5, 8]} />
              <meshStandardMaterial color="#f5f5f5" />
            </mesh>
          ))}

          {/* Control wand */}
          <mesh position={[scale.width / 2 + 0.05, -scale.height / 4, 0.08]}>
            <cylinderGeometry args={[0.01, 0.01, scale.height / 2, 8]} />
            <meshStandardMaterial color="#e8e8e8" />
          </mesh>
        </>
      )}

      {style === 'vertical' && (
        <>
          {slats.map((i) => {
            const spacing = scale.width / slats.length;
            const xPos = -scale.width / 2 + i * spacing + spacing / 2;
            
            return (
              <mesh 
                key={i} 
                ref={(el) => (slatRefs.current[i] = el)}
                position={[xPos, 0, 0]}
                castShadow
                receiveShadow
              >
                <planeGeometry args={[spacing * 0.9, scale.height]} />
                <meshStandardMaterial {...getMaterialProps()} side={2} />
              </mesh>
            );
          })}
          
          {/* Track */}
          <mesh position={[0, scale.height / 2, 0]} castShadow>
            <boxGeometry args={[scale.width, 0.04, 0.06]} />
            <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Chain control */}
          <mesh position={[-scale.width / 2 + 0.1, scale.height / 2 - 0.3, 0.05]}>
            <cylinderGeometry args={[0.008, 0.008, 0.5, 8]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </>
      )}

      {style === 'roman' && (
        <>
          {/* Main fabric panel */}
          <mesh 
            position={[0, 0, 0]}
            scale={[scale.width, scale.height, 1]}
            geometry={fabricGeometry || undefined}
            castShadow
            receiveShadow
          >
            {fabricGeometry ? (
              <meshStandardMaterial {...getMaterialProps()} side={2} />
            ) : (
              <planeGeometry args={[1, 1, 32, 32]} />
            )}
            {!fabricGeometry && <meshStandardMaterial {...getMaterialProps()} side={2} />}
          </mesh>

          {/* Horizontal folds */}
          {slats.map((i) => {
            const spacing = scale.height / (slats.length + 1);
            const yPos = -scale.height / 2 + i * spacing;
            
            return (
              <mesh 
                key={i}
                position={[0, yPos, 0.02]}
                castShadow
              >
                <boxGeometry args={[scale.width, 0.03, 0.04]} />
                <meshStandardMaterial color={color} roughness={0.8} />
              </mesh>
            );
          })}

          {/* Lift cords */}
          {[-0.25, 0, 0.25].map((xOffset, idx) => (
            <mesh key={idx} position={[scale.width * xOffset, 0, 0.03]}>
              <cylinderGeometry args={[0.005, 0.005, scale.height, 8]} />
              <meshStandardMaterial color="#f5f5f5" />
            </mesh>
          ))}
        </>
      )}

      {/* Window Frame */}
      <group position={[0, 0, -0.15]}>
        <mesh castShadow>
          <boxGeometry args={[scale.width + 0.15, scale.height + 0.2, 0.04]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[scale.width, scale.height]} />
          <meshStandardMaterial 
            color="#e8f4f8" 
            transparent 
            opacity={0.3}
            roughness={0.1}
          />
        </mesh>
        {/* Cross bars */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.015, scale.height, 0.015]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[scale.width, 0.015, 0.015]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Measurements */}
      {showMeasurements && (
        <>
          <Text
            position={[0, scale.height / 2 + 0.3, 0]}
            fontSize={0.12}
            color="#667eea"
            anchorX="center"
            anchorY="middle"
          >
            {dimensions.width} cm
          </Text>
          <Text
            position={[scale.width / 2 + 0.3, 0, 0]}
            fontSize={0.12}
            color="#667eea"
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, -Math.PI / 2]}
          >
            {dimensions.height} cm
          </Text>
        </>
      )}
    </group>
  );
}
