import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const visibleHeightAtZDepth = (
  depth: number,
  camera: THREE.PerspectiveCamera,
) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

export const visibleWidthAtZDepth = (
  depth: number,
  camera: THREE.PerspectiveCamera,
) => {
  const height = visibleHeightAtZDepth(depth, camera);
  return height * camera.aspect;
};

export const getScrollPositionArray = (
  clientHeight: number,
  length: number,
) => {
  const arr = [];
  const step = clientHeight;
  for (let i = 0; i < length; i++) {
    arr.push(step * i + step / 2);
  }
  return arr;
};
