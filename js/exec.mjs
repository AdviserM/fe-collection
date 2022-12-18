import {
  deepclone,
  findTreeNode,
  findTreePath,
  listToTree,
  myTypeOf, tree2List, treeFind,
  treeForEach
} from "./utils.mjs";

const arr = [
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 10, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 10},
  {id: 4, name: '部门3', pid: 2},
  {id: 5, name: '部门4', pid: 4},
  {id: 6, name: '部门5', pid: 5},
  {id: 7, name: '部门5', pid: 6},
  {id: 8, name: '部门5', pid: 7}
]
const tree = listToTree(arr)
const target = treeFind(tree,(node,level) => {
  node.level = level
  return node.id === 8
})
const path = findTreePath(tree,(node) => {
  return node.id === 8
})
console.log(path)
// console.log(findTreePath(tree,(treeNode) => {
//   return treeNode.id === 3
// }))

