import { Mesh,Object3D } from "three";


export class TreeNode {
  object3D: Object3D; // 可以是Mesh或Group
  children: TreeNode[]; // 子节点
  level: number; // 层级
  explodeDirection: "x" | "y" | "z" | null; // 展开方向

  constructor(object3D: Object3D, level: number = 0, explodeDirection: "x" | "y" | "z" | null = null) {
    this.object3D = object3D;
    this.children = [];
    this.level = level;
    this.explodeDirection = explodeDirection;
  }

  addChild(child: TreeNode) {
    child.level = this.level + 1; // 正确设置子节点的层级
    this.children.push(child);
  }
}