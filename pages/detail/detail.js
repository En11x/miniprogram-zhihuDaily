// pages/detail/detail.js

import Api from "../../utils/api.js"
import Utils from "../../utils/util.js"
import Data from "../../utils/data.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    newsId: null,  //当前newsID
    isCollected: false,  //文章是否被收藏
    extraInfo: null,  //文章额外的信息  评论数 点赞人数
    newsData: {},   //news 文章数据
    likePngSrc: "/images/like.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //得到news id
    let newsId = parseInt(options.id)
    this.data.newsId = newsId
    //判断当前文章是否被收藏
    Data.findOneById(newsId).then(res => {
      if (res) {
        this.setData({
          isCollected: true
        })
      }
    })
    this.setData(this.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    loadNewsData.call(this)
  },

  //点赞
  clickLike() {
    let src = '/images/like-fill.png'
    if (this.data.likePngSrc != src) {
      this.data.extraInfo.popularity++
      this.data.likePngSrc = src
      this.setData(this.data)
    }
  },
  //跳转到评论页面
  toCommentPage(e) {
    let id = e.currentTarget.dataset.id
    let lcount = this.data.extraInfo.long_comments || 0
    let scount = this.data.extraInfo.short_comments || 0
    wx.navigateTo({
      url: `/pages/comment/comment?id=${id}&lcount=${lcount}&scount=${scount}`,
    })
  },

  //全屏预览图片
  previewImage(e) {
    let src = e.currentTarget.dataset.image
    if (src && src.length > 0) {
      wx.previewImage({
        urls: [src],
      })
    }
  },

  //点击收藏按钮收藏文章或者取消收藏
  collectOrNot() {
    if (this.data.isCollected) {
      //文章是被收藏的,从storage中移除
      Data.removeOneById(this.data.newsId).then(res => {
        this.setData({
          isCollected: false
        })
      }).catch(err => {
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 2000
        })
      })
    } else {
      //文章没有被收藏,添加到storage中

      Data.save(Object.assign(
        {
          createTime: new Date().getTime()
        },
        this.data.newsData)).then(res => {
          this.setData({
            isCollected: true
          })
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
        }).catch(err => {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 2000
          })
        })
    }
  },

  //点击按钮重新加载
  reload() {
    loadNewsData.call(this)
  }
})

//加载news文章数据
function loadNewsData() {
  let newsId = this.data.newsId
  wx.showLoading({
    title: '加载中',
  })
  Api.getNewsDetail(newsId).then(res => {
    res.body = Utils.parseNewsData(res.body)
    this.data.newsData = res
    this.setData(this.data)
    wx.hideLoading()
    wx.setNavigationBarTitle({
      title: res.title
    })
  }).catch(err => {
    wx.hideLoading()
    wx.showToast({
      title: '数据加载异常，下拉重新刷新',
      icon: "none",
      duration: 5000
    })
  })

  //请求额外的信息，主要是评论数和点赞数
  Api.getNewsExtraInfo(newsId).then(res => {
    this.data.extraInfo = res
    this.setData(this.data)
  }).catch(err => {
    wx.showToast({
      title: '评论点赞数获取失败',
      icon: "none",
      duration: 5000
    })
  })
}