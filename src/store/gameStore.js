import { create } from "zustand";

export const useGameStore = create((set, get) => ({
  // Player state
  player: {
    id: "player",
    health: 100,
    kills: 0,
    deaths: 0,
    dead: false,
    position: { x: 0, y: 0, z: 0 },
  },

  // Controls state
  controls: {
    moveX: 0,
    moveZ: 0,
    aimYaw: 0,
    aimPitch: 0,
    firing: false,
  },

  // Control actions
  setMove: (moveX, moveZ) =>
    set((state) => ({
      controls: { ...state.controls, moveX, moveZ },
    })),

  setAim: (aimYaw, aimPitch) =>
    set((state) => ({
      controls: { ...state.controls, aimYaw, aimPitch },
    })),

  addAimDelta: (deltaYaw, deltaPitch) =>
    set((state) => ({
      controls: {
        ...state.controls,
        aimYaw: state.controls.aimYaw + deltaYaw,
        aimPitch: Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, state.controls.aimPitch + deltaPitch)
        ),
      },
    })),

  setFiring: (firing) =>
    set((state) => ({
      controls: { ...state.controls, firing },
    })),

  // Bullets
  bullets: [],

  // Bullet hits
  hits: [],

  // Enemies
  enemies: [
    { id: "enemy-0", health: 100, dead: false, position: { x: 5, y: 0, z: 5 } },
    { id: "enemy-1", health: 100, dead: false, position: { x: -5, y: 0, z: 5 } },
    { id: "enemy-2", health: 100, dead: false, position: { x: 5, y: 0, z: -5 } },
    { id: "enemy-3", health: 100, dead: false, position: { x: -5, y: 0, z: -5 } },
    { id: "enemy-4", health: 100, dead: false, position: { x: 0, y: 0, z: 8 } },
  ],

  // Enemy actions
  setEnemyHealth: (enemyId, health) =>
    set((state) => ({
      enemies: state.enemies.map((e) =>
        e.id === enemyId ? { ...e, health } : e
      ),
    })),

  setEnemyDead: (enemyId, dead) =>
    set((state) => ({
      enemies: state.enemies.map((e) =>
        e.id === enemyId ? { ...e, dead } : e
      ),
    })),

  setEnemyPosition: (enemyId, position) =>
    set((state) => ({
      enemies: state.enemies.map((e) =>
        e.id === enemyId ? { ...e, position } : e
      ),
    })),

  respawnEnemy: (enemyId) =>
    set((state) => ({
      enemies: state.enemies.map((e) =>
        e.id === enemyId ? { ...e, health: 100, dead: false } : e
      ),
    })),

  // Player actions
  setPlayerPosition: (position) =>
    set((state) => ({
      player: { ...state.player, position },
    })),

  setPlayerHealth: (health) =>
    set((state) => ({
      player: { ...state.player, health },
    })),

  setPlayerDead: (dead) =>
    set((state) => ({
      player: { ...state.player, dead },
    })),

  addKill: () =>
    set((state) => ({
      player: { ...state.player, kills: state.player.kills + 1 },
    })),

  addDeath: () =>
    set((state) => ({
      player: { ...state.player, deaths: state.player.deaths + 1 },
    })),

  resetPlayer: () =>
    set((state) => ({
      player: {
        ...state.player,
        health: 100,
        dead: false,
      },
    })),

  // Bullet actions
  addBullet: (bullet) =>
    set((state) => ({
      bullets: [...state.bullets, bullet],
    })),

  removeBullet: (bulletId) =>
    set((state) => ({
      bullets: state.bullets.filter((b) => b.id !== bulletId),
    })),

  // Hit actions
  addHit: (hit) =>
    set((state) => ({
      hits: [...state.hits, hit],
    })),

  removeHit: (hitId) =>
    set((state) => ({
      hits: state.hits.filter((h) => h.id !== hitId),
    })),

  // Combined action for bullet hit
  onBulletHit: (bulletId, position) => {
    const { removeBullet, addHit } = get();
    removeBullet(bulletId);
    addHit({ id: bulletId, position });
  },
}));
