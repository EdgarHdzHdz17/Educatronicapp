import { ELEVATOR_FLOORS } from "@/constants/elevator";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ITEM_HEIGHT = 30;
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const DEFAULT_FLOORS = ELEVATOR_FLOORS;

type FloorPickerProps = {
  value: number;
  onValueChange: (value: number) => void;
  floors?: number[];
  enabled?: boolean;
};

function getIndexForOffset(offsetY: number, maxIndex: number): number {
  const index = Math.round(offsetY / ITEM_HEIGHT);
  return Math.max(0, Math.min(maxIndex, index));
}

export function FloorPicker({
  value,
  onValueChange,
  floors = DEFAULT_FLOORS,
  enabled = true,
}: FloorPickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [centeredFloor, setCenteredFloor] = useState(value);
  const isUserInteracting = useRef(false);
  const isSnapping = useRef(false);
  const lastEmittedValue = useRef(value);

  const snapOffsets = useMemo(
    () => floors.map((_, index) => index * ITEM_HEIGHT),
    [floors],
  );

  const scrollToIndex = useCallback(
    (index: number, animated = false) => {
      const clampedIndex = Math.max(0, Math.min(floors.length - 1, index));
      scrollRef.current?.scrollTo({
        y: clampedIndex * ITEM_HEIGHT,
        animated,
      });
    },
    [floors.length],
  );

  const scrollToFloor = useCallback(
    (floor: number, animated = false) => {
      const index = floors.indexOf(floor);
      if (index >= 0) {
        scrollToIndex(index, animated);
      }
    },
    [floors, scrollToIndex],
  );

  const commitFloor = useCallback(
    (floor: number) => {
      const index = floors.indexOf(floor);
      if (index < 0) {
        return;
      }

      scrollToIndex(index, false);
      setCenteredFloor(floor);

      if (floor !== lastEmittedValue.current) {
        lastEmittedValue.current = floor;
        if (enabled) {
          onValueChange(floor);
        }
      }
    },
    [enabled, floors, onValueChange, scrollToIndex],
  );

  const snapToNearest = useCallback(
    (offsetY: number) => {
      if (isSnapping.current) {
        return;
      }

      isSnapping.current = true;
      const index = getIndexForOffset(offsetY, floors.length - 1);
      commitFloor(floors[index]);
      isUserInteracting.current = false;

      requestAnimationFrame(() => {
        isSnapping.current = false;
      });
    },
    [commitFloor, floors],
  );

  useEffect(() => {
    if (isUserInteracting.current) {
      return;
    }

    lastEmittedValue.current = value;
    setCenteredFloor(value);
    scrollToFloor(value, false);
  }, [value, scrollToFloor]);

  const handleScrollBeginDrag = () => {
    isUserInteracting.current = true;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isSnapping.current) {
      return;
    }

    const index = getIndexForOffset(
      event.nativeEvent.contentOffset.y,
      floors.length - 1,
    );
    setCenteredFloor(floors[index]);
  };

  const handleScrollEndDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const velocityY = event.nativeEvent.velocity?.y ?? 0;

    if (Math.abs(velocityY) < 0.05) {
      snapToNearest(event.nativeEvent.contentOffset.y);
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    snapToNearest(event.nativeEvent.contentOffset.y);
  };

  const paddingVertical = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

  return (
    <View style={styles.container}>
      <View
        pointerEvents="none"
        style={[styles.selectionIndicator, { height: ITEM_HEIGHT }]}
      />
      <ScrollView
        ref={scrollRef}
        scrollEnabled={enabled}
        showsVerticalScrollIndicator={false}
        snapToOffsets={snapOffsets}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        bounces={false}
        overScrollMode="never"
        nestedScrollEnabled
        contentContainerStyle={{ paddingVertical }}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {floors.map((floor) => {
          const isSelected = floor === centeredFloor;

          return (
            <View key={floor} style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  isSelected ? styles.itemTextSelected : styles.itemTextAdjacent,
                ]}
              >
                {floor}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <View pointerEvents="none" style={styles.fadeTop} />
      <View pointerEvents="none" style={styles.fadeBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: PICKER_HEIGHT,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  selectionIndicator: {
    position: "absolute",
    top: "50%",
    left: "10%",
    right: "10%",
    marginTop: -ITEM_HEIGHT / 2,
    backgroundColor: "#e8e8e8",
    borderRadius: 14,
    zIndex: 0,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    textAlign: "center",
  },
  itemTextSelected: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  itemTextAdjacent: {
    fontSize: 13,
    fontWeight: "500",
    color: "#b0b0b0",
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
});
