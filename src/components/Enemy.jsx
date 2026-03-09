import { Billboard, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { useGameStore } from "../store/gameStore";
import { CharacterSoldier } from "./CharacterSoldier";

const MOVEMENT_SPEED = 100;
const FIRE_RATE = 1000;
const DETECTION_RANGE = 15;
const FIRE_RANGE = 12;

export const Enemy = ({ enemy, onFire }) => {
  const rigidbody = useRef();
  const character = useRef();
  const lastShoot = useRef(0);
  const [animation, setAnimation] = useState("Idle");

  const scene = useThree((state) => state.scene);
  const player = useGameStore((state) => state.player);
  const setEnemyHealth = useGameStore((state) => state.setEnemyHealth);
  const setEnemyDead = useGameStore((state) => state.setEnemyDead);
  const respawnEnemy = useGameStore((state) => state.respawnEnemy);
  const addKill = useGameStore((state) => state.addKill);

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
    if (spawns.length > 0 && rigidbody.current) {
      const spawnPos =
        spawns[Math.floor(Math.random() * spawns.length)].position;
      rigidbody.current.setTranslation(spawnPos);
    }
  };

  useEffect(() => {
    spawnRandomly();
  }, []);

  useEffect(() => {
    if (enemy.dead) {
      const audio = new Audio("/audios/dead.mp3");
      audio.volume = 0.3;
      audio.play();
    }
  }, [enemy.dead]);

  useFrame((_, delta) => {
    if (!rigidbody.current || enemy.dead || player.dead) {
      if (enemy.dead) {
        setAnimation("Death");
      }
      return;
    }

    const enemyPos = vec3(rigidbody.current.translation());
    const playerPos = new Vector3(
      player.position.x,
      player.position.y,
      player.position.z
    );

    // Calculate distance to player
    const dirToPlayer = new Vector3().subVectors(playerPos, enemyPos);
    const distToPlayer = dirToPlayer.length();

    // AI behavior
    if (distToPlayer < DETECTION_RANGE) {
      // Look at player
      const angle = Math.atan2(dirToPlayer.x, dirToPlayer.z);
      if (character.current) {
        character.current.rotation.y = angle;
      }

      if (distToPlayer > FIRE_RANGE) {
        // Move towards player
        setAnimation("Run");
        const moveDir = dirToPlayer.normalize();
        const impulse = {
          x: moveDir.x * MOVEMENT_SPEED * delta,
          y: 0,
          z: moveDir.z * MOVEMENT_SPEED * delta,
        };
        rigidbody.current.applyImpulse(impulse, true);
      } else {
        // In range - fire at player
        setAnimation("Idle_Shoot");

        if (Date.now() - lastShoot.current > FIRE_RATE) {
          lastShoot.current = Date.now();

          const direction = dirToPlayer.normalize();
          const newBullet = {
            id: enemy.id + "-" + +new Date(),
            position: {
              x: enemyPos.x,
              y: enemyPos.y + 1.4,
              z: enemyPos.z,
            },
            direction: { x: direction.x, y: 0, z: direction.z },
            player: enemy.id,
          };
          onFire(newBullet);
        }
      }
    } else {
      // Idle patrol behavior
      setAnimation("Idle");
    }
  });

  return (
    <group>
      <RigidBody
        ref={rigidbody}
        colliders={false}
        linearDamping={12}
        lockRotations
        type="dynamic"
        position={[enemy.position.x, enemy.position.y, enemy.position.z]}
        onIntersectionEnter={({ other }) => {
          if (
            other.rigidBody.userData?.type === "bullet" &&
            other.rigidBody.userData?.player === "player" &&
            enemy.health > 0
          ) {
            const newHealth = enemy.health - other.rigidBody.userData.damage;
            if (newHealth <= 0) {
              setEnemyDead(enemy.id, true);
              setEnemyHealth(enemy.id, 0);
              addKill();
              rigidbody.current.setEnabled(false);
              setTimeout(() => {
                spawnRandomly();
                rigidbody.current.setEnabled(true);
                respawnEnemy(enemy.id);
              }, 3000);
            } else {
              setEnemyHealth(enemy.id, newHealth);
            }
          }
        }}
      >
        <EnemyInfo health={enemy.health} />
        <group ref={character}>
          <CharacterSoldier
            color="#8B0000"
            animation={animation}
            weapon="AK"
          />
        </group>
        <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]} />
      </RigidBody>
    </group>
  );
};

const EnemyInfo = ({ health }) => {
  return (
    <Billboard position-y={2.5}>
      <Text position-y={0.36} fontSize={0.4}>
        Enemy
        <meshBasicMaterial color="#8B0000" />
      </Text>
      <mesh position-z={-0.1}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="black" transparent opacity={0.5} />
      </mesh>
      <mesh scale-x={health / 100} position-x={-0.5 * (1 - health / 100)}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </Billboard>
  );
};
