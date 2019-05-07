import Api from "../../utils/api.js"         //导入api文件
import Utils from "../../utils/util.js"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUserShow: false,  //user页面是否显示
    currentDate: null, //当前加载news的时间
    sliderData: {},    //轮播图数据
    newsData: {}       //列表数据
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '加载中'
    });
    Api.getNewsLatest().then(res => {
      //获取最新数据
      let newsData = handleStories(res.stories)
      newsData.unshift({
        isLabel: true,
        title: "今日热文"
      })
      this.data.newsData = newsData
      this.data.sliderData = res.top_stories
      this.data.currentDate = new Date()
      this.setData(this.data)
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '数据加载异常，下拉重新刷新',
        icon: "none",
        duration: 5000
      })
    })
  },

  //滑到底部加载更多news
  loadMoreNews(e) {
    wx.showLoading({
      title: '加载中',
    })
    let dayStr = Utils.dateToStr(this.data.currentDate).timeStr    //20190505
    let dayBefore = new Date(this.data.currentDate.getTime() - 1000 * 24 * 60 * 60)
    let dayBeforeStr = Utils.dateToStr(dayBefore).time
    Api.getBeforeNews(dayStr).then(res => {
      let newsData = handleStories(res.stories)
      newsData.unshift({
        isLabel: true,
        title: dayBeforeStr
      })
      this.data.newsData = [...this.data.newsData, ...newsData]
      this.data.currentDate = dayBefore
      this.setData(this.data)
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '数据加载异常，下拉重新刷新',
        icon: "none",
        duration: 5000
      })
    })
  },

  /**
   * 跳转到我的收藏页面
   */
  toFavoritePage() {
    userSwitch.call(this, false)
    wx.navigateTo({
      url: '../favorite/favorite',
    })
  },

  /**
   * 跳转到设置页面
   */
  toSettingPage() {
    userSwitch.call(this, false)
    wx.navigateTo({
      url: '../setting/setting',
    })
  },

  /**
   * 跳转到文章详情页面
   */
  toDetailPage(e) {
    let newsId = e.detail.data.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${newsId}`,
    })
  },
  //返回到首页
  toHomePage() {
    userSwitch.call(this, false)
    //刷新首页
    this.onReady()
  },
  /**
   * 生命周期函数--监听页面显示
   * 页面每次显示时会执行
   */
  onShow: function () {
    //页面每次显示从storage中拿数据
    if (!this.data.newsData) {
      wx.getStorage({
        key: 'newsData',
        success: (res) => {
          this.data.newsData = res.data
          this.setData(this.data)
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   * 页面每次隐藏式触发
   */
  onHide: function () {
    //将页面数据存到storage中
    wx.setStorage({
      key: 'newsData',
      data: this.data.newsData
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onReady()
  },

  //监听user显示状态
  onUserChange(e) {
    this.data.isUserShow = e.detail.isShow
    this.setData(this.data)
  },
  //点击按钮组件事件
  ballClickEvent() {
    let isShow = !this.data.isUserShow
    userSwitch.call(this, isShow)
  }
});

//处理stories数据
function handleStories(stories) {
  if (!stories) {
    return stories
  }
  stories.forEach((item, index) => {
    if (item.images) {
      item.image = item.images[0]
    }
  })
  return stories
}

//user展开和隐藏
function userSwitch(isShow) {
  this.setData({
    isUserShow: isShow
  })
  this.selectComponent('#user').userShow(isShow)
}