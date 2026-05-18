import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, useProgress, Html } from '@react-three/drei';
import { Building } from './Building';
import { CityBuilding } from '../services/githubApi';
import { Suspense } from 'react';

interface CitySceneProps {
  buildings: CityBuilding[];
  theme: 'day' | 'night' | 'sunset';
  onBuildingHover: (building: CityBuilding | null) => void;
}

function CityGround({ theme }: { theme: string }) {
  const groundColor =
    theme === 'night' ? '#071510' : theme === 'sunset' ? '#120a00' : '#0a1f14';
  const roadColor =
    theme === 'night' ? '#050e09' : theme === 'sunset' ? '#0a0700' : '#071510';

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color={groundColor} roughness={0.98} metalness={0} />
      </mesh>

      {/* Horizontal roads (along Z) */}
      {[-9.8, -7, -4.2, -1.4, 1.4, 4.2, 7, 9.8].map((z, i) => (
        <mesh key={`road-h-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, z]}>
          <planeGeometry args={[300, 0.35]} />
          <meshStandardMaterial color={roadColor} roughness={0.99} />
        </mesh>
      ))}

      {/* Vertical roads (along X) */}
      {Array.from({ length: 55 }, (_, i) => -37 + i * 1.4).map((x, i) => (
        <mesh key={`road-v-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.015, 0]}>
          <planeGeometry args={[0.2, 300]} />
          <meshStandardMaterial color={roadColor} roughness={0.99} />
        </mesh>
      ))}
    </>
  );
}

function CityLights({ theme }: { theme: string }) {
  if (theme === 'day') {
    return (
      <>
        <ambientLight intensity={0.65} color="#d4edda" />
        <directionalLight
          position={[60, 90, 40]}
          intensity={2.2}
          color="#fffde7"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={200}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
        />
        <hemisphereLight args={['#b3e5fc', '#1b5e20', 0.4]} />
      </>
    );
  }

  if (theme === 'sunset') {
    return (
      <>
        <ambientLight intensity={0.25} color="#ff6e40" />
        <directionalLight
          position={[-90, 12, 30]}
          intensity={1.8}
          color="#ff6d00"
          castShadow
        />
        <directionalLight position={[90, 5, -30]} intensity={0.25} color="#1a237e" />
        <hemisphereLight args={['#ff6d00', '#1a237e', 0.45]} />
      </>
    );
  }

  // Night
  return (
    <>
      <ambientLight intensity={0.1} color="#1a237e" />
      <directionalLight position={[30, 40, 15]} intensity={0.15} color="#7986cb" />
      <pointLight position={[0, 25, 0]} intensity={0.6} color="#ffe082" distance={100} decay={1} />
      <pointLight position={[-20, 5, 0]} intensity={0.3} color="#64ffda" distance={40} decay={2} />
      <pointLight position={[20, 5, 0]} intensity={0.3} color="#82b1ff" distance={40} decay={2} />
      <hemisphereLight args={['#1a237e', '#071510', 0.25]} />
    </>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-green-400 text-sm font-mono">
        Loading {Math.floor(progress)}%
      </div>
    </Html>
  );
}

interface SceneContentProps {
  buildings: CityBuilding[];
  theme: 'day' | 'night' | 'sunset';
  onBuildingHover: (building: CityBuilding | null) => void;
}

function SceneContent({ buildings, theme, onBuildingHover }: SceneContentProps) {
  return (
    <>
      <CityLights theme={theme} />
      <CityGround theme={theme} />

      {theme === 'night' && (
        <Stars radius={120} depth={60} count={4000} factor={5} fade speed={0.3} />
      )}
      {theme === 'day' && (
        <Sky
          sunPosition={[100, 30, 100]}
          turbidity={6}
          rayleigh={1.5}
          azimuth={0.25}
        />
      )}
      {theme === 'sunset' && (
        <Sky
          sunPosition={[-100, 1, 40]}
          turbidity={12}
          rayleigh={5}
          azimuth={0.9}
          inclination={0.53}
        />
      )}

      <Suspense fallback={<Loader />}>
        {buildings.map((b, i) => (
          <Building
            key={`${b.week}-${b.day}-${i}`}
            building={b}
            onHover={onBuildingHover}
            animated={true}
          />
        ))}
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.07}
        maxPolarAngle={Math.PI / 2.08}
        minDistance={4}
        maxDistance={130}
        target={[0, 0, 0]}
        makeDefault
      />
    </>
  );
}

export function CityScene({ buildings, theme, onBuildingHover }: CitySceneProps) {
  const bgColor =
    theme === 'night' ? '#030a06' : theme === 'sunset' ? '#100800' : '#7ecae0';

  return (
    <Canvas
      camera={{ position: [45, 38, 42], fov: 48, near: 0.1, far: 500 }}
      shadows={{ type: 'PCFSoftShadowMap' as any }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 90, 200]} />
      <SceneContent buildings={buildings} theme={theme} onBuildingHover={onBuildingHover} />
    </Canvas>
  );
}
