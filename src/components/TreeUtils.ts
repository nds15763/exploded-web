import { Object3D, Vector3, Mesh, Box3, Group } from "three";
import { TreeNode } from "./TreeNode"; // 确保正确地导入TreeNode

function determineMainExplodeDirection(model: Object3D): "x" | "y" | "z" {
  // 假设有函数countPartsByDirection来计算各个方向的部件数量
  const partsCount = countPartsByDirection(model);
  // 假设partsCount是这样的对象：{ x: number, y: number, z: number }

  // 确定哪个方向的部件最多
  if (partsCount.x >= partsCount.y && partsCount.x >= partsCount.z) return "x";
  if (partsCount.y >= partsCount.x && partsCount.y >= partsCount.z) return "y";
  return "z";
}
function countPartsByDirection(model: Object3D): {
  x: number;
  y: number;
  z: number;
} {
  const directionCounts = { x: 0, y: 0, z: 0 };
  const modelCenter = new Vector3();
  new Box3().setFromObject(model).getCenter(modelCenter);

  model.traverse((child) => {
    if (child instanceof Mesh) {
      const childCenter = new Vector3();
      new Box3().setFromObject(child).getCenter(childCenter);
      const directionVector = childCenter.sub(modelCenter);

      // 计算每个方向的“数量”
      directionCounts.x += Math.abs(directionVector.x);
      directionCounts.y += Math.abs(directionVector.y);
      directionCounts.z += Math.abs(directionVector.z);
    }
  });

  return directionCounts;
}

function buildExplodeTree(
  model: Object3D,
  mainDirection: "x" | "y" | "z"
): TreeNode {
  // 找到模型的中心部件，创建根节点
  const rootPart = findCenterPart(model);
  const rootNode = new TreeNode(rootPart,0, mainDirection);
  // 从根节点开始构建树
  buildTreeForNode(
    rootNode,
    ["x", "y", "z"].filter((d) => d !== mainDirection) as ("x" | "y" | "z")[],
    model
  );

  return rootNode;
}
function buildTreeForNode(node: TreeNode, availableDirections: ("x" | "y" | "z")[], parent: Object3D) {
    parent.children.forEach((child) => {
      // 如果子对象是Mesh，创建一个TreeNode
      if (child instanceof Mesh) {
        const direction = availableDirections[0];
        const childNode = new TreeNode(child, node.level + 1, direction);
        node.addChild(childNode);
      }
      // 如果子对象是Group，递归构建子树
      else if (child instanceof Group) {
        const direction = availableDirections[0];
        const groupNode = new TreeNode(child, node.level + 1, direction);
        node.addChild(groupNode); // 添加到当前节点的子节点列表
        buildTreeForNode(groupNode, availableDirections.slice(1), child); // 递归构建
      }
    });
  }
  
  
function findCenterPart(object3D: Object3D): Mesh {
  let center = new Vector3();
  let minDistance = Infinity;
  let centerPart: Mesh | null = null;

  // 首先，计算整个模型的几何中心
  let box = new Box3().setFromObject(object3D);
  box.getCenter(center);

  // 然后，遍历所有部件，找到距离几何中心最近的部件
  object3D.traverse((child) => {
    if (child instanceof Mesh) {
      let childCenter = new Box3()
        .setFromObject(child)
        .getCenter(new Vector3());
      let distance = childCenter.distanceTo(center);
      if (distance < minDistance) {
        minDistance = distance;
        centerPart = child;
      }
    }
  });

  if (centerPart === null) {
    throw new Error("No center part found in the given Object3D.");
  }

  return centerPart;
}

function findChildParts(node: Object3D): Mesh[] {
  let childMeshes: Mesh[] = [];

  // 如果传入的node是Group且有子对象，我们将只关心子对象中的Mesh对象
  if (node.type === "Group" && node.children.length > 0) {
    // 遍历Group中的子对象
    node.children.forEach((child) => {
      // 直接子对象如果是Mesh，添加到结果数组中
      if (child instanceof Mesh) {
        childMeshes.push(child);
      }
      // 如果直接子对象是Group，仅在它不含有更深层Group时，添加其Mesh对象
      else if (child instanceof Group) {
        // 检查该Group是否有Group类型的子对象
        const hasGroupChild = child.children.some(
          (subChild) => subChild instanceof Group
        );
        // 如果没有Group类型的子对象，添加其所有Mesh对象
        if (!hasGroupChild) {
          child.children.forEach((subChild) => {
            if (subChild instanceof Mesh) {
              childMeshes.push(subChild);
            }
          });
        }
      }
    });
  }

  return childMeshes;
}

// function findChildParts(part: Mesh): Mesh[] {
//   let childParts: Mesh[] = []; // 明确初始化为空数组

//   // 假设子部件是与当前部件有相同直接父对象的其他部件
//   if (part.parent) {
//     part.parent.children.forEach((child) => {
//       // 这里我们只关心Mesh对象
//       if (child instanceof Mesh && child !== part) {
//         childParts.push(child);
//       }
//     });
//   }

//   return childParts;
// }

export { TreeNode, determineMainExplodeDirection, buildExplodeTree }; // 导出新的函数
