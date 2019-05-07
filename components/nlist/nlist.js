Component({
  properties:{
    dataSource:{
      type:Array
    }
  },
  methods:{
    onTap(e){
      this.triggerEvent('click',{
        data: e.currentTarget.dataset.item
      })
    },
    onLongPress(e) {
      this.triggerEvent('longPress', {
        data: e.currentTarget.dataset.item
      })
    }
  }
})