import Data from "../../utils/data.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsData: []
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    loadCollectNews.call(this)
  },

  //点击跳转到详情页面
  toDetailPage(e) {
    let id = e.detail.data.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },

  //长按屏幕事件
  longPressEvent(e) {
    let id = e.detail.data.id
    wx.showModal({
      title: '提示',
      content: '是否删除该文章',
      success: res => {
        if (res.cancel) return
        Data.removeOneById(id).then(() => {
          wx.showToast({
            title: '删除成功',
            icon: "success",
            duration: 2000
          })
          loadCollectNews.call(this)
        }).catch(() => {
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 2000
          })
        })
      }
    })
  }
})

//从storage中加载数据
function loadCollectNews() {
  Data.findAll().then(res => {
    wx.showLoading({
      title: '加载中',
    })
    if (res.length) {
      wx.hideLoading()
    } else {
      wx.showToast({
        title: '没有收藏文章！',
        icon: 'none',
        duration: 2000
      })
    }
    this.data.newsData = res
    this.setData(this.data)
  })
}