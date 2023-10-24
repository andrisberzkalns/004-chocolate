/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 .\pergale_dark.glb --types 
*/

import * as THREE from "three";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  useGLTF,
  useAnimations,
  useScroll,
  Text,
  PerspectiveCamera,
} from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import * as misc from "maath/misc";
import { ChocolateChips } from "./Chocolate_chips";
// import { DataContext } from "~/lib/contexts/dataContext";
import { ChocolateTypes } from "~/lib/data";
import { useSelector, useDispatch } from "react-redux";
import { setOffset, next, previous, set } from "~/lib/slices/dataSlice";
import { RootState } from "~/lib/store";
import { visibleWidthAtZDepth, visibleHeightAtZDepth } from "~/lib/utils";

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

const BackgroundColorMap = new Map([
  [ChocolateTypes.pergale_dark, "steelblue"],
  [ChocolateTypes.pergale_cranberries, "crimson"],
  [ChocolateTypes.pergale_forestberries, "purple"],
  [ChocolateTypes.pergale_grilyazh, "maroon"],
]);

const ChocolateArray = Object.values(ChocolateTypes);
const MODEL_COUNT = ChocolateArray.length;

type ModelsProps = {
  offset: number;
  cameraRef: React.RefObject<THREE.PerspectiveCamera>;
};

type useModelOutput = {
  groupRef: React.RefObject<THREE.Group>;
  nodes: GLTFResult["nodes"];
  actions: {
    [x: string]: THREE.AnimationAction | null;
  };
  materials: GLTFResult["materials"];
};

