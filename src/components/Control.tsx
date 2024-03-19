import React, { useState, useRef, ChangeEvent, useCallback } from 'react';
import { Canvas } from "@react-three/fiber";
import "./App.scss";
import { CameraRig } from "./CameraRig";
import { OrbitControls } from "@react-three/drei";
import { Drill } from "./Drill";
import { useEffect, Suspense } from "react";
import { Mesh, Box3, Vector3, Object3D } from "three";
import 'tailwindcss/tailwind.css';
import '../out.css';
import Hotspot from './Hotspot';
import { HotspotPanel } from './HotspotPanel';

interface ControlPanelProps {
  // 你可以在这里为ControlPanel添加props
}
interface Hotspot {
  id: number;
  position: Vector3;
  label: string;
  url: string;
}

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const [explosionHeight, setExplosionHeight] = useState<number>(1);
  const [explosionSpeed, setExplosionSpeed] = useState<number>(1.0); // 默认值为1.0
  const [gltfUrl, setGltfUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 定义相机位置状态
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([5, 5, 5]);
  // Hotspots的状态和添加Hotspot的方法
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isExplodedView, setIsExplodedView] = useState(false);
  const [addingHotspot, setAddingHotspot] = useState(false);
  const [savedExplodedPositions, setSavedExplodedPositions] = useState<{ [key: string]: Vector3 }>({});
  const [isRestorePositions, setRestorePositions] = useState(false);
  // 展开各组件map
  const [explodedPositions, setExplodedPositions] = useState<Map<number, Vector3>>(new Map());
  const [isPullback, setIsPullback] = useState(false);


  const handleLabelChange = (index: number, newLabel: string) => {
      editHotspot(index, newLabel, "label")
  };

  const handleUrlChange = (index: number, newLabel: string) => {
      editHotspot(index, newLabel, "url")
  };


  //展开模型子组件回调
  const handleSavePositions = (positions: Map<number, Vector3>) => {
    setExplodedPositions(positions);
  };

  // 处理从HotspotPanel移除Hotspot的逻辑
  const removeHotspot = (id: number) => {
    setHotspots(hotspots.filter(hotspot => hotspot.id !== id));
  };
  // 添加Hotspot的回调函数
  const addHotspot = (position: Vector3) => {
    // 生成新的Hotspot对象，并更新状态
    const newHotspot = {
      id: hotspots.length,
      position,
      label: '',
      url: ''
    };
    setHotspots([...hotspots, newHotspot]);
    // 关闭添加标点模式
    setAddingHotspot(false);
  };

  const editHotspot = (id: number, newLabel: string, type: string) => {
    const updatedHotspots = hotspots.map(hotspot => {
        if (hotspot.id === id) {
          if (type == "label") {
            return { ...hotspot, label: newLabel };
          }else{
            return { ...hotspot, url: newLabel };
          }
           
        }
        return hotspot;
    });
    setHotspots(updatedHotspots);
};

  // 函数处理点击添加标点按钮
  const handleAddHotspotClick = () => {
    // 启动添加模式
    setAddingHotspot(true);
  };
  const handleRemoveHotspot = (id: number) => {
    removeHotspot(id);
  };

  // 定义更新相机位置的回调函数
  const handleCameraPositionChange = useCallback((newPosition: [number, number, number]) => {
    //TODO 相机位置未改变
    setCameraPosition(newPosition);
  }, []); // 空依赖数组意味着这个函数在组件的生命周期内不会改变

  // 处理滑块变化
  const handleHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExplosionHeight(Number(event.target.value));
  };

  const handleSpeedChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExplosionSpeed(Number(event.target.value));
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.glb')) {
      // 创建一个指向该文件的 URL
      const url = URL.createObjectURL(file);
      setGltfUrl(url);
    }
  };

  function explodeView(isExplodedView: boolean) {
    setIsExplodedView(!isExplodedView);
  };

  function handlePullback(isPullback: boolean) {
    setIsPullback(isPullback);
  }

  function handleRestorePositions(isRestorePositions: boolean) {
    setRestorePositions(!isRestorePositions);
  }

  return (
    <div className="flex-1 overflow-auto justify-between items-start h-full"> {/* flex-grow 确保该容器填充剩余空间 */}
      <div className="absolute left-0 z-10">
        <section className="bg-white text-black p-4 space-y-4 border border-gray-300 rounded-lg m-5 shadow-lg" style={{ width: 350 }}>
          <h3 className="font-semibold text-xl">Control panel</h3>
          <div className="flex items-center space-x-2">
            <label htmlFor="explosionHeight" className="flex-grow">Space:</label>
            <input type="range" id="explosionHeight" name="explosionHeight" min="0" max="5" value={explosionHeight} onChange={handleHeightChange} className="flex-grow range range-primary text-gray" />
          </div>
          {/* <div className="flex items-center space-x-2">
            <label htmlFor="explosionSpeed" className="flex-grow">零件展开速度:</label>
            <input type="range" id="explosionSpeed" name="explosionSpeed" min="0.1" max="5.0" step="0.1" value={explosionSpeed} onChange={handleSpeedChange} className="flex-grow range range-primary text-gray" />
          </div> */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".glb"
            onChange={handleFileUpload}
          />
          <button className="py-4 px-6 text-lg w-full bg-white border border-black text-black rounded-md hover:bg-gray-100" onClick={() => fileInputRef.current?.click()}>
            Upload (.glb)
          </button>
          <button className="py-4 px-6 text-lg w-full bg-black text-white rounded-md hover:bg-gray-700" onClick={() => explodeView(isExplodedView)}>Explode</button>
          <div className="flex justify-between">
            <button className="py-4 px-6 text-lg flex-grow-1 w-6/12 bg-white border border-black text-black rounded-md hover:bg-gray-100" onClick={() => handlePullback(!isPullback)}>Fold</button>
            <div style={{ width: '10px' }}></div>
            <button className="py-4 px-6 text-lg flex-grow-1 w-6/12 bg-white border border-black text-black rounded-md hover:bg-gray-100" onClick={() => handleRestorePositions(isRestorePositions)}>Expand</button>
          </div>
        </section>
      </div>
      <div className="absolute right-0 z-10">
        <section className="bg-white text-black p-4 space-y-4 border border-gray-300 rounded-lg m-5 shadow-lg">
          <h3 className="font-semibold text-xl">Hotspot panel</h3>
          {hotspots.map((hotspot, index) => (
            // 为每个hotspot渲染一个groupbox
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
              {/* <p>Position: {hotspot.position.join(', ')}</p> */}
              <div className="mb-4">
                <label htmlFor={`hotspot-label-${index}`}>Label:</label>
                <input
                  id={`hotspot-label-${index}`}
                  type="text"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  placeholder="Parts label"
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor={`hotspot-url-${index}`}>Url Link:</label>
                <input
                  id={`hotspot-url-${index}`}
                  type="text"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  placeholder="Enter URL link to jump to"
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                />
              </div>
              <button onClick={() => handleRemoveHotspot(hotspot.id)} className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {/* 如果处于添加模式，显示提示信息；否则显示添加按钮 */}
          {!addingHotspot && (
            <button onClick={handleAddHotspotClick} className="mt-4 bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full">
              <span className="flex items-center justify-center rounded-full h-6 w-6 bg-white mr-2">
                <svg className="w-4 h-4 text-black" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 5v10m5-5H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Add Hotspot
            </button>
          )}
          {/* 如果处于添加模式，显示提示文案 */}
          {addingHotspot && (
            <p>Click on the model in the preview to add a hotspot.</p>
          )}
        </section>
      </div>
      <div className='w-full h-full flex-1'>
        <Canvas>
          <CameraRig position={cameraPosition} />
          <Suspense fallback={null}>
            {gltfUrl && <Drill gltfUrl={gltfUrl} isExplodedView={isExplodedView}
              onCameraPositionChange={handleCameraPositionChange}
              explodedHeight={explosionHeight}
              addHotspot={(position) => addHotspot(position.position)}
              isaddingHotspot={addingHotspot}
              hotspots={hotspots}
              savePositions={handleSavePositions}
              restorePositions={isRestorePositions}
              pullback={isPullback}
              OnEditHotspot={(id,newLabel, type) => editHotspot(id, newLabel, type)}
            />}
          </Suspense>
          <ambientLight intensity={1} />
          <pointLight position={[0, 5, 0]} intensity={1} color="white" />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default ControlPanel;
