import {
  ScrollControls,
  useScroll,
  SoftShadows,
  PerspectiveCamera,
  Sparkles,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import ModelHandler from "./3D/ModelHandler";
import React from "react";
// import { DataContext } from "~/lib/contexts/dataContext";
import { useSelector, useDispatch } from "react-redux";
import { setOffset } from "~/lib/slices/dataSlice";
import type { RootState } from "~/lib/store";
import { BottomSelector } from "~/components/ui/BottomSelector";
import { ButtonSelector } from "~/components/ui/ButtonSelector";
import { getScrollPositionArray } from "~/lib/utils";

const CustomCanvas = () => {
  const items = useSelector((state: RootState) => state.data.items);
  return (
    <>
      <Canvas
        id="scroller"
        className="absolute left-0 top-0 h-screen w-screen"
        shadows
        gl={{ preserveDrawingBuffer: true }}
        eventPrefix="client"
      >
        <ScrollControls pages={items.length} damping={0.5} distance={1}>
          <Scene />
        </ScrollControls>
      </Canvas>
      <ButtonSelector />
      <BottomSelector />
    </>
  );
};

const Scene: React.FC = () => {
  const items = useSelector((state: RootState) => state.data.items);
  const offset = useSelector((state: RootState) => state.data.offset);
  const selectedIndex = useSelector(
    (state: RootState) => state.data.selectedIndex,
  );
  const dispatch = useDispatch();
  const cameraRef = useRef(null);
  const scroll = useScroll();

  useFrame(() => {
    dispatch(setOffset(scroll.offset));
    const halfScroll = scroll.el.clientHeight / 2;
    const minScrollDelta = halfScroll / (scroll.el.clientHeight * items.length);
    const maxScrollDelta = 1 - minScrollDelta;

    const needToScrollMinDelta = minScrollDelta - scroll.offset;
    if (needToScrollMinDelta > 0) {
      scroll.el.scrollBy(
        0,
        (needToScrollMinDelta / 16) * scroll.el.clientHeight,
      );
    }
    const needToScrollMaxDelta = maxScrollDelta - scroll.offset;

    if (needToScrollMaxDelta < 0) {
      scroll.el.scrollBy(
        0,
        (needToScrollMaxDelta / 16) * scroll.el.clientHeight,
      );
    }
  });

  useEffect(() => {
    const fromTopMap = getScrollPositionArray(
      scroll.el.clientHeight,
      items.length,
    );
    scroll.el.scrollTo({ top: fromTopMap[selectedIndex] });
  }, [items.length, scroll.el, selectedIndex]);

  return (
    <mesh>
      <group>
        <PerspectiveCamera
          ref={cameraRef}
          name="Camera"
          makeDefault={true}
          far={100}
          near={0.1}
          fov={22.895}
          position={[0, 0, 16]}
        />
      </group>
      <directionalLight castShadow position={[0, 0, 16]} intensity={0.8} />
      <spotLight position={[-2, 4, 6]} intensity={8} />
      <spotLight position={[3, 4, 6]} intensity={8} />
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <SoftShadows size={10} focus={0.5} samples={20} />
        <Sparkles count={50} scale={7} size={6} speed={0.2} color={"orange"} />
        <ModelHandler offset={offset} cameraRef={cameraRef} />
      </Suspense>
    </mesh>
  );
};

export default CustomCanvas;
