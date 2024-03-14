import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useEffectOnce } from "react-use";
import { useGLTF, useAnimations, PerspectiveCamera } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import * as misc from "maath/misc";
import { ChocolateChips } from "../Chocolate_chips";
import { ChocolateTypes } from "~/lib/data";
import { useSelector } from "react-redux";
import type { RootState } from "~/lib/store";
import { visibleWidthAtZDepth, visibleHeightAtZDepth } from "~/lib/utils";
import { Model } from "~/components/3D/Model";

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh;
    Plane: THREE.Mesh;
    Cube001: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
    ["Material.001"]: THREE.MeshStandardMaterial;
  };
};

const ChocolateArray = Object.values(ChocolateTypes);
const MODEL_COUNT = ChocolateArray.length;

type ModelsProps = {
  offset: number;
  cameraRef: React.RefObject<THREE.PerspectiveCamera>;
};

type useModelOutput = {
  groupRef: React.RefObject<THREE.Group>;
  nodes: GLTFResult["nodes"];
  actions: Record<string, THREE.AnimationAction | null>;
  materials: GLTFResult["materials"];
};

const ModelFile = (source: string): useModelOutput => {
  const { nodes, materials, animations } = useGLTF(source) as GLTFResult;
  const group = useRef<THREE.Group>(null);
  const animation = useAnimations<THREE.AnimationClip>(animations, group);

  if (animation.clips.length < 0) {
    throw new Error("No animation clips found");
  }

  return {
    groupRef: group,
    nodes: nodes,
    materials: materials,
    actions: animation.actions,
  };
};

const ModelsFiles = (sources: string[]): useModelOutput[] => {
  return sources.map((source) => ModelFile(source));
};

const GetCameraActions = (
  source: string,
  cameraRef: React.RefObject<THREE.Camera>,
) => {
  const { animations } = useGLTF(source) as GLTFResult;
  const { actions } = useAnimations<THREE.AnimationClip>(animations, cameraRef);
  return actions;
};

const CamerasActions = (
  sources: string[],
  cameraRef: React.RefObject<THREE.Camera>,
) => {
  return sources.map((source) => GetCameraActions(source, cameraRef));
};

