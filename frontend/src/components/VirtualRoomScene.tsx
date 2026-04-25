'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useThree, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Text, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';
import type { RoomDimensions, PlacedFurniture } from '@/app/virtual-room/page';

// ─── Room Shell ───────────────────────────────────────────────────────────────
function Room({ room }: { room: RoomDimensions }) {
  const { width, length, height } = room;
  const wallMat = <meshStandardMaterial color="#f5f0e8" roughness={0.9} />;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#dfd1b8" roughness={0.95} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, height / 2, -length / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        {wallMat}
      </mesh>
      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, height]} />
        {wallMat}
      </mesh>
      {/* Right wall (semi-transparent for visibility) */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#ede4d3" roughness={0.9} transparent opacity={0.4} />
      </mesh>

      {/* Room dimension labels */}
      <Text position={[0, 0.05, length / 2 + 0.3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="#86654a">
        {`${width}m`}
      </Text>
      <Text position={[width / 2 + 0.3, 0.05, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} fontSize={0.2} color="#86654a">
        {`${length}m`}
      </Text>
    </group>
  );
}

// ─── Furniture Box ────────────────────────────────────────────────────────────
function FurnitureMesh({
  piece,
  isSelected,
  onSelect,
  onDrag,
  roomDimensions,
}: {
  piece: PlacedFurniture;
  isSelected: boolean;
  onSelect: () => void;
  onDrag: (pos: [number, number, number]) => void;
  roomDimensions: RoomDimensions;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree();
  const [dragging, setDragging] = useState(false);

  const dims = piece.dimensions || { width: 1, depth: 0.8, height: 0.8 };
  const scale = piece.scale;
  const w = dims.width * scale;
  const d = (dims.depth || dims.width) * scale;
  const h = dims.height * scale;

  const clampPos = (pos: [number, number, number]): [number, number, number] => {
    const hw = roomDimensions.width / 2 - w / 2;
    const hl = roomDimensions.length / 2 - d / 2;
    return [
      Math.max(-hw, Math.min(hw, pos[0])),
      pos[1],
      Math.max(-hl, Math.min(hl, pos[2])),
    ];
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect();
    setDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    setDragging(false);
    gl.domElement.style.cursor = 'auto';
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return;
    e.stopPropagation();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(
      (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.clientY / gl.domElement.clientHeight) * 2 + 1
    ), camera);
    const target = new THREE.Vector3();
    ray.ray.intersectPlane(plane, target);
    if (target) onDrag(clampPos([target.x, h / 2, target.z]));
  };

  return (
    <mesh
      ref={meshRef}
      position={[piece.position[0], h / 2, piece.position[2]]}
      rotation={[0, (piece.rotation * Math.PI) / 180, 0]}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => { if (!dragging) gl.domElement.style.cursor = 'grab'; }}
      onPointerLeave={() => { if (!dragging) gl.domElement.style.cursor = 'auto'; }}
    >
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial
        color={piece.color}
        roughness={0.7}
        metalness={0.1}
        emissive={isSelected ? '#4d7a50' : '#000000'}
        emissiveIntensity={isSelected ? 0.15 : 0}
      />
      {/* Selection outline box */}
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(w + 0.03, h + 0.03, d + 0.03)]} />
          <lineBasicMaterial color="#4d7a50" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({
  room,
  placedFurniture,
  selectedId,
  onSelect,
  onUpdate,
}: {
  room: RoomDimensions;
  placedFurniture: PlacedFurniture[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, changes: Partial<PlacedFurniture>) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-4, 6, -4]} intensity={0.4} />

      <Room room={room} />

      {placedFurniture.map((piece) => (
        <FurnitureMesh
          key={piece.id}
          piece={piece}
          isSelected={selectedId === piece.id}
          onSelect={() => onSelect(piece.id)}
          onDrag={(pos) => onUpdate(piece.id, { position: pos })}
          roomDimensions={room}
        />
      ))}

      <Grid
        position={[0, 0.001, 0]}
        args={[room.width, room.length]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#cdb897"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#a07f5a"
        fadeDistance={25}
        infiniteGrid={false}
      />

      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={2}
        maxDistance={20}
      />

      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport axisColors={['#e05c5c', '#4d7a50', '#5c7ae0']} labelColor="white" />
      </GizmoHelper>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function VirtualRoomScene({
  room,
  placedFurniture,
  selectedId,
  onSelect,
  onUpdate,
}: {
  room: RoomDimensions;
  placedFurniture: PlacedFurniture[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, changes: Partial<PlacedFurniture>) => void;
}) {
  return (
    <Canvas
      shadows
      camera={{ position: [room.width * 0.8, room.length * 0.6, room.length * 0.8], fov: 55 }}
      style={{ background: 'linear-gradient(135deg, #f5f0e8 0%, #e1eae1 100%)' }}
      onPointerMissed={() => onSelect(null)}
    >
      <Scene
        room={room}
        placedFurniture={placedFurniture}
        selectedId={selectedId}
        onSelect={onSelect}
        onUpdate={onUpdate}
      />
    </Canvas>
  );
}
