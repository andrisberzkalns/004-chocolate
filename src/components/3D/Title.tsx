import * as THREE from "three";
import React, { useEffect } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

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
  const { offset, action, maxWidth } = props;
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
    </>
  );
}
