class Promise {
  PENDING = 'pending'
  FULFILLED = 'fulfilled'
  REJECTED = 'rejected'
  promiseStatus = this.PENDING
  promiseResult = undefined

  constructor(exector) {
    if(typeof exector !== 'function') {
      throw new Error('type error')
    }
    try {
      exector(this.resolve.bind(this),this.resolve.bind(this))
    } catch (e) {
      this.reject(e)
    }
  }
  resolve(result) {
    if(this.promiseStatus === this.FULFILLED) {
      this.promiseStatus = this.FULFILLED
      // this.
    }
  }
  reject(reject) {

  }
}
