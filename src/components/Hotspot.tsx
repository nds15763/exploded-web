import React, { useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { Canvas, useFrame, extend, useThree, useLoader } from '@react-three/fiber';
import { Vector3, MeshBasicMaterial, CanvasTexture, TextureLoader, SpriteMaterial, Sprite as ThreeSprite, Line, BufferGeometry, LineBasicMaterial } from 'three';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader';
import { ReactElement } from 'react';

extend({ ThreeSprite });

interface HotspotProps {
    position: Vector3;
    onClick: () => void;
    label: string;
    url?: string; // Make the url property optional
    onEdit: (hotspotId: number, label: string, type: string) => void; // Callback for editing the label
}

interface TextLabelProps {
    position: Vector3; // 位置可以是 Vector3 或者数字数组
    label: string; // 标签文本
}

const TextLabel: React.FC<TextLabelProps> = ({ position, label }) => {
    const { camera } = useThree();

    label ? label : label = "";
    const textRef = useRef<THREE.Object3D>();

    useFrame(() => {
        /*文字的上方向,转到摄像机朝向和空间上方向的平面上就行*/
        if (textRef.current) {
            // 计算相机朝向的垂直向量
            const upVector = new Vector3(0, 1, 0);
            const cameraDirection = new Vector3().copy(camera.position).normalize();
            const perpendicular = upVector.clone().cross(cameraDirection).normalize();
             // 将文本的上方向设置为相机的朝向和空间上方向的平面的法向量的负向量
            textRef.current.up.copy(perpendicular).negate();
            // 设置文本的朝向为相机的反方向
            textRef.current.lookAt(textRef.current.position.clone().add(cameraDirection));
            // 将文本的上方向再旋转90度
            textRef.current.rotateZ(-Math.PI / 2);
        }
    });
   

    return (
        <Text
            ref={textRef}
            position={position}
            color={0x000}
            fontSize={0.1}
            anchorX="center"
            anchorY="middle"
        >
            {label}
        </Text>
    );
};


const Hotspot: React.FC<HotspotProps> = ({ position, onClick, label, url, onEdit }) => {

    const lineMaterial = new LineBasicMaterial({ color: 0x000000, linewidth: 5 });

    // Calculate second point
    const center = new Vector3(0, 0, 0); // Assuming center of the 3D model is at (0, 0, 0)
    const direction = new Vector3().copy(position).sub(center).normalize();
    const distance = position.distanceTo(center);
    const endPoint = new Vector3().copy(position).add(direction.multiplyScalar(distance * 1.2));

    const lineGeometry = new BufferGeometry().setFromPoints([
        new Vector3(position.x, position.y, position.z),
        endPoint
    ]);

    return (
        <>
            <primitive object={new Line(lineGeometry, lineMaterial)} />
            <TextLabel position={endPoint} label={label} />
        </>
    );
};



export default Hotspot;
