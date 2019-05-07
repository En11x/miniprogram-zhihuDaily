const app = getApp() //获取小程序 App实例
const API_BASE = 'https://news-at.zhihu.com/api' //知乎API
const API_V4 = API_BASE + '/4' //api版本 4
const API_V3 = API_BASE + '/3' //api 版本3
const API_NEWS = API_V4 + '/news' //获取新闻api
const API_STORY = API_V4 + '/story' //获取故事api

/**
 * 封装网络请求函数
 * param url{string} 请求的URL地址
 * param data{object} 请求的参数
 * return Promise  返回一个promise对象
 */
function requestData(url, data) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data || {},
      success: function (res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject()
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

module.exports = {
  //获取最新新闻
  getNewsLatest() {
    return requestData(`${API_NEWS}/latest`)
  },

  //获取前一天的news
  getBeforeNews(date) {
    return requestData(`http://news.at.zhihu.com/api/4/news/before/${date}`)
  },

  //获取news文章内容
  getNewsDetail(newsId) {
    return requestData(`${API_NEWS}/${newsId}`)
  },

  //获取文章额外信息
  getNewsExtraInfo(newsId) {
    return requestData(`${API_STORY}-extra/${newsId}`)
  },

  //获取文章长评内容
  getNewsLongComment(newsId) {
    return requestData(`${API_STORY}/${newsId}/long-comments`)
  },

  //获取文章短评内容
  getNewsShortComment(newsId) {
    return requestData(`${API_STORY}/${newsId}/short-comments`)
  }

}