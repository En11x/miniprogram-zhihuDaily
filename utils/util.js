const HtmlParser = require("../utils/htmlParseUtil.js")

//字符串去空格方法
String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "")
}

//判断是否为空白字符串
String.prototype.isEmpty = function () {
  return this.trim() == ""
}

//将时间对象转化为字符串 
/**
 * param date 时间对象
 * 返回 2019.05.05 星期日
 */
function dateToStr(dateTime) {
  let year = dateTime.getFullYear()
  let month = dateTime.getMonth() + 1                 //js从0开始取 
  let date = dateTime.getDate()
  if (month < 10) {
    month = "0" + month
  }
  if (date < 10) {
    date = "0" + date
  }
  let ji = "日一二三四五六".charAt(dateTime.getDay())
  let time = year + "." + month + "." + date + " " + "星期" + ji
  let timeStr = year + month + date
  return {
    time,
    timeStr
  }
}

//快捷方法获取HtmlParser对象
/**
 * html{string}  html文本
 * return{object} 返回HtmlParser对象
 */
function $(html) {
  return new HtmlParser(html)
}



//解析news数据的body部分
/**
 * html{string} news数据的body文本
 * isDecode {boolean}  是否需要unicode 解析
 * return {object} 返回解析后的对象
 */
function parseNewsData(html, isDecode) {
  //获取html内容里 div class=question 里的内容
  let questionArr = $(html).tag("div").attr('class', 'question').match()
  let stories = []
  let $story
  let $content
  if (questionArr) {
    for (let i = 0; i < questionArr.length; i++) {
      // class=question div 里的内容转为 htmlparser对象
      $story = $(questionArr[i])
      $content = $(getArrayFirst($story.tag("div").attr('class', 'content').match()))
      //获取class=meta里 img 的 src
      //回答问题的头像图片链接 string
      let mavatar = getArrayFirst(getArrayFirst($story.tag("div").attr('class', 'meta').match()).jhe_ma('img', 'src'))
      //没有转换图片格式
      //将每条数据存到stories里
      stories.push({
        index: i,
        //获取提问的标题
        title: getArrayFirst($story.tag('h2').attr('class', 'question-title').match()),
        //头像链接
        avatar: mavatar,
        //获取回答作者的名字
        author: getArrayFirst($story.tag("span").attr('class', 'author').match()),
        bio: getArrayFirst($story.tag("span").attr('class', 'bio').match()),
        //回答的内容(很长单独解析)
        content: parseNewsContent($content),
        //获取更多链接
        more: getArrayFirst(getArrayFirst($story.tag("div").attr('class', 'view-more').match()).jhe_ma('a', 'href'))
      })
    }
  }
  return stories
}
//解析回答文章的content内容
/**
 * $story htmlparser对象
 * isDecode 是否unicode解析
 * return content 文章内容对象 
 */
function parseNewsContent($content, isDecode) {
  let content = []
  //获取$story里的所有P标签里的内容
  let ps = $content.tag('p').match()
  let p, strong, img, blockquote, em
  if (ps) {
    for (let i = 0; i < ps.length; i++) {
      //获取转义后的p标签里的内容 字符串
      p = transferSign(ps[i])
      if (!p || p.isEmpty()) continue
      //p标签里的img 字符串
      img = getArrayFirst((p.jhe_ma('img', 'src')))
      //p标签里的strong 字符串
      strong = getArrayFirst(p.jhe_om('strong'))
      //p标签里的em 字符串
      em = getArrayFirst(p.jhe_om('em'))
      //p标签里的blockquote 字符串
      blockquote = getArrayFirst(p.jhe_om('blockquote'))

      //有的回答p标签里没有图片，需要判断
      // if(!img.isEmpty()){
      //   content.push({
      //     index:i,
      //     type:'img',
      //     value:img
      //   })
      // } else if (isOnly(p,strong)){
      //   //获取<p><strong>...</strong></p>的内容
      //   strong = decodeHtml(strong)
      //   if(!strong.isEmpty()){
      //     content.push({
      //       index:i,
      //       type:'pstrong',
      //       value:strong
      //     })
      //   }
      // } else if (isOnly(p,em)){
      //   //获取<p><em>...</em></p>的内容
      //   em = decodeHtml(em)
      //   if (!em.isEmpty()) {
      //     content.push({
      //       index: i,
      //       type: 'pem',
      //       value: em
      //     })
      //   }
      // } else if (isOnly(p, blockquote)){
      //   //获取<p><blockquote>...</blockquote></p>的内容
      //   blockquote = decodeHtml(blockquote)
      //   if (!blockquote.isEmpty()) {
      //     content.push({
      //       index: i,
      //       type: 'pblockquote',
      //       value: blockquote
      //     })
      //   }
      // }else{
      //   p = decodeHtml(p)
      //   //其他类型,归为普通类型
      //   if(!p.isEmpty()){
      //     content.push({
      //       index: i,
      //       type: 'p',
      //       value: p
      //     })
      //   }
      // }

      if (img && !img.isEmpty()) {
        content.push({
          index: i,
          type: 'img',
          value: img
        })
      } else if (strong && !strong.isEmpty()) {
        //获取<p><strong>...</strong></p>的内容
        strong = decodeHtml(strong)
        content.push({
          index: i,
          type: 'pstrong',
          value: strong
        })
      } else if (em && !em.isEmpty()) {
        //获取<p><em>...</em></p>的内容
        em = decodeHtml(em)
        content.push({
          index: i,
          type: 'pem',
          value: em
        })
      } else if (blockquote && !blockquote.isEmpty()) {
        //获取<p><blockquote>...</blockquote></p>的内容
        blockquote = decodeHtml(blockquote)
        content.push({
          index: i,
          type: 'pblockquote',
          value: blockquote
        })
      } else {
        p = decodeHtml(p)
        //其他类型,归为普通类型
        if (!p.isEmpty()) {
          content.push({
            index: i,
            type: 'p',
            value: p
          })
        }
      }



    }
  }
  return content
}

//去除多余的或者难以解析的HTML并且替换转义符号
function decodeHtml(value, isDecode) {
  if (!value) return ""
  value = value.replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"').replace(/&middot;/g, '·')
  return value
}

//使用正则将转义字符转为实体
/**
 * data 字符串数据
 * return 转换成功的data数据
 */
function transferSign(data) {
  data = data.replace(/&ndash;/g, "–")
  data = data.replace(/&mdash;/g, "—")
  data = data.replace(/&hellip;/g, "…")
  data = data.replace(/&bull;/g, "•")
  data = data.replace(/&rsquo;/g, "’")
  data = data.replace(/&ndash;/g, "–")
  return data
}

//判断P标签是不是只有a标签
/**
 * 判断src是不是和target内容一样
 */
function isOnly(src, target) {
  return src.trim() == target
}


//获取数组里第一个内容
/**
 * return string
 */
function getArrayFirst(arr) {
  if (!arr || arr.length === 0) return ""
  return arr[0]
}


module.exports = {
  dateToStr,
  parseNewsData
}