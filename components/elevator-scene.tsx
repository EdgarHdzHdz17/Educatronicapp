import Constants from 'expo-constants';
import { useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Polygon, Rect } from 'react-native-svg';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';

import { MAX_FLOOR, MIN_FLOOR } from '@/constants/elevator';

const FLOOR_COUNT = MAX_FLOOR - MIN_FLOOR + 1;
const FLOOR_HEIGHT = 0.62;
const BUILDING_HEIGHT = FLOOR_COUNT * FLOOR_HEIGHT;
const MAIN_WIDTH = 2.1;
const MAIN_DEPTH = 1.2;
const ANNEX_WIDTH = 0.48;

const COLORS = {
  wall: '#E8E8E8',
  wallSide: '#D0D0D0',
  roof: '#4A6D7C',
  roofSide: '#3A5866',
  yellow: '#F2D024',
  yellowSide: '#D4B820',
  window: '#5A4D4A',
  sky: '#29A6FF',
} as const;

const WINDOW_COLUMNS = 2;

const BUILDING_CENTER_X = -ANNEX_WIDTH / 2;

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
    camera.lookAt(BUILDING_CENTER_X, lookY, 0);
    if ('updateProjectionMatrix' in camera && typeof camera.updateProjectionMatrix === 'function') {
      camera.updateProjectionMatrix();
    }
  }, [camera, lookY]);

  useFrame(() => {
    camera.lookAt(BUILDING_CENTER_X, lookY, 0);
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
  const windowColumns = [-0.38, 0.38];
  const windowW = 0.42;
  const windowH = 0.36;

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

function YellowAnnex() {
  const annexX = -(MAIN_WIDTH / 2 + ANNEX_WIDTH / 2);
  const floors = useMemo(
    () => Array.from({ length: FLOOR_COUNT }, (_, index) => index),
    [],
  );

  return (
    <group position={[annexX, BUILDING_HEIGHT / 2, 0]}>
      <mesh>
        <boxGeometry args={[ANNEX_WIDTH, BUILDING_HEIGHT, MAIN_DEPTH]} />
        <meshBasicMaterial color={COLORS.yellow} />
      </mesh>
      <mesh position={[ANNEX_WIDTH / 2, 0, 0]}>
        <boxGeometry args={[0.04, BUILDING_HEIGHT, MAIN_DEPTH]} />
        <meshBasicMaterial color={COLORS.yellowSide} />
      </mesh>

      {floors.map((floorIndex) => (
        <Window
          key={floorIndex}
          position={[0, floorLocalY(floorIndex), MAIN_DEPTH / 2 + 0.02]}
          size={[0.16, 0.38]}
        />
      ))}
    </group>
  );
}

function Roof() {
  const roofWidth = MAIN_WIDTH + ANNEX_WIDTH + 0.2;
  const roofDepth = MAIN_DEPTH + 0.2;

  return (
    <group position={[BUILDING_CENTER_X, BUILDING_HEIGHT + 0.08, 0]}>
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
      <YellowAnnex />
      <Roof />
    </>
  );
}

function BuildingSceneSvg() {
  const W = 320;
  const H = 300;

  const groundY = 252;
  const buildingTop = 36;
  const buildingH = groundY - buildingTop - 8;

  const annexW = 54;
  const mainW = 178;
  const totalW = annexW + mainW;
  const startX = (W - totalW - 20) / 2;
  const depthOffset = 20;

  const mainX = startX + annexW;
  const rightX = mainX + mainW;
  const backX = rightX + depthOffset;
  const backMainX = mainX + depthOffset;

  const roofH = 14;
  const roofTop = buildingTop - roofH + 4;
  const floorH = buildingH / FLOOR_COUNT;
  const floors = Array.from({ length: FLOOR_COUNT }, (_, i) => i);

  const windowW = 48;
  const windowH = floorH * 0.52;
  const windowGap = (mainW - windowW * WINDOW_COLUMNS) / (WINDOW_COLUMNS + 1);

  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
      <Rect x={0} y={0} width={W} height={H} fill={COLORS.sky} />

      {/* cara lateral derecha del edificio */}
      <Polygon
        points={`${rightX},${buildingTop} ${backX},${buildingTop - 10} ${backX},${groundY} ${rightX},${groundY}`}
        fill={COLORS.wallSide}
      />
      <Polygon
        points={`${startX + annexW},${buildingTop} ${backMainX},${buildingTop - 10} ${backMainX},${groundY} ${startX + annexW},${groundY}`}
        fill={COLORS.yellowSide}
      />

      {/* cuerpo anexo amarillo */}
      <Rect x={startX} y={buildingTop} width={annexW} height={buildingH} fill={COLORS.yellow} />

      {/* cuerpo principal blanco */}
      <Rect x={mainX} y={buildingTop} width={mainW} height={buildingH} fill={COLORS.wall} />

      {/* techo - cara superior */}
      <Polygon
        points={`${startX - 6},${buildingTop} ${rightX + 6},${buildingTop} ${backX + 6},${buildingTop - 10} ${backMainX - 6},${buildingTop - 10}`}
        fill={COLORS.roof}
      />
      {/* techo - frente */}
      <Rect x={startX - 6} y={roofTop} width={totalW + 12} height={roofH} fill={COLORS.roof} rx={1} />
      {/* techo - lateral */}
      <Polygon
        points={`${rightX + 6},${roofTop} ${backX + 6},${roofTop - 10} ${backX + 6},${buildingTop - 10} ${rightX + 6},${buildingTop}`}
        fill={COLORS.roofSide}
      />

      {/* ventanas edificio principal - 7 pisos x 2 columnas */}
      {floors.map((floorIndex) => {
        const y = buildingTop + floorIndex * floorH + (floorH - windowH) / 2;
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

      {/* ventanas anexo amarillo */}
      {floors.map((floorIndex) => {
        const y = buildingTop + floorIndex * floorH + floorH * 0.14;
        const h = floorH * 0.72;
        const x = startX + (annexW - 14) / 2;
        return (
          <Rect
            key={`annex-${floorIndex}`}
            x={x}
            y={y}
            width={14}
            height={h}
            fill={COLORS.window}
            rx={1}
          />
        );
      })}

      {/* líneas de piso sutiles en el edificio blanco */}
      {floors.slice(1).map((floorIndex) => {
        const y = buildingTop + floorIndex * floorH;
        return (
          <Rect
            key={`line-${floorIndex}`}
            x={mainX}
            y={y}
            width={mainW}
            height={1}
            fill="#D8D8D8"
          />
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
    width: '100%',
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.sky,
  },
  canvas: {
    flex: 1,
    width: '100%',
  },
});
