import { Loader, Sphere, useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Mesh, Box3, Vector3, Object3D, PerspectiveCamera, Raycaster, Vector2 } from "three";
import { useThree, useFrame, extend } from "@react-three/fiber"; // 用于访问相机等Three.js对象
import {
  TreeNode,
  determineMainExplodeDirection,
  buildExplodeTree,
} from "./TreeUtils"; // 路径根据实际位置调整
import { OrbitControls } from "@react-three/drei";
import Hotspot from "./Hotspot";


interface DrillProps {
  gltfUrl: string;
  centerModel?: boolean;
  isExplodedView: boolean;
  onCameraPositionChange: (newPosition: [number, number, number]) => void;
  explodedHeight: number; //展开的高度
  isaddingHotspot: boolean;
  addHotspot: (hotspot: Hotspot) => void;
  hotspots: Hotspot[]; // 添加hotspots属性
  savePositions: (positions: Map<number, Vector3>) => void; // 保存位置的回调函数
  restorePositions: boolean; // 恢复位置的状态
  pullback: boolean; // 判断是否收回
  OnEditHotspot: (hotspotId: number,label: string,type:string) => void;
}

// 定义标点类型
interface Hotspot {
  position: Vector3;
  label: string;
  url: string;
}

extend({ OrbitControls });

