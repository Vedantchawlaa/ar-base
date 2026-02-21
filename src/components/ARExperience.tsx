import { useState, useRef, useEffect, useCallback } from 'react';
import { Text } from '@react-three/drei';
import { IfInSessionMode, useXRHitTest, useXRInputSourceEvent } from '@react-three/xr';
import { Group, Vector3, Euler, Matrix4 } from 'three';
import { useFrame } from '@react-three/fiber';
import CurtainModel from './CurtainModel';
import BlindModel from './BlindModel';
import type { ProductConfig } from '../types';

interface ARExperienceProps {
  config: ProductConfig;
  onARControlsChange?: (controls: ARControlsState) => void;
}

export interface ARControlsState {
  isPlaced: boolean;
  onRotate: () => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
  onReset: () => void;
}

const matrixHelper = new Matrix4();
const hitTestPosition = new Vector3();

export function ARExperience({ config, onARControlsChange }: ARExperienceProps) {
  const { selectedProduct, curtainStyle, blindStyle, color, dimensions, opacity, texture, showMeasurements } = config;
  const [isPlaced, setIsPlaced] = useState(false);
  const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, -2));
  const [rotation, setRotation] = useState<Euler>(new Euler(0, 0, 0));
  const [scale, setScale] = useState(0.5);
  const groupRef = useRef<Group>(null);
  const previewRef = useRef<Group>(null);

  // Hit test for placing on surfaces
  useXRHitTest(
    (results, getWorldMatrix) => {
      if (!isPlaced && results.length > 0) {
        getWorldMatrix(matrixHelper, results[0]);
        hitTestPosition.setFromMatrixPosition(matrixHelper);
      }
    },
    'viewer',
    'plane'
  );

  // Update preview position every frame when not placed
  useFrame(() => {
    if (!isPlaced && previewRef.current) {
      previewRef.current.position.copy(hitTestPosition);
    }
  });

  // Handle tap to place
  useXRInputSourceEvent(
    'all',
    'select',
    () => {
      if (!isPlaced && previewRef.current) {
        setPosition(previewRef.current.position.clone());
        setRotation(previewRef.current.rotation.clone());
        setIsPlaced(true);
      }
    },
    [isPlaced]
  );

  const handleRotate = useCallback(() => {
    setRotation((prev) => new Euler(prev.x, prev.y + Math.PI / 4, prev.z));
  }, []);

  const handleScaleUp = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  }, []);

  const handleScaleDown = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.1, 0.3));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaced(false);
    setScale(0.5);
    setRotation(new Euler(0, 0, 0));
  }, []);

  // Notify parent component about AR controls state only when isPlaced changes
  useEffect(() => {
    if (onARControlsChange) {
      onARControlsChange({
        isPlaced,
        onRotate: handleRotate,
        onScaleUp: handleScaleUp,
        onScaleDown: handleScaleDown,
        onReset: handleReset,
      });
    }
  }, [isPlaced, handleRotate, handleScaleUp, handleScaleDown, handleReset, onARControlsChange]);

  return (
    <>
      {/* Normal 3D view */}
      <IfInSessionMode deny="immersive-ar">
        {selectedProduct === 'curtain' && (
          <CurtainModel 
            style={curtainStyle} 
            color={color}
            dimensions={dimensions}
            opacity={opacity}
            texture={texture}
            showMeasurements={showMeasurements}
          />
        )}
        
        {selectedProduct === 'blind' && (
          <BlindModel 
            style={blindStyle} 
            color={color}
            dimensions={dimensions}
            texture={texture}
            showMeasurements={showMeasurements}
          />
        )}
      </IfInSessionMode>

      {/* AR Mode - simplified experience */}
      <IfInSessionMode allow="immersive-ar">
        {/* Preview group that follows hit test */}
        {!isPlaced && (
          <group ref={previewRef}>
            <Text
              position={[0, 1.5, 0]}
              fontSize={0.1}
              color="#667eea"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#ffffff"
            >
              👆 Tap to place
            </Text>
            
            {/* Visual placement reticle */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <ringGeometry args={[0.15, 0.2, 32]} />
              <meshBasicMaterial color="#667eea" transparent opacity={0.8} />
            </mesh>

            {/* Preview of product at smaller scale */}
            <group scale={0.3} position={[0, 0.5, 0]}>
              {selectedProduct === 'curtain' && (
                <CurtainModel 
                  style={curtainStyle} 
                  color={color}
                  dimensions={dimensions}
                  opacity={opacity * 0.7}
                  texture={texture}
                  showMeasurements={false}
                />
              )}
              
              {selectedProduct === 'blind' && (
                <BlindModel 
                  style={blindStyle} 
                  color={color}
                  dimensions={dimensions}
                  texture={texture}
                  showMeasurements={false}
                />
              )}
            </group>
          </group>
        )}

        {/* Placed product */}
        {isPlaced && (
          <group 
            ref={groupRef} 
            position={position}
            rotation={rotation}
            scale={scale}
          >
            {selectedProduct === 'curtain' && (
              <CurtainModel 
                style={curtainStyle} 
                color={color}
                dimensions={dimensions}
                opacity={opacity}
                texture={texture}
                showMeasurements={showMeasurements}
              />
            )}
            
            {selectedProduct === 'blind' && (
              <BlindModel 
                style={blindStyle} 
                color={color}
                dimensions={dimensions}
                texture={texture}
                showMeasurements={showMeasurements}
              />
            )}

            <Text
              position={[0, -2, 0]}
              fontSize={0.08}
              color="#4ade80"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#ffffff"
            >
              ✓ Placed! Use controls to adjust
            </Text>
          </group>
        )}
      </IfInSessionMode>
    </>
  );
}
