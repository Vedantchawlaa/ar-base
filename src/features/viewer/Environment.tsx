import { useRef } from 'react';
import { Mesh } from 'three';

export function Environment() {
  const wallRef = useRef<Mesh>(null);

  return (
    <group position={[0, 0, -3]}>
      {/* Main Wall */}
      <mesh ref={wallRef} receiveShadow>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial 
          color="#534521ff" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      <Window />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 3]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial 
          color="#d4c5b0"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Baseboard */}
      <mesh position={[0, -5.85, 0.1]}>
        <boxGeometry args={[20, 0.3, 0.2]} />
        <meshStandardMaterial color="#4a4035" roughness={0.4} />
      </mesh>
    </group>
  );
}

function Window() {
  return (
    <group position={[0, 0.5, 0.1]}>
      {/* Window frame */}
      <mesh>
        <boxGeometry args={[4.2, 3.2, 0.15]} />
        <meshStandardMaterial color="#3d3428" roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Glass panes */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[3.8, 2.8]} />
        <meshPhysicalMaterial 
          color="#e0f2fe"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>

      {/* Window divider - vertical */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[0.08, 2.8, 0.05]} />
        <meshStandardMaterial color="#3d3428" roughness={0.5} />
      </mesh>

      {/* Window divider - horizontal */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[3.8, 0.08, 0.05]} />
        <meshStandardMaterial color="#3d3428" roughness={0.5} />
      </mesh>

      {/* Window sill */}
      <mesh position={[0, -1.7, 0.15]}>
        <boxGeometry args={[4.4, 0.15, 0.3]} />
        <meshStandardMaterial color="#3d3428" roughness={0.5} />
      </mesh>
    </group>
  );
}
