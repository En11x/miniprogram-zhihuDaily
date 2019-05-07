import Curd from "../utils/curd.js"

const KEY_COLLECTION = "collectedNews"
//创建curd实例，只对key为collectedNews 的storage进行curd操作
const curd = new Curd(KEY_COLLECTION)

class Data {
  //定义静态方法，不会被实例继承，通过类来调用
  static save(data) {

    return curd.insert(data)
  }

  static removeOneById(id) {
    return curd.remove(item => item.id === id)
  }

  static findOneById(id) {
    return curd.find(item => item.id === id)
  }

  static findAll() {
    return curd.findAll().then(res => {
      if (res) {
        return res.sort((a, b) => a.createTime < b.createTime)
      }
      return []
    })
  }
}

module.exports = Data