const useModels = (sources: string[]): useModelOutput[] => {
  const getModel = (source: string): useModelOutput => {
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

  return sources.map((source) => getModel(source));
};

const useCamerasActions = (
  sources: string[],
  cameraRef: React.RefObject<THREE.Camera>,
) => {
  const getCameraActions = (
    source: string,
    cameraRef: React.RefObject<THREE.Camera>,
  ) => {
    const { animations } = useGLTF(source) as GLTFResult;
    const { actions } = useAnimations<THREE.AnimationClip>(
      animations,
      cameraRef,
    );
    return actions;
  };

  return sources.map((source) => getCameraActions(source, cameraRef));
};

const Models: React.FC<ModelsProps> = ({ offset, cameraRef }) => {
  const referenceCameraRef = useRef<THREE.PerspectiveCamera>(null);
  const items = useSelector((state: RootState) => state.data.items);
  const [visibleWidth, setVisibleWidth] = useState(0);
  const [visibleHeight, setVisibleHeight] = useState(0);

  // const { items } = useContext(DataContext);
  const [chipRotation, setChipRotation] = useState(0 as number);
  const [bg, setBg] = useState("cyan" as string);
  const models = useModels(items.map((item) => item.source));
  const cameras = useCamerasActions(
    [
      "/assets/camera_1.glb",
      "/assets/camera_2.glb",
      "/assets/camera_3.glb",
      "/assets/camera_4.glb",
    ],
    cameraRef,
  );

  const CamerasMap = new Map<ChocolateTypes, THREE.AnimationAction>([
    [ChocolateTypes.pergale_dark, cameras[0]!.CameraAction!],
    [ChocolateTypes.pergale_cranberries, cameras[2]!.CameraAction!],
    [ChocolateTypes.pergale_forestberries, cameras[1]!.CameraAction!],
    [ChocolateTypes.pergale_grilyazh, cameras[3]!.CameraAction!],
  ]);

  const [offsets, setOffsets] = useState<{ [key in ChocolateTypes]: number }>({
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

  useEffect(() => {
    cameras.forEach((cameraAction) => {
      cameraAction.CameraAction!.play().paused = true;
    });
  }, []);

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
        new THREE.Color(BackgroundColorMap.get(key as ChocolateTypes)),
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
        if (!models[index] || !item.label) return null;
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

type ModelProps = {
  offset: number;
  action: THREE.AnimationAction;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  groupProps?: JSX.IntrinsicElements["group"];
  groupRef: React.RefObject<THREE.Group>;
  maxWidth: number;
  maxHeight: number;
  text?: {
    heading: string;
    subheading: string;
    description?: string;
  };
};

export function Model(props: ModelProps) {
  const { offset, action, material, geometry, groupRef, maxWidth, maxHeight } =
    props;
  useEffect(() => {
    if (action) action.play().paused = true;
  }, [action]);
  useFrame((state, delta) => {
    if (!action) return;
    action.time = THREE.MathUtils.damp(
      action.time,
      action.getClip().duration * offset,
      100,
      delta,
    );
  });

  enum ScreenWidthSize {
    small,
    medium,
    large,
  }
  enum TextAreas {
    heading,
    subheading,
    description,
  }

  const textDataObject: {
    [key in ScreenWidthSize]: {
      [key in TextAreas]: {
        position: [number, number, number];
        textAlign?: "right" | "center" | "left" | "justify" | undefined;
        visible?: boolean;
        anchorX?: number | "left" | "right" | "center" | undefined;
        anchorY?:
          | number
          | "top"
          | "bottom"
          | "top-baseline"
          | "middle"
          | "bottom-baseline"
          | undefined;
        size: number;
      };
    };
  } = {
    [ScreenWidthSize.small]: {
      [TextAreas.heading]: {
        position: [0, 2, -0.4],
        textAlign: "center",
        visible: offset > 0 && offset < 1,
        anchorX: "center",
        anchorY: "middle",
        size: 0.4,
      },
      [TextAreas.subheading]: {
        position: [0, -1.9, -0.2],
        textAlign: "center",
        visible: offset > 0 && offset < 1,
        anchorX: "center",
        anchorY: "middle",
        size: 0.25,
      },
      [TextAreas.description]: {
        position: [1, 1.5, 0],
        size: 0.15,
      },
    },
    [ScreenWidthSize.medium]: {
      [TextAreas.heading]: {
        position: [-1, 1.5, 0],
        textAlign: "right",
        visible: offset > 0 && offset < 1,
        anchorX: "right",
        anchorY: "top",
        size: 0.4,
      },
      [TextAreas.subheading]: {
        position: [-1, 1, 0],
        textAlign: "right",
        visible: offset > 0 && offset < 1,
        anchorX: "right",
        anchorY: "top",
        size: 0.25,
      },
      [TextAreas.description]: {
        position: [1, 1.5, 0],
        size: 0.15,
      },
    },
    [ScreenWidthSize.large]: {
      [TextAreas.heading]: {
        position: [-1, 1.5, 0],
        textAlign: "right",
        visible: offset > 0 && offset < 1,
        anchorX: "right",
        anchorY: "top",
        size: 0.4,
      },
      [TextAreas.subheading]: {
        position: [-1, 1, 0],
        textAlign: "right",
        visible: offset > 0 && offset < 1,
        anchorX: "right",
        anchorY: "top",
        size: 0.25,
      },
      [TextAreas.description]: {
        position: [1, 1.5, 0],
        size: 0.15,
      },
    },
  };

  let textData = textDataObject[ScreenWidthSize.small];

  switch (true) {
    case maxWidth < 8.5:
      textData = textDataObject[ScreenWidthSize.small];
      break;
    case maxWidth < 9:
      textData = textDataObject[ScreenWidthSize.medium];
      break;
    case maxWidth > 10:
      textData = textDataObject[ScreenWidthSize.large];
      break;
  }

  return (
    <>
      <Text
        castShadow
        position={textData[TextAreas.heading].position}
        fontSize={textData[TextAreas.heading].size}
        textAlign={textData[TextAreas.heading].textAlign}
        visible={textData[TextAreas.heading].visible}
        anchorX={textData[TextAreas.heading].anchorX}
        anchorY={textData[TextAreas.heading].anchorY}
        font="/assets/Roboto/Roboto-Bold.ttf"
      >
        {props.text?.heading}
      </Text>
      <Text
        castShadow
        position={textData[TextAreas.subheading].position}
        fontSize={textData[TextAreas.subheading].size}
        textAlign={textData[TextAreas.subheading].textAlign}
        visible={textData[TextAreas.subheading].visible}
        anchorX={textData[TextAreas.subheading].anchorX}
        anchorY={textData[TextAreas.subheading].anchorY}
        font="/assets/Roboto/Roboto-Medium.ttf"
      >
        {props.text?.subheading}
      </Text>
      <Text
        castShadow
        position={textData[TextAreas.description].position}
        fontSize={textData[TextAreas.description].size}
        textAlign={textData[TextAreas.description].textAlign}
        visible={textData[TextAreas.description].visible}
        anchorX={textData[TextAreas.description].anchorX}
        anchorY={textData[TextAreas.description].anchorY}
        font="/assets/Roboto/Roboto-Regular.ttf"
      >
        {props.text?.description}
      </Text>
      <group
        ref={groupRef}
        {...props.groupProps}
        dispose={null}
        visible={offset > 0 && offset < 1}
      >
        <group name="Scene" scale={0.7}>
          <mesh
            castShadow
            name="Cube001"
            geometry={geometry}
            material={material}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[0.985, 1.032, 2.083]}
          />
        </group>
      </group>
    </>
  );
}

useGLTF.preload("/assets/pergale_dark.glb");
useGLTF.preload("/assets/pergale_cranberries.glb");
useGLTF.preload("/assets/pergale_forestberries.glb");
useGLTF.preload("/assets/pergale_grilyazh.glb");
useGLTF.preload("/assets/camera_1.glb");
useGLTF.preload("/assets/camera_2.glb");
useGLTF.preload("/assets/camera_3.glb");
useGLTF.preload("/assets/camera_4.glb");

export default Models;
