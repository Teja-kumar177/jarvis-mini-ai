import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function Helmet() {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        {/* Main head sphere */}
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.9}
          roughness={0.1}
          emissive="#B8860B"
          emissiveIntensity={0.3}
        />
        
        {/* Face plate */}
        <mesh position={[0, 0.1, 0.8]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.2]} />
          <meshStandardMaterial 
            color="#FFD700" 
            metalness={0.95}
            roughness={0.05}
            emissive="#B8860B"
            emissiveIntensity={0.4}
          />
        </mesh>
        
        {/* Eyes - glowing red */}
        <mesh position={[-0.3, 0.2, 0.85]}>
          <boxGeometry args={[0.2, 0.15, 0.05]} />
          <meshStandardMaterial 
            color="#DC143C" 
            emissive="#DC143C"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[0.3, 0.2, 0.85]}>
          <boxGeometry args={[0.2, 0.15, 0.05]} />
          <meshStandardMaterial 
            color="#DC143C" 
            emissive="#DC143C"
            emissiveIntensity={2}
          />
        </mesh>
        
        {/* Jaw piece */}
        <mesh position={[0, -0.3, 0.7]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.8, 0.4, 0.2]} />
          <meshStandardMaterial 
            color="#DC143C" 
            metalness={0.9}
            roughness={0.1}
            emissive="#8B0000"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Side panels */}
        <mesh position={[-0.7, 0, 0.3]} rotation={[0, -0.5, 0]}>
          <boxGeometry args={[0.3, 1, 0.4]} />
          <meshStandardMaterial 
            color="#DC143C" 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0.7, 0, 0.3]} rotation={[0, 0.5, 0]}>
          <boxGeometry args={[0.3, 1, 0.4]} />
          <meshStandardMaterial 
            color="#DC143C" 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </mesh>
    </Float>
  );
}

interface IronManHelmetProps {
  isActive?: boolean;
}

export const IronManHelmet = ({ isActive }: IronManHelmetProps) => {
  return (
    <div className="w-64 h-64 mx-auto">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#DC143C" />
        <spotLight 
          position={[0, 5, 5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={isActive ? 2 : 1}
          color="#FFD700"
        />
        <Helmet />
      </Canvas>
    </div>
  );
};
