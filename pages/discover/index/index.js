// pages/discover/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    current: 'tab3',
    current_scroll: 'tab1',
    tabs: [{
        key: 'tab1',
        title: '推荐'
      },
      {
        key: 'tab2',
        title: '关注'
      },
      {
        key: 'tab3',
        title: '话题'
      },
      {
        key: 'tab4',
        title: '附近'
      },
      {
        key: 'tab5',
        title: '用户'
      },
      {
        key: 'tab6',
        title: '医院'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let app = getApp();

    let that = this

    wx.getStorage({
      key: `userinfo${app.globalData.appid}`,
      success(res) {
        console.log(res.data)
        that.setData({
          userinfo: res.data.value
        })
      }
    })
  },

  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

  handleChangeScroll({
    detail
  }) {
    this.setData({
      current_scroll: detail.key
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})