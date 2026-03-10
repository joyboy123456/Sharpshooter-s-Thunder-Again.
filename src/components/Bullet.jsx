import { RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { MeshBasicMaterial } from "three";

const BULLET_SPEED = 40;

const bulletMaterial = new MeshBasicMaterial({
  color: "hotpink",
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

export const Bullet = ({ player, direction, position, onHit }) => {
  const rigidbody = useRef();

  useEffect(() => {
    const audio = new Audio("/audios/rifle.mp3");
    audio.play();

    const velocity = {
      x: direction.x * BULLET_SPEED,
      y: direction.y * BULLET_SPEED,
      z: direction.z * BULLET_SPEED,
    };

    rigidbody.current.setLinvel(velocity, true);
  }, []);

  return (
    <group position={[position.x, position.y, position.z]}>
      <RigidBody
        ref={rigidbody}
        gravityScale={0}
        onIntersectionEnter={(e) => {
          if (e.other.rigidBody.userData?.type !== "bullet") {
            rigidbody.current.setEnabled(false);
            onHit(vec3(rigidbody.current.translation()));
          }
        }}
        sensor
        userData={{
          type: "bullet",
          player,
          damage: 10,
        }}
      >
        <mesh material={bulletMaterial} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
      </RigidBody>
    </group>
  );
};