//export const Drill: React.FC<DrillProps> = ({ gltfUrl, isExplodedView}) => {
export const Drill: React.FC<DrillProps> = ({
  gltfUrl,
  isExplodedView,
  onCameraPositionChange,
  explodedHeight,
  addHotspot,
  isaddingHotspot,
  hotspots, // 从 props 中获取 hotspots
  savePositions,
  restorePositions,
  pullback,
  OnEditHotspot
}, ref) => {
  const gltf = useGLTF(gltfUrl);
  const modelRef = useRef<Object3D>(null);
  const explosionCenter = new Vector3(0, 0.15, 0); // 更高的爆炸中心
  const explosionFactor = 0.8; // 每个部件的移动幅度因子
  const { scene, camera, gl } = useThree();
  const meshRef = useRef<Mesh>(null); // 正确地类型化meshRef
  const raycaster = new Raycaster();
  const mouse = new Vector2();
  const [explodedPositions, setExplodedPositions] = useState<Map<number, Vector3>>(new Map());


  useEffect(() => {
    // 使用父组件传递的 savePositions 方法更新 explodedPositions 状态
    savePositions(explodedPositions);
  }, [explodedPositions]);


  useEffect(() => {
    const model: Object3D | null = modelRef.current;
    if (model) {
      // 计算模型的边界框
      const boundingBox = new Box3().setFromObject(model);
      const size = new Vector3();
      boundingBox.getSize(size); // 获取边界框的尺寸
      const center = new Vector3();
      boundingBox.getCenter(center); // 获取边界框的中心点

      // 调整模型的位置，使底部y值为0并且底面中心在(x: 0, y: 0)
      const yOffset = size.y / 2 - center.y; // 计算需要垂直移动的距离，以使模型底部对齐y=0
      //model.position.y += yOffset; // 调整y位置
      // 可选: 如果你想确保模型的中心在x=0，可以类似地调整x和z位置
      model.position.x -= center.x; // 调整x位置，使模型中心对齐x=0
      model.position.z -= center.z; // 调整z位置，使模型中心对齐z=0

      const modelHeight = size.y;
      // 检查相机是否为 PerspectiveCamera
      if (camera instanceof PerspectiveCamera) {
        // 使用你提供的逻辑来计算相机位置
        const modelMaxDimension = Math.max(size.x, size.y, size.z); // 使用最大尺寸
        const fov = camera.fov * (Math.PI / 180); // 将FOV从度转换为弧度
        const desiredScreenPercentage = 30;
        const distance =
          ((modelMaxDimension / 2 / Math.tan(fov / 2)) *
            (60 / desiredScreenPercentage)) /
          Math.sqrt(2);
        // 相机的位置在x,y,z上都相等，确保45度斜角俯瞰
        const newPosition: [number, number, number] = [
          distance,
          distance,
          distance,
        ];

        onCameraPositionChange(newPosition);
      } else {
        // 对于 OrthographicCamera 或其他类型的相机，你需要另外处理
        console.log(
          "Camera is not a PerspectiveCamera. Adjust your logic accordingly."
        );
      }
    }
  }, [gltf]); // 注意：这里只依赖modelRef，isExplodedView不影响位置调整

  useEffect(() => {
    const model: Object3D | null = modelRef.current;
    if (model && isExplodedView) {
      // 设定一个全局的爆炸中心，这里假设是模型的中心
      const boundingBox = new Box3().setFromObject(model);
      const explosionCenter = new Vector3();
      boundingBox.getCenter(explosionCenter);
      // 模型加载完成后，根据模型构建分解图的树结构
      // 需要加在这里
      explodeModel(model, 0, explosionCenter);
    }
  }, [modelRef, isExplodedView]);

  //获取收回状态
  useEffect(() => {
    const model: Object3D | null = modelRef.current;
    if (model && pullback) {
      implodeModel(model, explosionCenter);
    }

  }, [pullback]);

    //获取是否回溯
    useEffect(() => {
      const model: Object3D | null = modelRef.current;
      if (model && restorePositions) {
        RestorePositions(explodedPositions);
      }
  
    }, [restorePositions]);

  // 假设这是鼠标点击事件的处理函数
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!modelRef.current) return; // 确保modelRef.current不为null
    if (!isaddingHotspot) return;
    const raycaster = new Raycaster();
    const mouse = new Vector2();

    // 这里需要根据实际情况计算鼠标位置
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 更新射线的位置使用鼠标位置
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(modelRef.current, true);
    if (intersects.length > 0) {
      const intersect = intersects[0];
      // 这里可以根据intersect.point来添加hotspot
      const position: Vector3 =  intersect.point;
      addHotspot({ position, label: '新标点', url: '' });
    }
    isaddingHotspot = false;
  };

  function executeExplodeAnimation(
    node: TreeNode,
    explosionCenter: Vector3,
    level: number
  ) {
    // 遍历树并对每个节点执行动画
    node.children.forEach((child) => {
      // 确保explodeDirection不为null
      if (child.explodeDirection !== null) {
        // 初始化展开方向向量
        const displacementVector = new Vector3(0, 0, 0); // 默认值为0向量

        // 根据explodeDirection设置向量的相应分量
        displacementVector[child.explodeDirection] = 10 + level * 10; // 动态设置展开幅度和方向

        if (child.object3D instanceof Mesh) {
          // 应用动画只对Mesh类型的object3D
          gsap.to(child.object3D.position, {
            x: `+=${displacementVector.x}`,
            y: `+=${displacementVector.y}`,
            z: `+=${displacementVector.z}`,
            duration: 1, // 根据需要调整动画时长
          });
        }

        // 递归处理子节点
        executeExplodeAnimation(child, explosionCenter, level + 1);
      }
    });
  }

  //制作爆炸图方法
  function explodeModel(
    object: Object3D,
    level: number,
    explosionCenter: Vector3
  ): void {
    object.children.forEach((child) => {
      if (child instanceof Mesh) {
        const boundingBox: Box3 = new Box3().setFromObject(child);
        const center: Vector3 = new Vector3();
        boundingBox.getCenter(center);

        // 使用爆炸中心计算每个部分的展开方向和幅度
        const displacementVector: Vector3 = center
          .clone()
          .sub(explosionCenter)
          .normalize();
        //先设置一下展开幅度
        const distance = center.distanceTo(explosionCenter);
        // 可以根据层级调整展开幅度的基数，这里假设每一层级增加的基数是10
        const displacement = displacementVector.multiplyScalar(
          distance + explodedHeight * level
        );
        if (isExplodedView) {
          gsap.to(child.position, {
            x: `+=${displacement.x / 7.5}`,
            y: `+=${displacement.y / 7.5}`,
            z: `+=${displacement.z / 7.5}`,
            duration: 1,
            onComplete: () => {  
              // 在动画完成后，更新 explodedPositions 中的位置  
              explodedPositions.set(child.id, child.position.clone());  
            },  
            // 确保 onComplete 调用之前动画已经完成  
            onCompleteScope: child,
            onCompleteParams: [] 
          });
        }
      }
      // 递归处理子对象，同时传递爆炸中心
      if (child.children.length > 0) {
        explodeModel(child, level + 1, explosionCenter);
      }
    });
  }
  // const mesh = gltf.nodes.MeshName as Mesh;

  //爆炸图还原方法
  function implodeModel(
    object: Object3D,
    explosionCenter: Vector3
  ): void {
    object.children.forEach((child) => {
      if (child instanceof Mesh) {
        gsap.to(child.position, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
        });
      }
      if (child.children.length > 0) {
        implodeModel(child, explosionCenter);
      }
    });
  }

  function RestorePositions (positions: Map<number, Vector3>):void {
    const model: Object3D | null = modelRef.current;
    if (model) {
      model.traverse((part) => {
        if (part instanceof Mesh && positions.has(part.id)) {
          const savedPosition = positions.get(part.id);
          if (savedPosition) {
            // 使用GSAP创建动画  
            gsap.to(part.position, {  
              x: savedPosition.x,  
              y: savedPosition.y,  
              z: savedPosition.z,  
              duration: 1, // 动画持续时间为1秒  
              ease: "power1.inOut", // 可以根据需要选择缓动函数  
              onComplete: () => {  
                // 如果需要在动画完成后执行某些操作，可以在这里添加  
              }  
            });  
          }
        }
      });
    }
  };

  return (
    <>
      {hotspots.map((hotspot, index) => (
        <Hotspot position={hotspot.position} onClick={() => console.log('Hotspot clicked')} label={hotspot.label} onEdit={OnEditHotspot}/>
      ))}
      <primitive object={gltf.scene} ref={modelRef} onClick={handleClick} />
    </>
  );
};
