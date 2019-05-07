import Api from "../../utils/api.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    newsId: null,  //文章id
    longComment: [],  //长评内容
    shortComment: null,  //短评内容
    longCommentCount: null,   //长评数量
    shortCommentCount: null,  //短评数量
    voteSrc: "/images/like-fill-gay.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.newsId = options.id
    this.data.longCommentCount = options.lcount
    this.data.shortCommentCount = options.scount
    this.setData(this.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   * 获取评论内容数据
   */
  onReady: function () {
    wx.showLoading({
      title: '加载中',
    })
    //如果长评数量大于0，则先加载长评内容，显示长评
    //用户点到短评，再加载短评内容
    if (this.data.longCommentCount > 0) {
      loadLongComment.call(this)
    } else {
      loadShortComment.call(this)
    }
  },
  //点击短评,加载短评内容
  laodShortComments() {
    if (!this.data.shortComment) {
      loadShortComment.call(this)
    }
  }
})

//加载长评内容函数
function loadLongComment() {
  Api.getNewsLongComment(this.data.newsId).then(res => {
    if (res.comments) {
      this.data.longComment = handleTimeConment(res.comments)
      this.setData(this.data)
    }
    wx.hideLoading()
  }).catch(err => {
    wx.hideLoading()
    wx.showToast({
      title: '评论获取失败',
      icon: "none",
      duration: 5000
    })
  })
}

//加载短评内容函数
function loadShortComment() {
  Api.getNewsShortComment(this.data.newsId).then(res => {
    if (res.comments) {
      this.data.shortComment = handleTimeConment(res.comments)
      this.setData(this.data)
    }
    wx.hideLoading()
  }).catch(err => {
    wx.hideLoading()
    wx.showToast({
      title: '评论获取失败',
      icon: "none",
      duration: 5000
    })
  })
}
//处理评论里的tiem格式
function handleTimeConment(commentArr) {
  commentArr.forEach(item => item.time = getDate(item.time))
  return commentArr
}

//将评论里的time转化为 日期格式
//time 1557203909
function getDate(time) {
  let date = new Date(time * 1000)
  return (date.getMonth() + 1) + '-' + date.getDate() + '  ' + date.getHours() + ':' + date.getMinutes()
}