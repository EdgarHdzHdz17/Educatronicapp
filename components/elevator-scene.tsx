import Constants from 'expo-constants';
import { useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';

import { ThemedText } from '@/components/themed-text';
import { MAX_FLOOR, MIN_FLOOR } from '@/constants/elevator';

const FLOOR_HEIGHT = 1.35;
const BUILDING_WIDTH = 3.6;
const BUILDING_DEPTH = 2.4;
const WALL_THICKNESS = 0.12;
const SHAFT_WIDTH = 1.1;

type ElevatorSceneProps = {
  currentFloor?: number;
  doorOpen?: boolean;
};

function floorCenterY(floor: number) {
  return (floor - MIN_FLOOR) * FLOOR_HEIGHT + FLOOR_HEIGHT / 2;
}

function buildingHeight() {
  return (MAX_FLOOR - MIN_FLOOR + 1) * FLOOR_HEIGHT;
}

function buildingCenterY() {
  return buildingHeight() / 2;
}

function patchExpoGlContext(state: { gl: { getContext: () => WebGLRenderingContext } }) {
  const context = state.gl.getContext();
  const pixelStorei = context.pixelStorei.bind(context);
  context.pixelStorei = (...args: Parameters<WebGLRenderingContext['pixelStorei']>) => {
    const [parameter] = args;
    if (parameter === context.UNPACK_FLIP_Y_WEBGL) {
      return pixelStorei(...args);
    }
    return undefined;
  };
}

function CameraRig() {
  const { camera } = useThree();
  const centerY = buildingCenterY();

  useLayoutEffect(() => {
    camera.position.set(5.5, centerY + 1.2, 7.5);
    camera.lookAt(0, centerY, 0);
    if ('updateProjectionMatrix' in camera && typeof camera.updateProjectionMatrix === 'function') {
      camera.updateProjectionMatrix();
    }
  }, [camera, centerY]);

  useFrame(() => {
    camera.lookAt(0, centerY, 0);
  });

  return null;
}

type FloorLevelProps = {
  floor: number;
  highlighted: boolean;
};

function FloorLevel({ floor, highlighted }: FloorLevelProps) {
  const y = floorCenterY(floor);
  const wallColor = highlighted ? '#6fa8e8' : '#4a6278';
  const slabColor = highlighted ? '#8ec0ff' : '#5a738a';
  const windowColor = highlighted ? '#ffe566' : '#a8d4f5';

  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, -FLOOR_HEIGHT / 2 + 0.04, 0]}>
        <boxGeometry args={[BUILDING_WIDTH, 0.08, BUILDING_DEPTH]} />
        <meshBasicMaterial color={slabColor} />
      </mesh>

      <mesh position={[0, 0, BUILDING_DEPTH / 2]}>
        <boxGeometry args={[BUILDING_WIDTH, FLOOR_HEIGHT - 0.1, WALL_THICKNESS]} />
        <meshBasicMaterial color={wallColor} />
      </mesh>

      {[-1.05, 0, 1.05].map((x) => (
        <mesh key={x} position={[x, 0.05, BUILDING_DEPTH / 2 + WALL_THICKNESS / 2 + 0.01]}>
          <boxGeometry args={[0.55, 0.55, 0.04]} />
          <meshBasicMaterial color={windowColor} />
        </mesh>
      ))}

      <mesh position={[0, 0, -BUILDING_DEPTH / 2]}>
        <boxGeometry args={[BUILDING_WIDTH, FLOOR_HEIGHT - 0.1, WALL_THICKNESS]} />
        <meshBasicMaterial color="#3a5060" />
      </mesh>

      <mesh position={[BUILDING_WIDTH / 2, 0, 0]}>
        <boxGeometry args={[WALL_THICKNESS, FLOOR_HEIGHT - 0.1, BUILDING_DEPTH]} />
        <meshBasicMaterial color="#425a6c" />
      </mesh>

      <mesh position={[BUILDING_WIDTH / 2 + 0.06, 0, BUILDING_DEPTH / 2 - 0.35]}>
        <boxGeometry args={[0.08, 0.28, 0.18]} />
        <meshBasicMaterial color={highlighted ? '#ffd166' : '#99aabb'} />
      </mesh>
    </group>
  );
}

function ElevatorShaft3D() {
  const height = buildingHeight();
  const shaftX = -BUILDING_WIDTH / 2 + SHAFT_WIDTH / 2 + 0.15;

  return (
    <group>
      <mesh position={[shaftX, buildingCenterY(), 0]}>
        <boxGeometry args={[SHAFT_WIDTH, height, BUILDING_DEPTH - 0.4]} />
        <meshBasicMaterial color="#1a2330" />
      </mesh>

      {Array.from({ length: MAX_FLOOR - MIN_FLOOR + 1 }, (_, index) => {
        const floor = MIN_FLOOR + index;
        return (
          <mesh
            key={floor}
            position={[shaftX + SHAFT_WIDTH / 2 + 0.04, floorCenterY(floor), BUILDING_DEPTH / 2 - 0.2]}
          >
            <boxGeometry args={[0.05, 0.06, 0.25]} />
            <meshBasicMaterial color="#ccd6e0" />
          </mesh>
        );
      })}
    </group>
  );
}

