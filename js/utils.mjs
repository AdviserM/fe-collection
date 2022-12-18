/**
 * @file: utils.mjs
 * @module:
 * @description: 用于常用的函数
 * @author: advisor
 * @email: 761324015@qq.com
 * @date: 2022/12/9 22:31
 */

/**
 * @description 列表转树
 * @param list 列表数据
 * @param id 节点 id
 * @param pid 节点的父id
 */
export function listToTree(list = [],id = 'id',pid = 'pid') {
  // 先存一份
  const info = list.reduce((map, cur) => {
    cur.children = []
    const key = cur[id]
    map[key] = cur
    return map
  },{})
  return list.filter(node => {
    const key = node[pid]
    info[key] && info[key]['children'].push(node)
    return node[pid] === 0 || node[pid] === null
  })
}

/**
 * @description 遍历 tree 给 操作tree节点
 * @param tree tree 数据
 * @param callback 回调函数 参数为node
 */
export function treeForEach(tree, callback, config = {childrenField: 'children'}) {
  const defaultConfig = {
    keyField: 'id',
    childrenField: 'children'
  }
  if (typeof callback !== 'function') {
    throw new Error('callback must be a function')
  }
  const {childrenField} = Object.assign(defaultConfig,config)
  const dfs = (treeData,level = 0) => {
    for (const node of treeData) {
      if (typeof callback === 'function') {
        callback(node,level)
      }
      if (node[childrenField] && node[childrenField].length) {
        dfs(node[childrenField],level + 1)
      }
    }
    return treeData
  }
  return dfs(tree)
}

export const treeFind = (tree,callback,config) => {
  const defaultConfig = {
    keyField: 'id',
    childrenField: 'children'
  }
  if (typeof callback !== 'function') {
    throw new Error('callback must be a function')
  }
  const {childrenField} = Object.assign(defaultConfig,config)
  const dfs = (treeData,level = 0) => {
    for (const node of treeData) {
      if (callback(node,level)) {
        return node
      } else if (node[childrenField] && node[childrenField].length) {
        return dfs(node[childrenField],level+ 1)
      }
    }
  }
  return dfs(tree)
}


/*
*   搜索所有符合条件的树节点 深度优先遍历方式
* */
export function findTreeNode(tree, callback, config) {
  const defaultConfig = {
    keyField: 'id',
    childrenField: 'children'
  }
  if (typeof callback !== 'function') {
    throw new Error('callback must be a function')
  }
  config = typeof config === 'object' ? config : {}
  const {keyField, childrenField} = Object.assign(defaultConfig, config)
  const ans = [], stacks = []
  const dfs = (treeData) => {
    for (const node of treeData) {
      if (node) {
        stacks.push(node)
        while (stacks.length) {
          const nodeItem = stacks.pop()
          if(callback(nodeItem)) {
            ans.push(nodeItem)
          }
          const children = nodeItem[childrenField] || []
          for(let i = children.length - 1; i >= 0; i--) {
            stacks.push(children[i])
          }
        }
      }
    }
  }
  dfs(tree)
  return ans
}


/*
*  搜索满足条件的路径
* */
export function findTreePath(tree,callback,config) {
  const defaultConfig = {
    keyField: 'id',
    childrenField: 'children'
  }
  if (typeof callback !== 'function') {
    throw new Error('callback must be a function')
  }
  config = typeof config === 'object' ? config : {}
  const { childrenField } = Object.assign(defaultConfig, config)
  const dfs = (treeData,path = []) => {
    for (const node of treeData) {
      path.push(node)
      if(callback(node)) return path
      if(node[childrenField] && node[childrenField].length) {
        const findChildren = dfs(node[childrenField],path)
        if(findChildren && findChildren.length) return findChildren
      }
      path.pop()
    }
  }
  return dfs(tree)
}

/*
* 树转列表
* */
export function tree2List(tree = [],config) {
  const ans = []
  treeForEach(tree,(node,level) => {
    ans.push({
      ...node,
      level
    })
  },config)
  return ans
}

/*
* 去重
* arr 待去重数组
*  callback 回调 bool
* */
function arrayUnique(arr, calback) {
  return arr.reduce((pre, cur) => {
    if (calback(pre, cur)) {
      pre.push(cur)
    }
    return pre
  }, [])
}

/*
* 对象过滤
* */
export function objectFilter(obj = {}, filter = []) {
  if (!Array.isArray(filter)) {
    throw new Error('type error')
  }
  if (filter && filter.length > 0) {
    return Object.fromEntries(Object.entries(obj).filter(([key]) => {
      return filter.includes(key)
    }))
  } else {
    return obj
  }

}

// 检测数据类型
export function myTypeOf(target, type) {
  const oType = Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
  if (type) {
    return oType === type
  } else {
    return oType
  }
}

// 深拷贝
export function deepclone(target) {
  const map = new Map()
  const clone = (data) => {
    if (map.has(data)) {
      return map.get(data)
    }
    // 函数类型
    if (typeof data === 'function') {
      const Fn = new Function(`return ${data.toString()}`)()
      map.set(data, Fn)
      return Fn
    }
    // 普通类型
    if (typeof data !== 'object' || data === null) {
      return data
    }
    // reg date
    if (['regexp', 'date'].includes(myTypeOf(data))) {
      const constructor = data.constructor
      const target = new constructor(data)
      map.set(data, target)
      return target
    }
    // map
    if (myTypeOf(data, 'map')) {
      const nMap = new Map()
      for (const [key, value] of data) {
        nMap.set(key, clone(value))
      }
      map.set(data, nMap)
      return nMap
    }
    // set
    if (myTypeOf(data, 'set')) {
      const nSet = new Set()
      for (const value of data) {
        nSet.add(clone(value))
      }
      map.set(data, nSet)
      return nSet
    }
    // 普通对象
    const _proto_ = Object.getPrototypeOf(data)
    const descs = Object.getOwnPropertyDescriptors(data)
    const copy = Object.create(_proto_, descs)
    for (const [key, value] of Object.entries(data)) {
      copy[key] = clone(value)
    }
    map.set(data, copy)
    return copy
  }
  return clone(target)
}

// 防抖
export function debounce(fn, wait = 50) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    const args = Array.from(arguments)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, wait)
  }
}

// 节流
export function throttle(fn, wait = 50) {
  let pre = Date.now()
  return function () {
    const args = Array.from(arguments)
    let now = Date.now()
    if (now - pre >= wait) {
      fn.apply(this, args)
      pre = now
    }
  }
}

// 节流带上计时器
export function throttleWithTimer(fn, wait) {
  let timer = null
  return function () {
    const args = [...arguments]
    if (!timer) {
      setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, wait)
    }
  }
}

//
