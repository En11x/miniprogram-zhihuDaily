//注册组件
Component({
  properties:{
    //定义属性
    right: {
      type: Number,
      value: 0
    },
    width: {
      type: Number,
      value: 0
    }
  },
  data:{
    shadowDisplay:"none",
    userRight:0,
    userWidth:0,
    userHeight:0,
    animation:{}
  },
 
  //组件生命周期函数，在组件进入页面节点树时执行
  attached(){
    //获取系统信息
    wx.getSystemInfo({
      success: res=> {
        this.setData({
          userRight: (this.data.right && this.data.right > 0) ? this.data.right : res.windowWidth,
          userWidth: (this.data.width && this.data.width > 0) ? this.data.width : res.windowWidth * 0.7,
          userHeight:res.windowHeight
        })
      },
    })
  },
  methods:{
    hide() {
      this.userShow(false)
    },

    //点击阴影 关闭user 页面
    clickShadow() {
      this.hide()
    },
    //显示user函数
    userShow(isShow){
      //创建动画实例
      let animation = wx.createAnimation({
        duration:200
      })
      animation.translateX(isShow?"100%":"-100%").step()
      this.setData({
        shadowDisplay:isShow?"block":"none",
        animation:animation.export()
      })
      //触发自定义事件 onUserChange
      this.triggerEvent("toggle",{isShow:isShow})
    }
  }
})