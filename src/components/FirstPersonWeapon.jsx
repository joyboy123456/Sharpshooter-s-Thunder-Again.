import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import { SkeletonUtils } from "three-stdlib";
import { useGameStore } from "../store/gameStore";

export const FirstPersonWeapon = () => {
  const { camera } = useThree();
  const groupRef = useRef();
  const controls = useGameStore((state) => state.controls);
  const player = useGameStore((state) => state.player);

  // Weapon bob and sway parameters
  const [bobTime, setBobTime] = useState(0);
  const targetPos = useRef(new Vector3());
  const currentPos = useRef(new Vector3());

  // Load the weapon model
  const { scene } = useGLTF("/models/Character_Soldier.gltf");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Extract just the AK weapon
  useEffect(() => {
    clone.traverse((child) => {
      // Hide everything except the weapon
      if (child.name === "AK") {
        child.visible = true;
      } else if (child.isMesh && child.name !== "AK") {
        // Keep weapon parts visible
        const isWeaponPart = child.parent?.name === "AK" || child.name.includes("AK");
        if (!isWeaponPart) {
          child.visible = false;
        }
      }
    });
  }, [clone]);

  useFrame((_, delta) => {
    if (!groupRef.current || player.dead) return;

    // Calculate weapon position relative to camera
    const isMoving = controls.moveX !== 0 || controls.moveZ !== 0;
    const isFiring = controls.firing;

    // Update bob time when moving
    if (isMoving) {
      setBobTime((t) => t + delta * 8);
    }

    // Calculate bob offset
    const bobX = isMoving ? Math.sin(bobTime) * 0.02 : 0;
    const bobY = isMoving ? Math.abs(Math.cos(bobTime)) * 0.015 : 0;

    // Recoil when firing
    const recoilZ = isFiring ? 0.05 : 0;
    const recoilY = isFiring ? 0.02 : 0;

    // Target position (right side of screen, slightly down)
    targetPos.current.set(
      0.25 + bobX,
      -0.2 + bobY - recoilY,
      -0.4 + recoilZ
    );

    // Smooth interpolation
    currentPos.current.lerp(targetPos.current, delta * 15);

    // Position weapon relative to camera
    groupRef.current.position.copy(camera.position);
    groupRef.current.rotation.copy(camera.rotation);

    // Apply local offset
    const offset = currentPos.current.clone();
    offset.applyQuaternion(camera.quaternion);
    groupRef.current.position.add(offset);
  });

  return (
    <group ref={groupRef}>
      <group
        rotation={[0, Math.PI, 0]}
        scale={[0.8, 0.8, 0.8]}
      >
        {/* Simple weapon model */}
        <group position={[0, 0, 0]}>
          {/* Gun body */}
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.12, 0.5]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Barrel */}
          <mesh position={[0, 0.02, 0.35]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Magazine */}
          <mesh position={[0, -0.12, 0.1]} castShadow>
            <boxGeometry args={[0.06, 0.15, 0.08]} />
            <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Stock */}
          <mesh position={[0, 0, -0.25]} castShadow>
            <boxGeometry args={[0.06, 0.1, 0.2]} />
            <meshStandardMaterial color="#4a3a2a" metalness={0.2} roughness={0.8} />
          </mesh>
          {/* Grip */}
          <mesh position={[0, -0.1, -0.05]} rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.05, 0.1, 0.04]} />
            <meshStandardMaterial color="#3a3a3a" metalness={0.3} roughness={0.7} />
          </mesh>
          {/* Sight */}
          <mesh position={[0, 0.1, 0.1]} castShadow>
            <boxGeometry args={[0.02, 0.04, 0.08]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
        {/* Hands */}
        <group>
          {/* Right hand (on grip) */}
          <mesh position={[0.06, -0.08, -0.05]} castShadow>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#d4a574" roughness={0.8} />
          </mesh>
          {/* Left hand (on barrel) */}
          <mesh position={[-0.06, -0.02, 0.2]} castShadow>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#d4a574" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

useGLTF.preload("/models/Character_Soldier.gltf");
