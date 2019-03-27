var e = require("utils/core.js");

App({
    onShow: function() {
        this.onLaunch();
    },
    onLaunch: function() {
        var e = this;
        wx.getSystemInfo({
            success: function(t) {
                "0" == t.model.indexOf("iPhone X") ? e.setCache("isIpx", t.model) : e.setCache("isIpx", "");
            }
        });
        var t = this;
        wx.getSystemInfo({
            success: function(e) {
                wx.setStorageSync("systemInfo", e);
                var o = e.windowWidth, i = e.windowHeight;
                t.globalData.ww = o, t.globalData.hh = i;
            }
        }), this.getConfig(), this.getUserInfo(function(e) {}, function(e, t) {
            var t = t ? 1 : 0, e = e || "";
            t && wx.redirectTo({
                url: "/pages/message/auth/index?close=" + t + "&text=" + e
            });
        });
    },
    requirejs: function(e) {
        return require("utils/" + e + ".js");
    },
    getConfig: function() {
        if (null !== this.globalData.api) return {
            api: this.globalData.api,
            approot: this.globalData.approot,
            appid: this.globalData.appid
        };
        var e = wx.getExtConfigSync();
        return console.log(e), this.globalData.api = e.config.api, this.globalData.approot = e.config.approot, 
        this.globalData.appid = e.config.appid, e.config;
    },
    getCache: function(e, t) {
        var o = +new Date() / 1e3, i = "";
        o = parseInt(o);
        try {
            (i = wx.getStorageSync(e + this.globalData.appid)).expire > o || 0 == i.expire ? i = i.value : (i = "", 
            this.removeCache(e));
        } catch (e) {
            i = void 0 === t ? "" : t;
        }
        return i = i || "";
    },
    setCache: function(e, t, o) {
        var i = +new Date() / 1e3, n = !0, a = {
            expire: o ? i + parseInt(o) : 0,
            value: t
        };
        try {
            wx.setStorageSync(e + this.globalData.appid, a);
        } catch (e) {
            n = !1;
        }
        return n;
    },
    removeCache: function(e) {
        var t = !0;
        try {
            wx.removeStorageSync(e + this.globalData.appid);
        } catch (e) {
            t = !1;
        }
        return t;
    },
    getUserInfo: function(t, o) {
        var i = this, n = {};
        !(n = i.getCache("userinfo")) || n.needauth ? wx.login({
            success: function(a) {
                a.code ? e.post("wxapp/login", {
                    code: a.code
                }, function(a) {
                    a.error ? e.alert("获取用户登录态失败:" + a.message) : a.isclose && o && "function" == typeof o ? o(a.closetext, !0) : wx.getUserInfo({
                        success: function(o) {
                            n = o.userInfo, e.get("wxapp/auth", {
                                data: o.encryptedData,
                                iv: o.iv,
                                sessionKey: a.session_key
                            }, function(e) {
                                1 == e.isblack && wx.showModal({
                                    title: "无法访问",
                                    content: "您在商城的黑名单中，无权访问！",
                                    success: function(e) {
                                        e.confirm && i.close(), e.cancel && i.close();
                                    }
                                }), o.userInfo.openid = e.openId, o.userInfo.id = e.id, o.userInfo.uniacid = e.uniacid, 
                                o.needauth = 0, i.setCache("userinfo", o.userInfo, 7200), i.setCache("userinfo_openid", o.userInfo.openid), 
                                i.setCache("userinfo_id", e.id), i.getSet(), t && "function" == typeof t && t(n);
                            });
                        },
                        fail: function() {
                            console.log(a), e.get("wxapp/check", {
                                openid: a.openid
                            }, function(e) {
                                console.log(e), 1 == e.isblack && wx.showModal({
                                    title: "无法访问",
                                    content: "您在商城的黑名单中，无权访问！",
                                    success: function(e) {
                                        e.confirm && i.close(), e.cancel && i.close();
                                    }
                                }), e.needauth = 1, i.setCache("userinfo", e, 7200), i.setCache("userinfo_openid", a.openid), 
                                i.setCache("userinfo_id", a.id), i.getSet(), t && "function" == typeof t && t(n);
                            });
                        }
                    });
                }) : e.alert("获取用户登录态失败:" + a.errMsg);
            },
            fail: function() {
                e.alert("获取用户信息失败!");
            }
        }) : t && "function" == typeof t && t(n);
    },
    close: function() {
        this.globalDataClose.flag = !0, wx.reLaunch({
            url: "/pages/index/index"
        });
    },
    getSet: function() {
        var t = this;
        "" == t.getCache("cacheset") && setTimeout(function() {
            var o = t.getCache("cacheset");
            e.get("cacheset", {
                version: o.version
            }, function(e) {
                e.update && t.setCache("cacheset", e.data);
            });
        }, 10);
    },
    url: function(e) {
        e = e || {};
        var t = {}, o = "", i = "", n = this.getCache("usermid");
        o = e.mid || "", i = e.merchid || "", "" != n ? ("" != n.mid && void 0 !== n.mid || (t.mid = o), 
        "" != n.merchid && void 0 !== n.merchid || (t.merchid = i)) : (t.mid = o, t.merchid = i), 
        this.setCache("usermid", t, 7200);
    },
    impower: function(e, t, o) {
        wx.getSetting({
            success: function(i) {
                console.log(i), i.authSetting["scope." + e] || wx.showModal({
                    title: "用户未授权",
                    content: "您点击了拒绝授权，暂时无法" + t + "，点击去设置可重新获取授权喔~",
                    confirmText: "去设置",
                    success: function(e) {
                        e.confirm ? wx.openSetting({
                            success: function(e) {}
                        }) : "route" == o ? wx.switchTab({
                            url: "/pages/index/index"
                        }) : "details" == o || wx.navigateTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    globalDataClose: {
        flag: !1
    },
    globalData: {
      appid: "wx0dfd1a2779b4ad33",
      api: "http://aoquan.maimaitoo.com/app/ewei_shopv2_api.php?i=1",
      approot: "http://aoquan.maimaitoo.com/addons/ewei_shopv2/",
        userInfo: null
    }
});