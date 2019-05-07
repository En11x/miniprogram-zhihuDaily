//curd  对wx.storage里的数据进行curd

//es6语法
class curd {
  constructor(key) {
    if (!key) {
      throw new Error("Invalid key!")
    }
    this.key = key
  }

  //插入数据
  insert(data) {
    return this.findAll().then(d => {
      //查找所有数据,没有就是一个空数组
      d = d || []
      d.push(data)
      return setStorage(this.key, d)
    })
  }

  //删除数据
  remove(filter) {
    if (!filter) {
      return Promise.reject(new Error("invalid filter!"))
    }
    return getStorage(this.key).then(data => {

      if (data == null) {
        return Promise.resolve()
      }

      //从storage data里拿到要删除元素的下标
      let index = data.findIndex(filter)
      console.log(index)
      if (index == -1) {
        //没找到的话，继续执行。不要报错
        return Promise.resolve()
      }
      //将数据从data里删除
      data.splice(index, 1)

      //再将删除后的data在存入storage中
      return setStorage(this.key, data)
    })
  }


  //查找一条数据
  find(filter) {
    return getStorage(this.key).then(data => {
      if (!data || !filter) {
        return data
      }
      return data.find(filter)
    })
  }


  //查找所有数据
  /**
   * filter 表示filter函数的参数 如 item=>item.id==3
   */
  findAll(filter) {
    return getStorage(this.key).then(res => {
      //没有找到数据，返回一个空数组
      if (!res) {
        return []
      }
      //没有穿参数,返回完整数据
      if (!filter) {
        return res
      }
      return res.filter(filter)
    })
  }




}

//封装wx.setStorage函数 设置数据
function setStorage(key, data) {
  return new Promise(function (resolve, reject) {
    wx.setStorage({
      key: key,
      data: data,
      success: function () {
        resolve()
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

//封装wx.getStorage函数，得到数据
function getStorage(key) {
  return new Promise(function (resolve, reject) {
    wx.getStorage({
      key: key,
      success: (res) => {
        //找数据就返回
        resolve(res.data)
      },
      fail: (err) => {
        //为了方便处理，找不到数据返回null,不会报错，让程序继续进行
        //第一次添加数据是，storage中是没有数据的，所以返回null,
        resolve(null)

      }
    })
  })
}

module.exports = curd