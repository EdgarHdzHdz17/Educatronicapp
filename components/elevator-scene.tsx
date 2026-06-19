import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import type { Group, Mesh } from 'three';

import { MAX_FLOOR, MIN_FLOOR } from '@/constants/elevator';

const FLOOR_HEIGHT = 1.2;
const SHAFT_WIDTH = 1.6;
const CAB_WIDTH = 1.1;
const CAB_DEPTH = 0.9;
const CAB_HEIGHT = 0.95;

type ElevatorSceneProps = {
  currentFloor: number;
  doorOpen?: boolean;
};

function floorToY(floor: number) {
  return (floor - MIN_FLOOR) * FLOOR_HEIGHT;
}

function ElevatorCab({ currentFloor, doorOpen = false }: ElevatorSceneProps) {
  const cabRef = useRef<Group>(null);
  const leftDoorRef = useRef<Mesh>(null);
  const rightDoorRef = useRef<Mesh>(null);
  const targetY = floorToY(currentFloor);
  const doorOffset = doorOpen ? CAB_WIDTH * 0.22 : 0;

  useFrame((_, delta) => {
    if (!cabRef.current) return;

    cabRef.current.position.y += (targetY - cabRef.current.position.y) * Math.min(delta * 4, 1);

    if (leftDoorRef.current) {
      leftDoorRef.current.position.x += (-CAB_WIDTH * 0.25 - doorOffset - leftDoorRef.current.position.x) * Math.min(delta * 6, 1);
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x += (CAB_WIDTH * 0.25 + doorOffset - rightDoorRef.current.position.x) * Math.min(delta * 6, 1);
    }
  });

  return (
    <group ref={cabRef} position={[0, floorToY(MIN_FLOOR), 0]}>
      <mesh>
        <boxGeometry args={[CAB_WIDTH, CAB_HEIGHT, CAB_DEPTH]} />
        <meshStandardMaterial color="#4a90d9" metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh ref={leftDoorRef} position={[-CAB_WIDTH * 0.25, 0, CAB_DEPTH / 2 + 0.02]}>
        <boxGeometry args={[CAB_WIDTH * 0.45, CAB_HEIGHT * 0.85, 0.06]} />
        <meshStandardMaterial color="#c8d8ea" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh ref={rightDoorRef} position={[CAB_WIDTH * 0.25, 0, CAB_DEPTH / 2 + 0.02]}>
        <boxGeometry args={[CAB_WIDTH * 0.45, CAB_HEIGHT * 0.85, 0.06]} />
        <meshStandardMaterial color="#c8d8ea" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Shaft() {
  const shaftHeight = (MAX_FLOOR - MIN_FLOOR) * FLOOR_HEIGHT + CAB_HEIGHT;
  const centerY = shaftHeight / 2 - CAB_HEIGHT / 2;

  return (
    <group>
      <mesh position={[0, centerY, 0]}>
        <boxGeometry args={[SHAFT_WIDTH, shaftHeight + 0.4, CAB_DEPTH + 0.6]} />
        <meshStandardMaterial color="#2c3440" transparent opacity={0.15} />
      </mesh>
      {Array.from({ length: MAX_FLOOR - MIN_FLOOR + 1 }, (_, index) => {
        const floor = MIN_FLOOR + index;
        return (
          <mesh key={floor} position={[SHAFT_WIDTH / 2 + 0.08, floorToY(floor), 0]}>
            <boxGeometry args={[0.06, 0.04, CAB_DEPTH + 0.2]} />
            <meshStandardMaterial color="#8899aa" />
          </mesh>
        );
      })}
    </group>
  );
}

function SceneContent(props: ElevatorSceneProps) {
  const shaftHeight = (MAX_FLOOR - MIN_FLOOR) * FLOOR_HEIGHT + CAB_HEIGHT;

  return (
    <>
      <color attach="background" args={['#1a2332']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, shaftHeight, 6]} intensity={1.1} />
      <Shaft />
      <ElevatorCab {...props} />
    </>
  );
}

export function ElevatorScene(props: ElevatorSceneProps) {
  return (
    <View style={styles.canvasContainer}>
      <Canvas camera={{ position: [3.2, shaftCenterY(), 4.5], fov: 42 }}>
        <SceneContent {...props} />
      </Canvas>
    </View>
  );
}

function shaftCenterY() {
  return ((MAX_FLOOR - MIN_FLOOR) * FLOOR_HEIGHT) / 2;
}

const styles = StyleSheet.create({
  canvasContainer: {
    height: 260,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a2332',
  },
});
