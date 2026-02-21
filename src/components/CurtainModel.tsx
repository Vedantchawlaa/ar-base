import { useRef, useMemo } from 'react';
import { Mesh, BufferGeometry, Float32BufferAttribute } from 'three';
import { useFrame } from '@react-three/fiber';
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
  openAmount: number; // 0 to 1 (0 is open, 1 is closed)
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

  // Create wavy curtain geometry with folds
  const curtainGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const segments = 64;
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5);
        const y = (j / segments - 0.5);
        
        // Create wave pattern for folds
        const waveZ = Math.sin(i * 0.8) * 0.08 * (1 - j / segments);
        
        vertices.push(x, y, waveZ);
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
  }, []);

  // Subtle animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (leftCurtainRef.current && rightCurtainRef.current) {
      const sway = Math.sin(time * 0.5) * 0.02;
      leftCurtainRef.current.rotation.y = sway;
      rightCurtainRef.current.rotation.y = -sway;
    }
  });

  const getMaterialProps = () => {
    const baseProps = {
      color,
      transparent: true,
      opacity: style === 'sheer' ? opacity * 0.6 : opacity,
      side: 2 as const,
    };

    switch (style) {
      case 'sheer':
        return { ...baseProps, roughness: 0.2, metalness: 0, envMapIntensity: 0.5 };
      case 'blackout':
        return { ...baseProps, roughness: 0.9, metalness: 0, opacity: 1 };
      case 'velvet':
        return { ...baseProps, roughness: 0.95, metalness: 0.05, envMapIntensity: 0.3 };
      case 'linen':
        return { ...baseProps, roughness: 0.85, metalness: 0, envMapIntensity: 0.4 };
    }
  };

  const curtainWidth = scale.width / 2;
  const currentWidth = curtainWidth * (0.3 + 0.7 * openAmount); // Bunching effect
  
  // Interpolate position between middle (closed) and side (open)
  const leftX = -scale.width / 2 + currentWidth / 2 + (curtainWidth - currentWidth / 2 - 0.1) * openAmount;
  const rightX = -leftX;

  const panelHeight = scale.height;
  const panelWidth = scale.width / 2.2;
  const totalHeight = panelHeight + (dimensions.drop / 100);



  return (
    <group position={[0, 0, 0]}>
      {/* Curtain Rod */}
      <mesh position={[0, totalHeight / 2 + 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, scale.width + 0.4, 16]} />
        <meshStandardMaterial color="#8b7355" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rod End Caps */}
      <mesh position={[-(scale.width + 0.4) / 2, totalHeight / 2 + 0.1, 0]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#8b7355" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[(scale.width + 0.4) / 2, totalHeight / 2 + 0.1, 0]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#8b7355" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Curtain Rings */}
      {Array.from({ length: 12 }).map((_, i) => {
        // Distribute rings along the current width of each panel
        const side = i < 6 ? -1 : 1;
        const localIdx = i % 6;
        const ringX = side * (scale.width / 2 - (localIdx / 5) * currentWidth);
        return (
          <mesh key={i} position={[ringX, totalHeight / 2 + 0.1, 0]} castShadow>
            <torusGeometry args={[0.025, 0.008, 8, 16]} />
            <meshStandardMaterial color="#8b7355" metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Left Curtain Panel */}
      <mesh 
        ref={leftCurtainRef} 
        position={[leftX, 0, 0]}
        scale={[currentWidth, totalHeight, 1]}
        geometry={curtainGeometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...getMaterialProps()} />
      </mesh>

      {/* Right Curtain Panel */}
      <mesh 
        ref={rightCurtainRef} 
        position={[rightX, 0, 0]}
        scale={[currentWidth, totalHeight, 1]}
        geometry={curtainGeometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...getMaterialProps()} />
      </mesh>


      {/* Tiebacks */}
      <mesh position={[-panelWidth - 0.15, 0, 0.1]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.08, 0.02, 16, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[panelWidth + 0.15, 0, 0.1]} rotation={[0, 0, -Math.PI / 4]}>
        <torusGeometry args={[0.08, 0.02, 16, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Window Frame */}
      <group position={[0, 0, -0.15]}>
        {/* Frame border */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[scale.width + 0.2, totalHeight + 0.3, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Glass */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[scale.width, totalHeight]} />
          <meshStandardMaterial 
            color="#e8f4f8" 
            transparent 
            opacity={0.3}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        {/* Window panes */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.02, totalHeight, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[scale.width, 0.02, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Measurements */}
      {showMeasurements && (
        <>
          <Text
            position={[0, totalHeight / 2 + 0.4, 0]}
            fontSize={0.12}
            color="#667eea"
            anchorX="center"
            anchorY="middle"
          >
            {dimensions.width} cm
          </Text>
          <Text
            position={[scale.width / 2 + 0.4, 0, 0]}
            fontSize={0.12}
            color="#667eea"
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, -Math.PI / 2]}
          >
            {dimensions.height} cm
          </Text>
          {dimensions.drop > 0 && (
            <Text
              position={[-scale.width / 2 - 0.4, -totalHeight / 2 + 0.2, 0]}
              fontSize={0.1}
              color="#e74c3c"
              anchorX="center"
              anchorY="middle"
            >
              Drop: {dimensions.drop} cm
            </Text>
          )}
        </>
      )}
    </group>
  );
}
