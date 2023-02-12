// 将国际化文件转化为json文件 配合编辑器插件使用

const fs = require('fs');
const path = require('path');


const OUTPUT_DIR = path.resolve(__dirname)

function loadLocaleInfo() {
  const locales = require.context(OUTPUT_DIR, true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key)
    }
  });
  return {id: locales.id, messages};
}

// console.log(loadLocaleInfo())

const message = {
  en: {
    base: {
      name: 'base',
      age: 19
    },
    fromPC: {
      age: '18',
      name: 'fromPC',
      language:{
        age: '18',
        name: 'fromPC',
      }
    }
  },
  zh: {
    base: {
      name: '基础',
      age: '19岁'
    },
    fromPC: {
      age: '18岁',
      name: '来自PC'
    }
  }
}

const genJsonFile = (object = {}) => {
  const MAX_LEVEL = 2 // 只解析第二层对象
  const dfsPath = []
  const helper = (obj = {}) => {
    if (dfsPath.length > MAX_LEVEL) return
    if (typeof obj !== 'object' || obj === null) {
      return
    }
    for (const [key, value] of Object.entries(obj)) {
      dfsPath.push(key)
      if (dfsPath.length === 1) {
        // 创建dir nameSpace
        const namespace = path.resolve(OUTPUT_DIR, key)
        if (!fs.existsSync(namespace)) {
          fs.mkdirSync(namespace)
        }
      }
      if (dfsPath.length === 2) {
        // 创建json文件
        const data = JSON.stringify(value);
        const jsonPath = path.resolve(OUTPUT_DIR, `${dfsPath.join('/')}.json`)
        if (fs.existsSync(jsonPath)) {
          fs.rmSync(jsonPath)
        }
        fs.writeFileSync(jsonPath, data)
      }

      helper(value)
      dfsPath.pop()
    }
  }
  helper(object)
}

genJsonFile(message)

