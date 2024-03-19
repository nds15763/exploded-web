import { useEffect } from "react";
import {  useThree } from '@react-three/fiber';
import { Vector3 } from "three";

interface CameraRigProps {
    position: [number, number, number];
}

const CameraRig: React.FC<CameraRigProps> = ({ position }) => {
  const { camera } = useThree();

  useEffect(() => {
    const targetPosition = new Vector3(...position);
    camera.position.copy(targetPosition); // 直接设置相机位置
    camera.lookAt(0, 0, 0);
  }, [position]); // 依赖项为 position，仅在 position 改变时更新

  return null;
};

export {CameraRig};
// import { useFrame, useThree } from '@react-three/fiber';
// import { Vector3 } from "three";

// interface CameraRigProps {
//     position: [number, number, number];
//   }

// const CameraRig: React.FC<CameraRigProps> = ({ position }) => {
//   const { camera } = useThree();
//   useFrame(() => {
//     // 直接在这里创建一个Vector3实例
//     const targetPosition = new Vector3(...position);
//     camera.position.lerp(targetPosition, 0.05);
//     camera.lookAt(0, 0, 0);
//   });

//   return null;
// };

// export {CameraRig};