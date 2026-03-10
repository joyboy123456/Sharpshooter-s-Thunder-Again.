import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { useGameStore } from "../store/gameStore";

const MOVEMENT_SPEED = 202;
const FIRE_RATE = 380;

export const WEAPON_OFFSET = {
  x: 0,
  y: 1.6,
  z: 0,
};

export const CharacterController = ({
  onFire,
  downgradedPerformance,
  ...props
}) => {
  const rigidbody = useRef();
  const lastShoot = useRef(0);

  const { camera } = useThree();
  const scene = useThree((state) => state.scene);

  // Get state from zustand
  const player = useGameStore((state) => state.player);
  const controls = useGameStore((state) => state.controls);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setPlayerHealth = useGameStore((state) => state.setPlayerHealth);
  const setPlayerDead = useGameStore((state) => state.setPlayerDead);
  const addDeath = useGameStore((state) => state.addDeath);
  const resetPlayer = useGameStore((state) => state.resetPlayer);

  const spawnRandomly = () => {
    const spawns = [];
    for (let i = 0; i < 1000; i++) {
      const spawn = scene.getObjectByName(`spawn_${i}`);
      if (spawn) {
        spawns.push(spawn);
      } else {
        break;
      }
    }
    if (spawns.length > 0) {
      const spawnPos =
        spawns[Math.floor(Math.random() * spawns.length)].position;
      rigidbody.current.setTranslation(spawnPos);
    }
  };

  // Initial spawn
  useEffect(() => {
    spawnRandomly();
  }, []);

  // Death sound
  useEffect(() => {
    if (player.dead) {
      const audio = new Audio("/audios/dead.mp3");
      audio.volume = 0.5;
      audio.play();
    }
  }, [player.dead]);

  // Hurt sound
  useEffect(() => {
    if (player.health < 100 && player.health > 0) {
      const audio = new Audio("/audios/hurt.mp3");
      audio.volume = 0.4;
      audio.play();
    }
  }, [player.health]);

  useFrame((_, delta) => {
    if (!rigidbody.current) return;

    const playerPos = vec3(rigidbody.current.translation());

    // Sync player position to store for enemy AI
    setPlayerPosition({ x: playerPos.x, y: playerPos.y, z: playerPos.z });

    // First person camera
    camera.position.set(
      playerPos.x,
      playerPos.y + WEAPON_OFFSET.y,
      playerPos.z
    );

    // Apply aim rotation
    camera.rotation.order = "YXZ";
    camera.rotation.y = controls.aimYaw;
    camera.rotation.x = -controls.aimPitch;

    if (player.dead) {
      return;
    }

    // Movement relative to camera direction
    const { moveX, moveZ } = controls;
    const isMoving = moveX !== 0 || moveZ !== 0;

    if (isMoving) {
      // Get forward and right vectors from camera
      const forward = new Vector3(0, 0, -1);
      forward.applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();

      const right = new Vector3(1, 0, 0);
      right.applyQuaternion(camera.quaternion);
      right.y = 0;
      right.normalize();

      // Calculate movement direction
      const moveDir = new Vector3();
      moveDir.addScaledVector(forward, -moveZ);
      moveDir.addScaledVector(right, moveX);
      moveDir.normalize();

      const impulse = {
        x: moveDir.x * MOVEMENT_SPEED * delta,
        y: 0,
        z: moveDir.z * MOVEMENT_SPEED * delta,
      };

      rigidbody.current.applyImpulse(impulse, true);
    }

    // Fire
    if (controls.firing) {
      if (Date.now() - lastShoot.current > FIRE_RATE) {
        lastShoot.current = Date.now();

        // Get camera forward direction for bullet
        const direction = new Vector3(0, 0, -1);
        direction.applyQuaternion(camera.quaternion);

        const newBullet = {
          id: player.id + "-" + +new Date(),
          position: {
            x: playerPos.x,
            y: playerPos.y + WEAPON_OFFSET.y,
            z: playerPos.z,
          },
          direction: { x: direction.x, y: direction.y, z: direction.z },
          player: player.id,
        };
        onFire(newBullet);
      }
    }
  });

  return (
    <group {...props}>
      <RigidBody
        ref={rigidbody}
        colliders={false}
        linearDamping={12}
        lockRotations
        type="dynamic"
        onIntersectionEnter={({ other }) => {
          if (
            other.rigidBody.userData.type === "bullet" &&
            other.rigidBody.userData.player !== player.id &&
            player.health > 0
          ) {
            const newHealth = player.health - other.rigidBody.userData.damage;
            if (newHealth <= 0) {
              addDeath();
              setPlayerDead(true);
              setPlayerHealth(0);
              rigidbody.current.setEnabled(false);
              setTimeout(() => {
                spawnRandomly();
                rigidbody.current.setEnabled(true);
                resetPlayer();
              }, 2000);
            } else {
              setPlayerHealth(newHealth);
            }
          }
        }}
      >
        <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]} />
      </RigidBody>

      {/* Directional light following player */}
      <directionalLight
        position={[25, 18, -25]}
        intensity={0.3}
        castShadow={!downgradedPerformance}
        shadow-camera-near={0}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
    </group>
  );
};