const ModelHandler: React.FC<ModelsProps> = ({ offset, cameraRef }) => {
  const referenceCameraRef = useRef<THREE.PerspectiveCamera>(null);
  const items = useSelector((state: RootState) => state.data.items);
  const [visibleWidth, setVisibleWidth] = useState(0);
  const [visibleHeight, setVisibleHeight] = useState(0);

  // const { items } = useContext(DataContext);
  const [chipRotation, setChipRotation] = useState(0 as number);
  const [bg, setBg] = useState("cyan" as string);
  const models = ModelsFiles(items.map((item) => item.source));
  const cameras = CamerasActions(
    [
      "/assets/camera_0.glb",
      "/assets/camera_1.glb",
      "/assets/camera_2.glb",
      "/assets/camera_3.glb",
      "/assets/camera_4.glb",
    ],
    cameraRef,
  );

  const CamerasMap = new Map<ChocolateTypes, THREE.AnimationAction>([
    [ChocolateTypes.title, cameras[0]!.CameraAction!],
    [ChocolateTypes.pergale_dark, cameras[1]!.CameraAction!],
    [ChocolateTypes.pergale_cranberries, cameras[3]!.CameraAction!],
    [ChocolateTypes.pergale_forestberries, cameras[2]!.CameraAction!],
    [ChocolateTypes.pergale_grilyazh, cameras[4]!.CameraAction!],
  ]);

  const [offsets, setOffsets] = useState<{ [key in ChocolateTypes]: number }>({
    title: 0,
    pergale_dark: 0,
    pergale_cranberries: 0,
    pergale_forestberries: 0,
    pergale_grilyazh: 0,
  });

  useEffect(() => {
    setOffsets((current) => {
      const newOffsets = structuredClone(current);
      ChocolateArray.forEach((key, index) => {
        const min_value = index / MODEL_COUNT;
        const max_value = (index + 1) / MODEL_COUNT;
        const value =
          misc.clamp(offset, min_value, max_value) * MODEL_COUNT - index;
        newOffsets[key] = value;
      });
      return newOffsets;
    });
  }, [offset]);

  useEffectOnce(() => {
    cameras.forEach((cameraAction) => {
      cameraAction.CameraAction!.play().paused = true;
    });
    setBg(items.find((item) => item.key == "title")!.bg);

    const camera = CamerasMap.get(ChocolateTypes.title);
    if (!camera) return;
    camera.time = camera.getClip().duration * 1;
  });

  useFrame((state, delta) => {
    const finalColor = new THREE.Color();

    Object.keys(offsets).forEach((key) => {
      const offset = offsets[key as ChocolateTypes];
      if (offset <= 0 || offset >= 1) return;
      const camera = CamerasMap.get(key as ChocolateTypes);
      if (!camera) return;
      camera.time = camera.getClip().duration * offset;
      finalColor.lerpColors(
        new THREE.Color(bg),
        new THREE.Color(items.find((item) => item.key == key)!.bg),
        0.05,
      );
      setBg(finalColor.getStyle());
    });
    setChipRotation((current) => current + delta * 0.002);
  });

  useEffect(() => {
    const camera = referenceCameraRef.current;
    if (!camera) return;
    camera.lookAt(0, 0, 0);
    setVisibleWidth(visibleWidthAtZDepth(0, camera));
    setVisibleHeight(visibleHeightAtZDepth(0, camera));
  }, []);

  return (
    <>
      {items.map((item, index) => {
        if (!models[index] || !item.key) return null;
        return (
          <Model
            key={item.key}
            groupRef={models[index]!.groupRef}
            geometry={models[index]!.nodes.Cube001.geometry}
            material={models[index]!.materials["Material.001"]}
            action={models[index]!.actions["Cube.001Action.001"]!}
            offset={offsets[ChocolateArray[index]!] || 0}
            maxWidth={visibleWidth}
            maxHeight={visibleHeight}
            text={{
              heading: item.title,
              subheading: item.subtitle,
              description: item.description,
            }}
          />
        );
      })}
      <PerspectiveCamera
        far={100}
        near={0.1}
        fov={22.895}
        position={[0, 0, 16]}
        ref={referenceCameraRef}
      />
      <ChocolateChips
        scale={3}
        position={[4, -4, 0]}
        rotation={[
          Math.PI * -chipRotation,
          Math.PI * chipRotation,
          Math.PI * chipRotation,
        ]}
      />
      <ChocolateChips
        scale={3}
        position={[4, 4, 0]}
        rotation={[
          Math.PI * -chipRotation,
          Math.PI * chipRotation,
          Math.PI * chipRotation,
        ]}
      />
      <ChocolateChips
        scale={3}
        position={[-5, 4.5, 0]}
        rotation={[
          Math.PI * -chipRotation,
          Math.PI * chipRotation,
          Math.PI * -chipRotation,
        ]}
      />
      <ChocolateChips
        scale={3}
        position={[-4, -4, 0]}
        rotation={[
          Math.PI * -chipRotation,
          Math.PI * chipRotation,
          Math.PI * -chipRotation,
        ]}
      />
      <mesh
        position={[0, -4.7, 0]}
        rotation={[-Math.PI / 12, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={bg} />
      </mesh>
    </>
  );
};

useGLTF.preload("/assets/pergale_dark.glb");
useGLTF.preload("/assets/pergale_cranberries.glb");
useGLTF.preload("/assets/pergale_forestberries.glb");
useGLTF.preload("/assets/pergale_grilyazh.glb");
useGLTF.preload("/assets/camera_0.glb");
useGLTF.preload("/assets/camera_1.glb");
useGLTF.preload("/assets/camera_2.glb");
useGLTF.preload("/assets/camera_3.glb");
useGLTF.preload("/assets/camera_4.glb");

export default ModelHandler;