function Building3D({ currentFloor = MIN_FLOOR }: ElevatorSceneProps) {
  const floors = useMemo(
    () => Array.from({ length: MAX_FLOOR - MIN_FLOOR + 1 }, (_, index) => MIN_FLOOR + index),
    [],
  );

  return (
    <group>
      {floors.map((floor) => (
        <FloorLevel key={floor} floor={floor} highlighted={floor === currentFloor} />
      ))}
      <ElevatorShaft3D />
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.4, 0.12, BUILDING_DEPTH + 0.4]} />
        <meshBasicMaterial color="#2a3542" />
      </mesh>
      <mesh position={[0, buildingHeight() + 0.08, 0]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.2, 0.16, BUILDING_DEPTH + 0.2]} />
        <meshBasicMaterial color="#2f3d4d" />
      </mesh>
    </group>
  );
}

function SceneContent(props: ElevatorSceneProps) {
  const { scene } = useThree();

  useLayoutEffect(() => {
    scene.background = null;
  }, [scene]);

  return (
    <>
      <CameraRig />
      <ambientLight intensity={1.2} />
      <Building3D {...props} />
    </>
  );
}

function BuildingCanvas3D(props: ElevatorSceneProps) {
  return (
    <Canvas
      style={styles.canvas}
      frameloop="always"
      flat
      camera={{ fov: 38, near: 0.1, far: 100, position: [5.5, buildingCenterY() + 1.2, 7.5] }}
      onCreated={(state) => {
        patchExpoGlContext(state);
        state.scene.background = null;
        state.gl.setClearColor('#1a2744', 1);
      }}
    >
      <SceneContent {...props} />
    </Canvas>
  );
}

function Building2D({ currentFloor = MIN_FLOOR }: ElevatorSceneProps) {
  const floors = useMemo(
    () =>
      Array.from({ length: MAX_FLOOR - MIN_FLOOR + 1 }, (_, index) => MAX_FLOOR - index),
    [],
  );

  return (
    <View style={styles.building2d}>
      <View style={styles.shaftColumn}>
        {floors.map((floor) => (
          <View key={floor} style={styles.shaftFloor}>
            <View
              style={[
                styles.shaftDoor,
                floor === currentFloor && styles.shaftDoorActive,
              ]}
            />
          </View>
        ))}
      </View>

      <View style={styles.floorsColumn}>
        {floors.map((floor) => {
          const highlighted = floor === currentFloor;
          return (
            <View
              key={floor}
              style={[styles.floorRow, highlighted && styles.floorRowActive]}
            >
              <ThemedText style={[styles.floorLabel, highlighted && styles.floorLabelActive]}>
                {floor}
              </ThemedText>
              <View style={styles.windowsRow}>
                {[0, 1, 2].map((windowIndex) => (
                  <View
                    key={windowIndex}
                    style={[styles.window, highlighted && styles.windowActive]}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const useNative3D = Constants.isDevice;

export function ElevatorScene(props: ElevatorSceneProps) {
  return (
    <View style={styles.canvasContainer}>
      {useNative3D ? <BuildingCanvas3D {...props} /> : <Building2D {...props} />}
    </View>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    width: '100%',
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a2744',
  },
  canvas: {
    flex: 1,
    width: '100%',
  },
  building2d: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  shaftColumn: {
    width: 52,
    backgroundColor: '#121a28',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
  },
  shaftFloor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shaftDoor: {
    width: 28,
    height: '70%',
    borderRadius: 3,
    backgroundColor: '#2a3548',
    borderWidth: 1,
    borderColor: '#3d4f66',
  },
  shaftDoorActive: {
    backgroundColor: '#4a90d9',
    borderColor: '#7eb8ff',
  },
  floorsColumn: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 4,
  },
  floorRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#2a3a50',
    borderRadius: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#3a5068',
  },
  floorRowActive: {
    backgroundColor: '#3d5f8a',
    borderColor: '#7eb8ff',
  },
  floorLabel: {
    width: 18,
    fontSize: 13,
    fontWeight: '700',
    color: '#8899aa',
    textAlign: 'center',
  },
  floorLabelActive: {
    color: '#ffe566',
  },
  windowsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  window: {
    width: 22,
    height: 18,
    borderRadius: 2,
    backgroundColor: '#6a9ec8',
  },
  windowActive: {
    backgroundColor: '#ffe566',
  },
});
