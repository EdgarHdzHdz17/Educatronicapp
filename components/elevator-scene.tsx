import Constants from 'expo-constants';
import { useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Polygon, Rect } from 'react-native-svg';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';

import { MAX_FLOOR, MIN_FLOOR } from '@/constants/elevator';

const FLOOR_COUNT = MAX_FLOOR - MIN_FLOOR + 1;
const FLOOR_HEIGHT = 0.78;
const BUILDING_HEIGHT = FLOOR_COUNT * FLOOR_HEIGHT;
const MAIN_WIDTH = 1.55;
const MAIN_DEPTH = 1.1;

const COLORS = {
  wall: '#E8E8E8',
  wallSide: '#D0D0D0',
  roof: '#4A6D7C',
  roofSide: '#3A5866',
  window: '#5A4D4A',
  sky: '#1a2332',
} as const;

const WINDOW_COLUMNS = 2;

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

function floorLocalY(index: number) {
  const mid = (FLOOR_COUNT - 1) / 2;
  return (index - mid) * FLOOR_HEIGHT;
}

function CameraRig() {
  const { camera } = useThree();
  const lookY = BUILDING_HEIGHT * 0.45;

  useLayoutEffect(() => {
    camera.position.set(3.6, BUILDING_HEIGHT * 0.5, 5.2);
    camera.lookAt(0, lookY, 0);
    if ('updateProjectionMatrix' in camera && typeof camera.updateProjectionMatrix === 'function') {
      camera.updateProjectionMatrix();
    }
  }, [camera, lookY]);

  useFrame(() => {
    camera.lookAt(0, lookY, 0);
  });

  return null;
}

type WindowProps = {
  position: [number, number, number];
  size: [number, number];
};

function Window({ position, size }: WindowProps) {
  const [w, h] = size;
  return (
    <mesh position={position}>
      <boxGeometry args={[w, h, 0.04]} />
      <meshBasicMaterial color={COLORS.window} />
    </mesh>
  );
}

function MainBuilding() {
  const floors = useMemo(
    () => Array.from({ length: FLOOR_COUNT }, (_, index) => index),
    [],
  );
  const windowColumns = [-0.28, 0.28];
  const windowW = 0.32;
  const windowH = 0.44;

  return (
    <group position={[0, BUILDING_HEIGHT / 2, 0]}>
      <mesh>
        <boxGeometry args={[MAIN_WIDTH, BUILDING_HEIGHT, MAIN_DEPTH]} />
        <meshBasicMaterial color={COLORS.wall} />
      </mesh>
      <mesh position={[MAIN_WIDTH / 2, 0, 0]}>
        <boxGeometry args={[0.04, BUILDING_HEIGHT, MAIN_DEPTH]} />
        <meshBasicMaterial color={COLORS.wallSide} />
      </mesh>

      {floors.flatMap((floorIndex) =>
        windowColumns.map((x, columnIndex) => (
          <Window
            key={`${floorIndex}-${columnIndex}`}
            position={[x, floorLocalY(floorIndex), MAIN_DEPTH / 2 + 0.02]}
            size={[windowW, windowH]}
          />
        )),
      )}
    </group>
  );
}

function Roof() {
  const roofWidth = MAIN_WIDTH + 0.2;
  const roofDepth = MAIN_DEPTH + 0.2;

  return (
    <group position={[0, BUILDING_HEIGHT + 0.08, 0]}>
      <mesh>
        <boxGeometry args={[roofWidth, 0.12, roofDepth]} />
        <meshBasicMaterial color={COLORS.roof} />
      </mesh>
      <mesh position={[roofWidth / 2, 0, 0]}>
        <boxGeometry args={[0.04, 0.12, roofDepth]} />
        <meshBasicMaterial color={COLORS.roofSide} />
      </mesh>
    </group>
  );
}

function BuildingScene3D() {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={1.2} />
      <MainBuilding />
      <Roof />
    </>
  );
}

function BuildingSceneSvg() {
  const W = 320;
  const H = 300;

  // Profundidad 3D (compartida en todas las caras)
  const depthX = 16;
  const depthY = 10;

  // Alturas alineadas
  const roofH = 12;
  const roofTop = 22;
  const bodyTop = roofTop + roofH;
  const bodyBottom = 282;
  const bodyH = bodyBottom - bodyTop;

  // Anchos del edificio
  const mainW = 148;
  const left = Math.round((W - mainW - depthX * 0.5) / 2);
  const mainX = left;
  const frontRight = mainX + mainW;
  const backLeft = left + depthX;
  const backRight = frontRight + depthX;

  const floorH = bodyH / FLOOR_COUNT;
  const floors = Array.from({ length: FLOOR_COUNT }, (_, i) => i);

  const windowW = 36;
  const windowH = floorH * 0.5;
  const windowGap = (mainW - windowW * WINDOW_COLUMNS) / (WINDOW_COLUMNS + 1);

  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
      <Rect x={0} y={0} width={W} height={H} fill={COLORS.sky} />

      {/* cara lateral derecha */}
      <Polygon
        points={`${frontRight},${bodyTop} ${backRight},${bodyTop - depthY} ${backRight},${bodyBottom} ${frontRight},${bodyBottom}`}
        fill={COLORS.wallSide}
      />

      {/* cuerpo frontal */}
      <Rect x={mainX} y={bodyTop} width={mainW} height={bodyH} fill={COLORS.wall} />

      {/* techo - cara superior */}
      <Polygon
        points={`${left},${roofTop} ${frontRight},${roofTop} ${backRight},${roofTop - depthY} ${backLeft},${roofTop - depthY}`}
        fill={COLORS.roof}
      />

      {/* techo - frente */}
      <Rect x={left} y={roofTop} width={mainW} height={roofH} fill={COLORS.roof} />

      {/* techo - lateral derecho */}
      <Polygon
        points={`${frontRight},${roofTop} ${backRight},${roofTop - depthY} ${backRight},${bodyTop - depthY} ${frontRight},${bodyTop}`}
        fill={COLORS.roofSide}
      />

      {/* ventanas edificio principal */}
      {floors.map((floorIndex) => {
        const y = bodyTop + floorIndex * floorH + (floorH - windowH) / 2;
        return [0, 1].map((col) => {
          const x = mainX + windowGap + col * (windowW + windowGap);
          return (
            <Rect
              key={`w-${floorIndex}-${col}`}
              x={x}
              y={y}
              width={windowW}
              height={windowH}
              fill={COLORS.window}
              rx={1}
            />
          );
        });
      })}

      {/* separadores de piso */}
      {floors.slice(1).map((floorIndex) => {
        const y = bodyTop + floorIndex * floorH;
        return (
          <Rect key={`line-${floorIndex}`} x={mainX} y={y} width={mainW} height={1} fill="#D8D8D8" />
        );
      })}
    </Svg>
  );
}

function BuildingCanvas3D() {
  return (
    <Canvas
      style={styles.canvas}
      frameloop="always"
      flat
      camera={{ fov: 34, near: 0.1, far: 100, position: [3.6, BUILDING_HEIGHT * 0.5, 5.2] }}
      onCreated={(state) => {
        patchExpoGlContext(state);
        state.gl.setClearColor(COLORS.sky, 1);
      }}
    >
      <BuildingScene3D />
    </Canvas>
  );
}

export function ElevatorScene() {
  return (
    <View style={styles.container}>
      {Constants.isDevice ? <BuildingCanvas3D /> : <BuildingSceneSvg />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.sky,
  },
  canvas: {
    flex: 1,
    width: '100%',
  },
});
