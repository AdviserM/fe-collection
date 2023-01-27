class NPromise {
  static PENGING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'
  PromiseState = NPromise.PENGING
  PromiseResult = undefined
  onFulfilledCbs = []
  onRejectedCbs = []

  constructor(exector) {
    if (typeof exector !== 'function') throw new Error('type error')
    try {
      exector(this.resolve.bind(this), this.reject.bind(this))
    } catch (e) {
      this.reject(e)
    }
  }

  resolve(value) {
    if (this.PromiseState === NPromise.PENGING) {
      this.PromiseState = NPromise.FULFILLED
      this.PromiseResult = value
      this.onFulfilledCbs.forEach(cb => cb())
    }
  }

  reject(value) {
    if (this.PromiseState === NPromise.PENGING) {
      this.PromiseState = NPromise.REJECTED
      this.PromiseResult = value
      this.onRejectedCbs.forEach(cb => cb())
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : e => e
    onRejected = typeof onRejected === 'function' ? onRejected : e => e
    if (this.PromiseState === NPromise.FULFILLED) {
      setTimeout(() => {
        onFulfilled(this.PromiseResult)
      }, 0)
    } else if (this.PromiseState === NPromise.REJECTED) {
      setTimeout(() => {
        onRejected(this.PromiseResult)
      },)
    } else {
      this.onFulfilledCbs.push(() => {
        setTimeout(() => {
          onFulfilled(this.PromiseResult)
        }, 0)
      })
      this.onRejectedCbs.push(() => {
        setTimeout(() => {
          onRejected(this.PromiseResult)
        }, 0)
      })
    }
  }

  catch(onRejected) {
    this.then(null, onRejected)
  }
}

// const p1 = new NPromise((resolve) => {
//   console.log(1)
//   setTimeout(() => {
//     console.log('promise inited')
//     resolve(2)
//   },1000)
// })
// p1.then(res => {
//   console.log('value',res)
// })
// p1.then(res => {
//   console.log('value2',res + 1)
// })
/**
 * @description 所有promise成功则成功,有一个失败就是失败
 * @param promises
 * @returns {Promise<unknown>}
 * @constructor
 */
const PromiseAll = (promises = []) => {
  const result = []
  let count = 0
  return new Promise((resolve, reject) => {
    promises.forEach((item, index) => {
      Promise.resolve(item).then(res => {
        result[index] = res
        count++
        if (count === promises.length) resolve(result)
      }, reject)
    })
  })
}
/**
 * @description 返回最快的结果 无论是成功还是失败
 * @param promises
 * @returns {Promise<unknown>}
 * @constructor
 */
const PromiseRace = (promises = []) => {
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      Promise.resolve(promise).then(resolve,reject)
    }
  })
}

/**
 * @description 只要有一个promise成功则为成功,所有promise失败则失败
 * @param promises
 * @returns {Promise<unknown>}
 * @constructor
 */
const PromiseAny = (promises = []) => {
  let count = 0
  const reslult = []
  return new Promise((resolve,reject) => {
    promises.forEach((promise,index) => {
      Promise.resolve(promise).then(resolve,(err) => {
        count++
        reslult[index] = err
        count === promises.length && reject(reslult)
      })
    })
  })
}
/**
 * @description 不管所有的promise状态如何,最终将所有的promise结果resolve
 * @param promises
 * @returns {Promise<unknown>}
 * @constructor
 */
const PromiseAllSettled = (promises = []) => {
  const result = []
  let count = 0
  return new Promise((resolve, reject) => {
    promises.forEach((promise,index) => {
      Promise.resolve(promise).then(res => {
        result[index] = {
          status:'fulfilled',
          value:res
        }
      },(err) => {
        result[index] = {
          status: 'rejected',
          reason: err
        }

      }).finally(() => {
        count++
        if(count === promises.length) resolve(result)
      })
    })
  })
}

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(1)
  }, 1000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(2)
  }, 2000)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(3)
  }, 3000)
})

const pall = PromiseAllSettled([p1, p2, p3])
pall.then(res => {
  console.log('success',res)
}).catch(err => {
  console.log('fail',err)
})
