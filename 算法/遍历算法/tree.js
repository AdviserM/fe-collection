/*
* 广度优先遍历
* */
let tree = [
  {
    id: '1',
    title: '节点1',
    children: [
      {
        id: '1-1',
        title: '节点1-1'
      },
      {
        id: '1-2',
        title: '节点1-2'
      }
    ]
  },
  {
    id: '2',
    title: '节点2',
    children: [
      {
        id: '2-1',
        title: '节点2-1'
      }
    ]
  }
]

// 广度优先遍历
const treeForEachBFS = (tree,callback) => {
  if(typeof callback !== 'function') {
    throw new Error('callback must be a function')
  }
  const list = [...tree]
  let node = null
  while (node = list.shift()) {
    callback(node)
    node.children && list.push(...node.children)
  }
}

// 深度优先递归
const treeForEachDFS = (tree,callback) => {
  if(typeof callback !== 'function') {
    throw new Error('callback must be a function')
  }
  for(const node of tree) {
    // 先序遍历
    callback(node)
    if(node.children && node.children.length) {
      treeForEachDFS(node.children, callback)
    }
    // 后续遍历
    // callback(node)
  }
}

treeForEachDFS(tree,(node) => {
  console.log(node)
})
