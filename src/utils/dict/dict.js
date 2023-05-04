import Vue from 'vue'
import { get as getDictDetail } from './api'

export default class Dict {
  constructor (dict) {
    this.dict = dict
  }

  async init (names, completeCallback) {
    if (names === undefined || name === null) {
      throw new Error('need Dict names')
    }
    const ps = []
    names.forEach(n => {
      Vue.set(this.dict.dict, n, {})
      Vue.set(this.dict.label, n, {})
      Vue.set(this.dict, n, [])
      ps.push(getDictDetail(n).then(data => {
        this.dict[n].splice(0, 0, ...data.result.records)
        data.result.records.forEach(d => {
          Vue.set(this.dict.dict[n], d.dictValue, d)
          Vue.set(this.dict.label[n], d.dictValue, d.dictLabel)
        })
      }))
    })
    await Promise.all(ps)
    completeCallback()
  }
}
