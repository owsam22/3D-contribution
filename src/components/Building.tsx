import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityBuilding } from '../services/githubApi';

interface BuildingProps {
  building: CityBuilding;
  onHover: (building: CityBuilding | null) => void;
  animated?: boolean;
}

export function Building({ building, onHover, animated = true }: BuildingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const progressRef = useRef(0);
  const targetHeight = building.height;

  useFrame((_, delta) => {
    if (!bodyRef.current || !groupRef.current) return;
    if (!animated) {
      progressRef.current = 1;
    } else if (progressRef.current < 1) {
      progressRef.current = Math.min(progressRef.current + delta * 2.0, 1);
    }

    const p = progressRef.current;
    // Easing: ease out cubic
    const eased = 1 - Math.pow(1 - p, 3);
    const currentH = targetHeight * eased;

    if (targetHeight > 0) {
      bodyRef.current.scale.y = eased === 0 ? 0.001 : eased;
      bodyRef.current.position.y = currentH / 2;
    }
  });

  if (building.type === 'park') {
    return (
      <group ref={groupRef} position={[building.x, 0, building.z]}>
        {/* Ground patch */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshStandardMaterial color="#162d1f" roughness={0.95} />
        </mesh>
        {/* Tree trunk */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.04, 0.07, 0.4, 5]} />
          <meshStandardMaterial color="#4a2c0a" roughness={0.9} />
        </mesh>
        {/* Tree foliage */}
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.25, 6, 5]} />
          <meshStandardMaterial color="#1a5c35" roughness={0.85} />
        </mesh>
      </group>
    );
  }

  const w = 0.88;
  const d = 0.88;
  const h = Math.max(building.height, 0.05);
  const isSkyscraper = building.type === 'skyscraper';
  const isOffice = building.type === 'office';

  return (
    <group ref={groupRef} position={[building.x, 0, building.z]}>
      {/* Ground shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[w + 0.15, d + 0.15]} />
        <meshStandardMaterial color="#000000" opacity={0.25} transparent />
      </mesh>

      {/* Main building body */}
      <mesh
        ref={bodyRef}
        position={[0, h / 2, 0]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(building);
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setHovered(false);
          onHover(null);
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={building.color}
          emissive={hovered ? '#ffffff' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
          roughness={isSkyscraper ? 0.3 : 0.6}
          metalness={isSkyscraper ? 0.7 : isOffice ? 0.2 : 0.05}
        />
      </mesh>

      {/* Front window grid overlay */}
      {h > 0.4 && building.type !== 'house' && (
        <mesh position={[0, h / 2, d / 2 + 0.005]}>
          <planeGeometry args={[w * 0.82, h * 0.88]} />
          <meshStandardMaterial
            color="#ffe57f"
            emissive="#ffca28"
            emissiveIntensity={0.35}
            opacity={0.12}
            transparent
          />
        </mesh>
      )}

      {/* Side window overlay */}
      {h > 0.6 && isSkyscraper && (
        <mesh position={[w / 2 + 0.005, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[d * 0.82, h * 0.88]} />
          <meshStandardMaterial
            color="#ffe57f"
            emissive="#ffca28"
            emissiveIntensity={0.25}
            opacity={0.08}
            transparent
          />
        </mesh>
      )}

      {/* Rooftop details for skyscraper */}
      {isSkyscraper && h > 1.5 && (
        <>
          <mesh position={[0, h + 0.12, 0]}>
            <boxGeometry args={[w * 0.45, 0.24, d * 0.45]} />
            <meshStandardMaterial
              color={building.color}
              metalness={0.85}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0, h + 0.32, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.45, 4]} />
            <meshStandardMaterial color="#90caf9" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Blinking light */}
          <mesh position={[0, h + 0.56, 0]}>
            <sphereGeometry args={[0.04, 6, 4]} />
            <meshStandardMaterial
              color="#ff5252"
              emissive="#ff1744"
              emissiveIntensity={1.5}
            />
          </mesh>
        </>
      )}

      {/* Rooftop details for office */}
      {isOffice && h > 0.5 && (
        <mesh position={[0, h + 0.04, 0]}>
          <boxGeometry args={[w * 0.75, 0.08, d * 0.75]} />
          <meshStandardMaterial color="#1b5e20" roughness={0.6} />
        </mesh>
      )}

      {/* House roof (pyramid) */}
      {building.type === 'house' && (
        <mesh position={[0, h + 0.18, 0]}>
          <coneGeometry args={[0.7, 0.36, 4]} />
          <meshStandardMaterial color="#1b5e20" roughness={0.7} />
        </mesh>
      )}
    </group>
  );
}
