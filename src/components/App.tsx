import { Canvas } from "@react-three/fiber";
import "./App.scss";
import { Loader, Sphere } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { Drill } from "./Drill";
import { Suspense } from "react";

function App() {
  const initialGltfUrl = "path/to/your/model.gltf"; // 请替换为您的GLTF模型的URL
  const initialIsExplodedView = false; // 根据您的需求设置初始值
  const handleCameraPositionChange = (position:[number, number, number]) => {
    console.log("Camera position changed:", position);
  };

  return (
    <>
      {/* <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Drill
            gltfUrl={initialGltfUrl}
            isExplodedView={initialIsExplodedView}
            onCameraPositionChange={handleCameraPositionChange}
            addHotspot={(hotspot) => console.log("New hotspot:", hotspot)}
          />
        </Suspense>
        <pointLight position={[0, 5, 0]} intensity={1} color="white" />
        <OrbitControls />
      </Canvas>
      <Loader /> */}
    </>
  );
}

export default App;
