import React, { useState } from 'react';

interface Hotspot {
    id: number;
    position: [number, number, number];
    label: string;
    url: string;
}
// HotspotPanel的props接口，包含hotspots数组和控制添加模式的函数
interface HotspotPanelProps {
    hotspots: Hotspot[];
    setAddingHotspot: React.Dispatch<React.SetStateAction<boolean>>;
    removeHotspot: (id: number) => void;
    addingHotspot: boolean;
}

export const HotspotPanel: React.FC<HotspotPanelProps> = ({
    hotspots,
    setAddingHotspot,
    removeHotspot,
    addingHotspot
}) => {
    // 函数处理点击添加标点按钮
    const handleAddHotspotClick = () => {
        // 启动添加模式
        setAddingHotspot(true);
    };
    const handleRemoveHotspot = (id: number) => {
        removeHotspot(id);
      };

    return (
        <section className="bg-white text-black p-4 space-y-4 border border-gray-300 rounded-lg m-5 shadow-lg">
            <h3 className="font-semibold text-xl">标点面板</h3>
            {hotspots.map((hotspot, index) => (
                // 为每个hotspot渲染一个groupbox
                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                    <p>Position: {hotspot.position.join(', ')}</p>
                    <div className="mb-4">
                        <label htmlFor={`hotspot-label-${index}`}>标签:</label>
                        <input
                            id={`hotspot-label-${index}`}
                            type="text"
                            className="border border-gray-300 p-2 rounded-lg w-full"
                            value={hotspot.label}
                            placeholder="输入标签"
                        // 更新标签时，不直接修改hotspots状态，应通过父组件传入的方法进行
                        // onChange={...}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor={`hotspot-url-${index}`}>跳转链接:</label>
                        <input
                            id={`hotspot-url-${index}`}
                            type="text"
                            className="border border-gray-300 p-2 rounded-lg w-full"
                            value={hotspot.url}
                            placeholder="跳转链接"
                        // 更新链接时，不直接修改hotspots状态，应通过父组件传入的方法进行
                        // onChange={...}
                        />
                    </div>
                    <button onClick={() => handleRemoveHotspot (hotspot.id)} className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
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
                    添加标点
                </button>
             )}
             {/* 如果处于添加模式，显示提示文案 */}
             {addingHotspot && (
               <p>Click on the model in the preview to add a hotspot.</p>
             )}
        </section>
    );
};
