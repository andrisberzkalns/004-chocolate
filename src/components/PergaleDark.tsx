/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 .\pergale_dark.glb --types 
*/

import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";

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

type ActionName = "Cube.001Action.001";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

type ContextType = Record<
  string,
  React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>
>;

type Props = {
  offset: number;
  isVisible: boolean;
  groupProps?: JSX.IntrinsicElements["group"];
};

export function PergaleDark(props: Props) {
  const { offset } = props;
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    "/assets/pergale_dark.glb",
  ) as GLTFResult;
  const { actions } = useAnimations<THREE.AnimationClip>(animations, group);
  useEffect(
    () => void (actions["Cube.001Action.001"]!.play().paused = true),
    [actions],
  );
  useFrame((state, delta) => {
    // actions["Cube.001Action.001"]!.play();
    const action = actions["Cube.001Action.001"];
    if (!action) return;
    action.time = THREE.MathUtils.damp(
      action.time,
      (action.getClip().duration / 2) * offset,
      100,
      delta,
    );
  });
  return (
    <group ref={group} {...props.groupProps} dispose={null}>
      <group name="Scene" scale={0.7}>
        <mesh
          castShadow
          name="Cube001"
          geometry={nodes.Cube001.geometry}
          material={materials["Material.001"]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.985, 1.032, 2.083]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/assets/pergale_dark.glb");
