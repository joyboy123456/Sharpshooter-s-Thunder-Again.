import { Environment } from "@react-three/drei";
import { useGameStore } from "../store/gameStore";
import { Bullet } from "./Bullet";
import { BulletHit } from "./BulletHit";
import { CharacterController } from "./CharacterController";
import { Enemy } from "./Enemy";
import { FirstPersonWeapon } from "./FirstPersonWeapon";
import { Map } from "./Map";

export const Experience = ({ downgradedPerformance = false }) => {
  const bullets = useGameStore((state) => state.bullets);
  const hits = useGameStore((state) => state.hits);
  const enemies = useGameStore((state) => state.enemies);
  const addBullet = useGameStore((state) => state.addBullet);
  const onBulletHit = useGameStore((state) => state.onBulletHit);
  const removeHit = useGameStore((state) => state.removeHit);

  const onFire = (bullet) => {
    addBullet(bullet);
  };

  const onHit = (bulletId, position) => {
    onBulletHit(bulletId, position);
  };

  const onHitEnded = (hitId) => {
    removeHit(hitId);
  };

  return (
    <>
      <Map />
      <CharacterController
        onFire={onFire}
        downgradedPerformance={downgradedPerformance}
      />
      <FirstPersonWeapon />
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} onFire={onFire} />
      ))}
      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          {...bullet}
          onHit={(position) => onHit(bullet.id, position)}
        />
      ))}
      {hits.map((hit) => (
        <BulletHit key={hit.id} {...hit} onEnded={() => onHitEnded(hit.id)} />
      ))}
      <Environment files="/hdri/venice_sunset_1k.hdr" />
    </>
  );
};
